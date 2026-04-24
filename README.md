# HR AI Chatbot API

Backend API for an AI-powered HR chatbot built with Node.js, Express, PostgreSQL, and OpenAI.

---

## Features

- User registration and login with JWT authentication
- Role-Based Access Control (RBAC)
- Protected API routes
- PostgreSQL database integration
- AI-powered chatbot using OpenAI
- RESTful API design

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT (Authentication)
- bcrypt (Password hashing)
- OpenAI API

---

## API Endpoints

### Auth

- `POST /register` → Register a new user
- `POST /login` → Login and receive JWT token

### Protected

- `GET /profile` → Get user profile (requires token)

### RBAC

- `GET /admin` → Admin-only route
- `GET /recruiter` → Recruiter/Admin route

### AI

- `POST /chat` → Chat with AI assistant (requires token)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/eliezaylaa/hr-ai-chatbot-api.git
cd hr-ai-chatbot-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=4567
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hr_ai_chatbot
JWT_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
```

### 4. Run the server

```bash
npm run dev
```

---

## Example Request

```bash
curl -X POST http://localhost:4567/chat \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"message":"How can I improve my CV?"}'
```

---

## Project Structure

```
src/
  server.js
  db.js
  auth.js
  middleware.js
  openai.js
```

---

## Notes

- `.env` file is not committed for security reasons
- OpenAI usage may require billing setup
- Tokens must be included in protected routes

---

## Author

Elie Zaylaa
