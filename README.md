# Wanderlust Server

Backend service for the Wanderlust tour booking platform, built with Node.js and Express.

## Features

- Manage travel packages: create, read, update and delete destinations
- Create and cancel tour bookings
- View bookings by user email
- JWT verification via Better Auth JWKS on protected destination and booking endpoints, including creation, update, deletion, and booking retrieval.
- Expose API status, available endpoints, and JWT protection details in the root response

## Technologies

- Node.js
- Express.js
- MongoDB
- jose (JWT verification)
- CORS
- dotenv


## Backend API

**Base URL:** https://wanderlust-backend-pqrs.vercel.app/

## API Endpoints

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| GET | `/destinations` | Get all destinations | No |
| GET | `/featured-destinations` | Get up to 5 featured destinations | No |
| GET | `/destinations/:id` | Get a single destination | Bearer JWT |
| POST | `/destinations` | Add a new destination | Bearer JWT |
| PATCH | `/destinations/:id` | Update a destination | Bearer JWT |
| DELETE | `/destinations/:id` | Delete a destination | Bearer JWT |
| POST | `/booking` | Create a booking | Bearer JWT |
| GET | `/my-bookings/:email` | Get bookings by email | Bearer JWT |
| DELETE | `/my-bookings/:id` | Cancel a booking | Bearer JWT |

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