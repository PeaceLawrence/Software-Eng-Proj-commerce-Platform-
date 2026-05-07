# CampusCartAi

A full-stack e-commerce platform built for Towson University students to buy, sell, and rent course materials and campus goods — with an AI-powered shopping assistant.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Overview

CampusCartAi is a React + Node.js/Express e-commerce web app backed by a PostgreSQL database (hosted on Neon). Students can browse and purchase products, rent items, manage a cart and wishlist, chat with other users, and get product recommendations from an AI assistant powered by the Groq API (Llama 3.3 70B).

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, React Router 7, Bootstrap 5, Recharts |
| Backend    | Node.js, Express 5                              |
| Database   | PostgreSQL (Neon serverless)                    |
| AI         | Groq SDK — Llama 3.3 70B Versatile              |
| Auth       | JWT (`jsonwebtoken`), `bcryptjs`                |
| Dev Tools  | Vite, Nodemon, ESLint                           |

---

## Project Structure

```
commerce-Platform/
├── CampusCartAi/               # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Static images
│   │   ├── Components/         # Reusable UI components
│   │   │   ├── AIButton.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ErrorPage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── RentModal.jsx
│   │   │   ├── School.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Toast.jsx
│   │   ├── Page/               # Route-level page components
│   │   │   ├── AI.jsx          # AI chatbot page
│   │   │   ├── AccountSetting.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Chat.jsx        # Seller-user messaging
│   │   │   ├── Checkout.jsx
│   │   │   ├── CreateAccount.jsx
│   │   │   ├── LogIn.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── RentalCheckout.jsx
│   │   │   ├── Rentals.jsx
│   │   │   ├── SellerMode.jsx  # Seller dashboard
│   │   │   └── Wishlist.jsx
│   │   ├── accounts.js         # Mock/local account data
│   │   ├── App.jsx             # Router setup & global state
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── data.json               # Local product seed data
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── aiController.js    # Groq AI chat handler
│   │   │   └── productController.js
│   │   ├── models/
│   │   │   └── Product.js      # Product DB queries
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   └── productRoutes.js
│   │   └── data.json           # Product data used by AI context
│   ├── server.js               # App entry point
│   ├── .env                    # Environment variables (not committed)
│   └── package.json
│
├── Project_Roles_Responsibilities.txt
├── .gitignore
└── README.md
```

---

## Features

### Shopping
- Browse and search products by category
- Add items to cart; remove or update quantities
- Wishlist to save items for later
- Toast notifications for cart and wishlist actions

### Checkout & Orders
- Checkout flow with customer info and order summary
- Order history with order status tracking
- Order cancellation

### Rentals
- Rent products for a specified duration via a modal
- Dedicated rentals page to view active/past rentals
- Separate rental checkout flow

### Seller Mode
- Sellers can list and manage their own products via a seller dashboard
- Seller-to-buyer real-time chat page

### AI Assistant
- Floating AI button available on every page
- Dedicated `/ai` chat page
- Powered by Groq (Llama 3.3 70B) — aware of all available products
- Recommends items by budget, course, or category

### Auth
- User registration and login (JWT-based)
- Unauthenticated users are redirected to `/register`
- Role-based route guards (user / admin)

### Admin
- Admin-only route to view all products including inactive ones
- Create, update, and soft-delete products
- Adjust stock levels via delta endpoint

---

## API Reference

Base URL: `http://localhost:5001/api`

### Products

| Method | Endpoint                   | Access       | Description                        |
|--------|----------------------------|--------------|------------------------------------|
| GET    | `/products`                | Public       | List all active products           |
| GET    | `/products/:id`            | Public       | Get a single active product        |
| GET    | `/products/admin/all`      | Admin        | List all products (incl. inactive) |
| POST   | `/products`                | Admin        | Create a product                   |
| PUT    | `/products/:id`            | Admin        | Update a product (partial update)  |
| DELETE | `/products/:id`            | Admin        | Soft-delete a product              |
| PATCH  | `/products/:id/stock`      | Authenticated| Adjust stock by delta              |

**POST / PUT `/products` body:**
```json
{
  "name": "Calculus Textbook",
  "description": "8th Edition, good condition",
  "price": 45.00,
  "image_url": "https://example.com/img.jpg",
  "category": "Textbooks",
  "stock_quantity": 3
}
```

**PATCH `/products/:id/stock` body:**
```json
{ "delta": -1 }
```

### AI Chat

| Method | Endpoint      | Access | Description                        |
|--------|---------------|--------|------------------------------------|
| POST   | `/ai/chat`    | Public | Send a message to the AI assistant |

**Request body:**
```json
{ "message": "What textbooks do you have under $50?" }
```

**Response:**
```json
{ "reply": "We have a Calculus textbook for $45..." }
```

---

## Database Schema

### `products`

| Column           | Type           | Notes                                  |
|------------------|----------------|----------------------------------------|
| `id`             | SERIAL PK      | Auto-incremented                       |
| `name`           | VARCHAR(255)   | Required                               |
| `description`    | TEXT           |                                        |
| `price`          | DECIMAL(10,2)  | Required, must be > 0                  |
| `image_url`      | TEXT           |                                        |
| `category`       | VARCHAR(100)   |                                        |
| `stock_quantity` | INTEGER        | Defaults to 0                          |
| `is_active`      | BOOLEAN        | Defaults to `true`; `false` = deleted  |
| `created_at`     | TIMESTAMP      | Set on insert                          |

Soft deletes are used — `DELETE` sets `is_active = false` rather than removing the row.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A PostgreSQL database (or a free [Neon](https://neon.tech) database)

### 1. Clone the repository

```bash
git clone https://github.com/Software-Engineering-group-project001/commerce-Platform.git
cd commerce-Platform
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` (see [Environment Variables](#environment-variables) below), then start the server:

```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

The API will be available at `http://localhost:5001`.

### 3. Set up the frontend

```bash
cd CampusCartAi
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Environment Variables

Create `/backend/.env` with the following keys:

```env
PORT=5001
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

| Variable       | Description                                         |
|----------------|-----------------------------------------------------|
| `PORT`         | Port for the Express server (defaults to `5001`)    |
| `DATABASE_URL` | PostgreSQL connection string (Neon or local)        |
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) |
| `JWT_SECRET`   | Secret used to sign JWT tokens                      |

The database table is created automatically on server start (`createProductTable` runs in `start()`).

---

## Team

| Name              | Role                              |
|-------------------|-----------------------------------|
| Marvin Ampofo     | Frontend Lead (UI & UX)           |
| Love Nepali       | Authentication & User Management  |
| Peace Enweriku    | Product & Admin Management        |
| Felistus Karanja  | Shopping Cart & Order Management  |
| Bryan Bassi       | Payments, Reviews & Ratings       |
| Francis Mordi     | DevOps, Database & Security       |
