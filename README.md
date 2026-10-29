# ShopLane E-Commerce App

A modern full-stack e-commerce platform built with React, Vite, Express, and SQLite. It includes a responsive storefront, product catalog, search/filtering, shopping cart, checkout flow, order management, and protected admin dashboard.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: SQLite with better-sqlite3
- Auth: JWT-based authentication
- Styling: Custom responsive CSS with light/dark mode support

## Features
- Homepage with hero banners, featured/trending products, category cards, customer reviews, and footer
- Product catalog with search, filtering, sorting, and pagination
- Product detail pages with reviews and related products
- User registration, login, logout, and profile management
- Cart flow with quantity updates and order summary
- Secure checkout with shipping details and payment summary
- Admin dashboard with product CRUD and order tracking
- SQLite-based persistence for products, users, orders, reviews, and metadata

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Create the environment file

```bash
cp .env.example .env
```

Update the values as needed. The default values are enough to run the app locally.

### 3) Start the app

```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Frontend app: http://localhost:5173

### 4) Seeded demo accounts

- Admin: admin@shoplane.com / admin123
- Customer: user@shoplane.com / user123

## Production note

The app is configured for local sandbox testing. Payment provider integration (such as Stripe or Razorpay) is intentionally not enabled until valid credentials are provided; the checkout flow is ready for a real provider integration.

## Project structure

```bash
.
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── data/
│   ├── src/
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Database setup

The app automatically creates the SQLite database and seeds demo data on first server startup. The database is stored in:

```bash
server/data/store.db
```

## Environment variables

See the `.env.example` file for the full list.

## Notes

- The app uses a mock sandbox checkout experience and does not rely on any external payment credentials.
- Product images use remote Unsplash sources for realistic mock data.
- The app is designed for local testing and deployment-ready structure and code organization.
