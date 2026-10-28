# Wanderlust Server

Backend service for the Wanderlust tour booking platform, built with Node.js and Express.

## Features

- Manage travel packages: create, read, update and delete destinations
- Create and cancel tour bookings
- View bookings by user email
- JWT verification via Better Auth JWKS on protected destination and booking endpoints, including creation, update, deletion, and booking retrieval.

## Technologies

- Node.js
- Express.js
- MongoDB
- jose (JWT verification)
- CORS
- dotenv

## API Endpoints

| Method | Endpoint              | Description                | Auth |
| ------ | --------------------- | -------------------------- | ---- |
| GET    | `/destinations`       | Get all destinations       | No   |
| GET    | `/destinations/:id`   | Get a single destination   | Bearer JWT |
| POST   | `/destinations`       | Add a new destination      | No   |
| PATCH  | `/destinations/:id`   | Update a destination       | No   |
| DELETE | `/destinations/:id`   | Delete a destination       | No   |
| POST   | `/booking`            | Create a booking           | No   |
| GET    | `/my-bookings/:email` | Get bookings by email      | No   |
| DELETE | `/my-bookings/:id`    | Cancel a booking           | No   |

> Authentication on the remaining routes is in progress.

## Environment Variables

Create a `.env` file in the root directory:

    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    FRONTEND_HOMEPAGE_URL=http://localhost:3000

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Add the `.env` file
4. Start the server: `npm run dev`

## Frontend

This API is used by the [Wanderlust frontend](https://github.com/rezasdsju/wanderlust-frontend).