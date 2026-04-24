const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = require("./db");
const openai = require("./openai");
const { generateToken } = require("./auth");
const { authMiddleware, authorizeRoles } = require("./middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Chatbot is running",
  });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, role = "candidate" } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role, created_at`,
      [email, hashedPassword, role],
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Error registering user",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error logging in",
    });
  }
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user,
  });
});

app.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin route",
    user: req.user,
  });
});

app.get(
  "/recruiter",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  (req, res) => {
    res.json({
      message: "Recruiter route",
      user: req.user,
    });
  },
);

app.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an HR assistant. Help candidates with CVs, interviews, job applications, and career advice. Keep answers clear, practical, and professional.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    await pool.query(
      `INSERT INTO chat_messages (user_id, user_message, ai_response)
       VALUES ($1, $2, $3)`,
      [req.user.id, message, aiResponse],
    );

    res.json({
      userMessage: message,
      aiResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generating AI response",
    });
  }
});

app.get("/chat/history", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_message, ai_response, created_at
       FROM chat_messages
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [req.user.id],
    );

    res.json({
      history: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching chat history",
    });
  }
});

module.exports = app;
