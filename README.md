# Full-Stack E-commerce Website - Clothing Store

# Overview

This project is a Full-Stack E-commerce Website built using the MERN stack (MongoDB, Express.js, React, and Node.js). The website offers a seamless shopping experience for users looking to buy clothes, with features that enhance user experience and streamline the shopping process.

The repository contains three independent applications:

| Folder      | What it is                                         | Package manager | Dev port |
| ----------- | -------------------------------------------------- | --------------- | -------- |
| `frontend/` | Customer storefront (React + Vite + Tailwind CSS)  | pnpm            | 5173     |
| `admin/`    | Admin panel (React + Vite + Tailwind CSS)          | npm             | 5174     |
| `backend/`  | REST API (Express + MongoDB/Mongoose + Cloudinary) | npm             | 4000     |

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for how the pieces fit together.

# Features

What the code currently implements:

- **User Authentication**: Registration and login with hashed passwords (bcrypt) and JSON Web Tokens.
- **Product Catalogue**: Home page with a hero carousel, latest collection and bestsellers; product pages with an image gallery, size selection and related products. The catalogue combines 52 built-in sample products with the products stored in MongoDB.
- **Search and Filter**: Search by product name, filter by category (Men, Women, Kids) and type (Topwear, Bottomwear, Winterwear), and sort by price.
- **Shopping Cart**: Add items by size, change quantities and remove items. For logged-in users the cart is saved on the server; for guests it lives only in the open browser tab.
- **Checkout**: Delivery form and order placement with **Cash on Delivery**. Bank Sepah and Bank Tejarat appear as options but are not implemented yet.
- **Order History**: Logged-in users can see their orders and the status set by the admin.
- **Admin Panel**: Admin login, add products (up to 4 images uploaded to Cloudinary), list and remove products, list all orders and update their status.
- **Responsive and Accessible Design**: Mobile-first layouts from 280px phones to desktop, keyboard navigation, screen-reader labels and reduced-motion support.

# Tech Stack

- **Frontend** (storefront and admin):
  - React 19 with React Router 7
  - Vite 8
  - Tailwind CSS 3
  - Axios, React-Toastify, Swiper (storefront carousel)
- **Backend**:
  - Node.js and Express 5
  - MongoDB with Mongoose 9
  - JSON Web Tokens (`jsonwebtoken`) and `bcrypt` for authentication
  - Multer (uploads), Helmet (security headers), express-rate-limit, validator
- **Others**:
  - Cloudinary (for image storage)

# Requirements

- **Node.js 20.19+** (or 22.12+), required by Vite 8 and Mongoose 9 (`backend/package.json` declares `"node": ">=20.19.0"`).
- **pnpm** for `frontend/`, **npm** for `admin/` and `backend/`.
- A MongoDB database and a Cloudinary account.

# Installation

1. **Clone the repository**
2. **Install dependencies** (each app separately):

```bash
cd frontend && pnpm install
```

```bash
cd admin && npm install
```

```bash
cd backend && npm install
```

3. **Create the environment files** described below.

# Environment Variables

**`backend/.env`**

| Variable                | Purpose                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `PORT`                  | API port (defaults to `4000`)                                                           |
| `MONGODB_URI`           | MongoDB connection string; the API uses the `e-commerce` database on it                 |
| `JWT_SECRET`            | Secret used to sign and verify login tokens                                             |
| `ADMIN_EMAIL`           | Admin panel login email                                                                 |
| `ADMIN_PASSWORD`        | Admin panel login password                                                              |
| `CLOUDINARY_NAME`       | Cloudinary cloud name                                                                   |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                                                      |
| `CLOUDINARY_SECRET_KEY` | Cloudinary API secret                                                                   |
| `CORS_ORIGINS`          | _Optional._ Comma-separated allowed origins. When it is not set, any origin is allowed. |

**`frontend/.env`** and **`admin/.env`**

| Variable           | Purpose                                                   |
| ------------------ | --------------------------------------------------------- |
| `VITE_BACKEND_URL` | Base URL of the backend API, e.g. `http://localhost:4000` |

`VITE_` variables are built into the browser bundle, so never put secrets in them. `.env` files are ignored by Git.

# Scripts

| Folder      | Command           | What it does                                          |
| ----------- | ----------------- | ----------------------------------------------------- |
| `frontend/` | `pnpm dev`        | Start the storefront dev server                       |
| `frontend/` | `pnpm build`      | Production build into `frontend/dist`                 |
| `frontend/` | `pnpm lint`       | Run ESLint                                            |
| `frontend/` | `pnpm preview`    | Serve the production build locally                    |
| `admin/`    | `npm run dev`     | Start the admin dev server                            |
| `admin/`    | `npm run build`   | Production build into `admin/dist`                    |
| `admin/`    | `npm run lint`    | Run ESLint                                            |
| `admin/`    | `npm run preview` | Serve the production build locally                    |
| `backend/`  | `npm start`       | Start the API                                         |
| `backend/`  | `npm run server`  | Start the API and restart on changes (`node --watch`) |

There are no automated tests or type checking in this repository yet.

# Project Structure

```
.
├── frontend/          Storefront (React)
│   └── src/
│       ├── pages/       One component per route
│       ├── components/  Shared UI (NavBar, Footer, Hero, ProductGrid, ...)
│       ├── context/     ShopContext: products, cart, login token
│       ├── hooks/       Scroll behaviour hooks
│       ├── constants/   Shared constants
│       ├── utils/       Small helpers
│       └── assets/      Images and the built-in sample products
├── admin/             Admin panel (React)
│   └── src/
│       ├── pages/       Add, List, Orders
│       ├── components/  Navbar, Sidebar, Login
│       └── config.js    API URL and currency
└── backend/           REST API (Express)
    ├── routes/        URL → controller mapping
    ├── controllers/   Request handling
    ├── models/        Mongoose schemas
    ├── middleware/    Auth and file upload
    └── config/        MongoDB and Cloudinary setup
```

Each app also contains a `vercel.json` for deployment on Vercel.

# Configuration Notes

- **pnpm (frontend):** `frontend/pnpm-workspace.yaml` only installs package versions that have been public for at least one day and pins a patched `minimatch` for ESLint.

# Links

[Figma File Design Link - Google Drive](https://drive.google.com/file/d/1Fc5Hrv7dbnu4nH_Jmyu0Q6MoIBmPuCf6/view?usp=drive_link)
