# HR AI Chatbot API

Backend API for an AI-powered HR chatbot built with Node.js, Express, PostgreSQL, OpenAI, JWT authentication, RBAC, and Docker.

## Features

- User registration and login
- JWT authentication
- Role-Based Access Control (RBAC)
- Protected routes
- PostgreSQL database integration
- OpenAI-powered HR chatbot
- Docker and Docker Compose setup
- RESTful API structure

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- OpenAI API
- JWT
- bcrypt
- Docker
- Docker Compose

## API Endpoints

### Auth

- `POST /register` - Register a new user
- `POST /login` - Login and receive JWT token

### User

- `GET /profile` - Get authenticated user profile

### RBAC

- `GET /admin` - Admin-only route
- `GET /recruiter` - Recruiter/Admin route

### AI

- `POST /chat` - Send a message to the HR AI assistant

## Environment Variables

Create a `.env` file:

```env
PORT=4567
DATABASE_URL=postgresql://postgres:postgres@db:5432/hr_ai_chatbot
JWT_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
```

For local development without Docker, use:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hr_ai_chatbot
```

## Run with Docker

```bash
docker compose up --build
```

App runs on:

```text
http://localhost:4568
```

## Run Locally

```bash
npm install
npm run dev
```

App runs on:

```text
http://localhost:4567
```

## Example Requests

### Register

```bash
curl -X POST http://localhost:4567/register \
-H "Content-Type: application/json" \
-d '{"email":"test@gmail.com","password":"12345"}'
```

### Login

```bash
curl -X POST http://localhost:4567/login \
-H "Content-Type: application/json" \
-d '{"email":"test@gmail.com","password":"12345"}'
```

### Protected Profile

```bash
curl http://localhost:4567/profile \
-H "Authorization: Bearer YOUR_TOKEN"
```

### AI Chat

```bash
curl -X POST http://localhost:4567/chat \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"message":"How can I improve my backend developer CV for an apprenticeship?"}'
```

## Project Structure

```text
src/
  server.js
  db.js
  auth.js
  middleware.js
  openai.js
```

## Roadmap

- Store chat history in PostgreSQL
- Add recruiter dashboard endpoints
- Add request validation
- Add unit and integration tests
- Deploy API to a cloud platform

## Notes

- `.env` is not committed for security reasons
- OpenAI API usage may require billing setup
- Docker uses internal database host `db`

## Author

Elie Zaylaa
