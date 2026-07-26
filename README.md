# Quora-like Express API

A RESTful API for a question-and-answer application built with Express.js and PostgreSQL.

## Features

- Create, read, update, delete, and search questions
- Create and view answers for a question
- Delete all answers belonging to a question
- Automatically delete answers when their question is deleted
- Validate request data and handle API errors
- Group related APIs using Express Router

## Technologies

- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)
- dotenv
- Postman

## Installation

Install the project dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=quora_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

Do not commit the `.env` file because it contains database credentials.

## Running the Server

```bash
npm start
```

The server will run at:

```text
http://localhost:4000
```

Test the server:

```http
GET /test
```

## Question APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/questions` | Create a question |
| GET | `/questions` | Get all questions |
| GET | `/questions/search?title=value` | Search by title |
| GET | `/questions/search?category=value` | Search by category |
| GET | `/questions/:questionId` | Get a question by ID |
| PUT | `/questions/:questionId` | Update a question |
| DELETE | `/questions/:questionId` | Delete a question |

### Question Request Body

```json
{
  "title": "What is Express.js?",
  "description": "I want to understand how Express works with Node.js.",
  "category": "Software"
}
```

## Answer APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/questions/:questionId/answers` | Create an answer |
| GET | `/questions/:questionId/answers` | Get answers for a question |
| DELETE | `/questions/:questionId/answers` | Delete all answers for a question |

### Answer Request Body

```json
{
  "content": "Express.js is a web framework for Node.js."
}
```

The answer content must not exceed 300 characters.

## HTTP Status Codes

- `200 OK` — Request completed successfully
- `201 Created` — Resource created successfully
- `400 Bad Request` — Invalid request data
- `404 Not Found` — Question or answer was not found
- `500 Internal Server Error` — Database or server error

## Database Tables

- `questions`
- `answers`
- `question_votes`
- `answer_votes`

The `answers.question_id` foreign key uses `ON DELETE CASCADE`, so deleting a question also deletes all of its answers.