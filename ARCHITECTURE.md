# Architecture

This document describes how the repository is built today. For setup, scripts and environment variables see the [README](README.md).

## 1. Overview

The repository holds three independent applications. They share no code; they only talk over HTTP.

```
 ┌─────────────────────┐        ┌─────────────────────┐
 │ frontend/ (React)   │        │ admin/ (React)      │
 │ customer storefront │        │ admin panel         │
 └──────────┬──────────┘        └──────────┬──────────┘
            │  HTTPS + JSON, auth token in the `token` header
            └──────────────┬───────────────┘
                 ┌─────────▼─────────┐        ┌──────────────┐
                 │ backend/ (Express)├───────►│ MongoDB      │
                 │ REST API          │        │ (e-commerce) │
                 └─────────┬─────────┘        └──────────────┘
                           └─────────────────►  Cloudinary (product images)
```

| App         | Stack                                                  | Entry point             |
| ----------- | ------------------------------------------------------ | ----------------------- |
| `frontend/` | React 19, React Router 7, Vite 8, Tailwind CSS 3       | `frontend/src/main.jsx` |
| `admin/`    | React 19, React Router 7, Vite 8, Tailwind CSS 3       | `admin/src/main.jsx`    |
| `backend/`  | Node.js, Express 5, Mongoose 9, Multer, Cloudinary SDK | `backend/server.js`     |

Every app has its own `package.json`, lockfile and `vercel.json`. The two React apps are single-page apps; their `vercel.json` rewrites every path to `/` so client-side routing works on refresh.

## 2. Storefront (`frontend/`)

### 2.1 Structure

| Path                             | Responsibility                                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/main.jsx`                   | Mounts `<App />` inside `BrowserRouter` and `ShopContextProvider`                                           |
| `src/App.jsx`                    | Page layout (skip link, sticky header, `<main>`, footer), route table, page titles and focus handling       |
| `src/pages/`                     | One component per route                                                                                     |
| `src/components/`                | Shared UI: `NavBar`, `SearchBar`, `Hero`, `ProductGrid`, `ProductItem`, `Title`, `CartTotal`, `Footer`, ... |
| `src/context/ShopContext.jsx`    | Global state and every API call that touches products or the cart                                           |
| `src/hooks/useHideOnScroll.js`   | Hides the sticky header while scrolling down                                                                |
| `src/hooks/useRevealOnScroll.js` | Adds `is-revealed` to `[data-reveal]` elements as they enter the viewport                                   |
| `src/constants/storage.js`       | `TOKEN_STORAGE_KEY` (the `localStorage` key for the login token)                                            |
| `src/utils/motion.js`            | `prefersReducedMotion()`                                                                                    |
| `src/assets/assets.js`           | Image imports (`assets`) and the 52 built-in sample products (`products`)                                   |
| `src/index.css`                  | Tailwind layers, shared component classes and global accessibility rules                                    |

### 2.2 Routing

Defined in `src/App.jsx`:

| Path                  | Page               | Notes                                              |
| --------------------- | ------------------ | -------------------------------------------------- |
| `/`                   | `pages/Home`       |                                                    |
| `/collection`         | `pages/Collection` | Filters, sort, and the search bar                  |
| `/product/:productId` | `pages/Product`    |                                                    |
| `/cart`               | `pages/Cart`       |                                                    |
| `/place-order`        | `pages/PlaceOrder` | Checkout                                           |
| `/orders`             | `pages/Orders`     | Needs a login token to load real orders            |
| `/login`              | `pages/Login`      | Login and sign-up; redirects to `/` once logged in |
| `/about`, `/contact`  | static pages       |                                                    |
| `/home`               | redirect to `/`    |                                                    |
| `/404`                | `pages/NoPage`     | Header, search bar and footer are hidden here      |
| `*`                   | redirect to `/404` |                                                    |

The page content is keyed by `location.pathname`, so every navigation remounts the page. That also resets per-page state, such as the selected size on a product page. On each navigation `App.jsx` updates `document.title`, scrolls to the top and moves focus to `<main>`.

### 2.3 State and data flow

All shared state lives in `ShopContext` (`src/context/ShopContext.jsx`):

| Value                                   | Meaning                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `products`, `isLoadingProducts`         | Sample products from `assets.js` followed by products from `GET /api/product/list`               |
| `cartItems`                             | `{ [productId]: { [size]: quantity } }`                                                          |
| `token`, `setToken`                     | Login token; also persisted in `localStorage` under `TOKEN_STORAGE_KEY`                          |
| `search`, `showSearch`                  | Search bar text and visibility                                                                   |
| `addToCart`, `UpdateQuantity`           | Update the cart locally and, when logged in, on the server (`/api/cart/add`, `/api/cart/update`) |
| `getCartCount`, `getCartAmount`         | Derived cart totals                                                                              |
| `currency` (`£`), `delivery_fee` (`10`) | Display currency and flat shipping fee                                                           |
| `navigate`, `BACKEND_URL`               | React Router navigation and `VITE_BACKEND_URL`                                                   |

Load sequence:

1. On mount, products are fetched once. The sample products only appear if that request succeeds, because they are merged in the same success branch.
2. If a token is already stored, `POST /api/cart/get` replaces `cartItems` with the server cart. This happens only on page load, not right after logging in.
3. Guests keep the cart only in memory, so a reload empties it.

Pages derive their lists from context with `useMemo`: the collection filter and sort, the cart rows, related products, latest and bestsellers.

Placing an order (`pages/PlaceOrder.jsx`):

1. The page builds `items` from `cartItems` plus product data. Each item carries `size` and `quanitity`, a field name the admin panel also reads.
2. It sends `items`, an `address` object and `amount` (cart total plus delivery fee) to `POST /api/order/place`.
3. On success it clears the cart and navigates to `/orders`.

### 2.4 Styling and UI infrastructure

- **Tailwind** (`tailwind.config.js`):
  - fonts: Outfit (sans), Prata (serif)
  - an extra `xs` breakpoint at 360px
  - animations: `fade-in`, `fade-in-up`, `slide-down`, `pop-in`, `bump`, `shimmer`
  - `future.hoverOnlyWhenSupported`, so hover styles only apply on devices that can hover
- **Shared classes** (`src/index.css`): `page-container` (page gutters), `btn-primary`, `btn-secondary`, `icon-btn` (fixed 40/44px tap targets), and `form-label`, `form-input`, `form-error`.
- **CSS Modules** for component-specific styles (`*.module.css`), plus plain `Hero.css` for Swiper overrides.
- **Accessibility features:** skip link, a visible `:focus-visible` outline, `prefers-reduced-motion` rules, the mobile menu as a focus-trapped dialog (`NavBar.jsx`), live result counts (`role="status"`) and labelled form fields.

## 3. Admin panel (`admin/`)

| Path                         | Responsibility                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `src/App.jsx`                | Shows `<Login />` until a token exists, then the layout (`Navbar`, `Sidebar`) and routes |
| `src/config.js`              | `backendURL` (`VITE_BACKEND_URL`) and `currency`                                         |
| `src/pages/Add.jsx`          | Product form; sends `multipart/form-data` (`image1`–`image4`) to `POST /api/product/add` |
| `src/pages/List.jsx`         | `GET /api/product/list`; remove with `POST /api/product/remove` after confirmation       |
| `src/pages/Orders.jsx`       | `POST /api/order/list`; status changes with `POST /api/order/status`                     |
| `src/components/Sidebar.jsx` | Navigation: equal-width tabs on phones, sidebar from the `md` breakpoint                 |

Routes: `/` redirects to `/add`; the others are `/add`, `/list` and `/orders`. The admin token is kept in React state and mirrored to `localStorage` (`token`).

## 4. Backend (`backend/`)

### 4.1 Request pipeline (`server.js`)

1. `app.set("trust proxy", 1)`: trusts one proxy hop, so rate limiting sees the real client IP.
2. `helmet()` with `crossOriginResourcePolicy: cross-origin`.
3. `express.json()`, then a fallback that sets `req.body = {}` when no body was parsed (Express 4 behaviour).
4. `cors()`: any origin, or only the `CORS_ORIGINS` list when that variable is set.
5. Routers. `/api/user` is wrapped in a rate limiter (50 requests per 15 minutes per IP).
6. An error handler that returns `{ success: false, message }`. Upload errors return 400; other errors return their status or 500.

### 4.2 Endpoints

All responses use the shape `{ success: boolean, message?, ...data }`. Most application errors are returned with HTTP 200 and `success: false`.

| Method | Path                    | Guard                | Controller                                 | Used by           |
| ------ | ----------------------- | -------------------- | ------------------------------------------ | ----------------- |
| GET    | `/`                     | –                    | inline (`"API is Working"`)                | –                 |
| POST   | `/api/user/register`    | rate limit           | `userController.registerUser`              | storefront        |
| POST   | `/api/user/login`       | rate limit           | `userController.loginUser`                 | storefront        |
| POST   | `/api/user/admin`       | rate limit           | `userController.adminLogin`                | admin             |
| GET    | `/api/product/list`     | –                    | `productController.listProducts`           | storefront, admin |
| POST   | `/api/product/add`      | `adminAuth` + Multer | `productController.addProduct`             | admin             |
| POST   | `/api/product/remove`   | `adminAuth`          | `productController.removeProduct`          | admin             |
| POST   | `/api/product/single`   | –                    | `productController.getSingleProduct`       | no client found   |
| POST   | `/api/cart/add`         | `authUser`           | `cardController.addToCart`                 | storefront        |
| POST   | `/api/cart/update`      | `authUser`           | `cardController.updateCart`                | storefront        |
| POST   | `/api/cart/get`         | `authUser`           | `cardController.getUserCart`               | storefront        |
| POST   | `/api/order/place`      | `authUser`           | `orderController.placeOrder` (COD)         | storefront        |
| POST   | `/api/order/sepah`      | `authUser`           | `orderController.placeOrderSepah` (stub)   | no client found   |
| POST   | `/api/order/tejarat`    | `authUser`           | `orderController.placeOrderTejarat` (stub) | no client found   |
| POST   | `/api/order/userorders` | `authUser`           | `orderController.userOrders`               | storefront        |
| POST   | `/api/order/list`       | `adminAuth`          | `orderController.allOrders`                | admin             |
| POST   | `/api/order/status`     | `adminAuth`          | `orderController.updateStatus`             | admin             |

### 4.3 Authentication and authorization

- **Customers:**
  - `loginUser` and `registerUser` return `jwt.sign({ id })`, signed with `JWT_SECRET` and no expiry.
  - The storefront sends the token in a `token` request header.
  - `middleware/auth.js` (`authUser`) verifies it (HS256) and writes the user id to `req.body.userID`.
- **Admin:**
  - `adminLogin` compares the posted credentials with `ADMIN_EMAIL`/`ADMIN_PASSWORD` in constant time and returns `jwt.sign({ role: "admin", email })`.
  - `middleware/adminauth.js` accepts only tokens with `role === "admin"` and the configured email.
- **Passwords:** hashed with bcrypt (10 salt rounds). Sign-up requires `validator.isStrongPassword` and more than 8 characters.

### 4.4 Data model (`models/`)

| Model     | Fields                                                                                                                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`    | `name`, `email` (unique), `password` (hash), `cartData` (object, saved even when empty: `minimize: false`)                                                |
| `product` | `name`, `description`, `price`, `image` (Cloudinary URLs), `category`, `subCategory`, `sizes`, `bestSeller`, `date`                                       |
| `order`   | `userID`, `items`, `amount`, `address`, `status` (default `"Order Placed"`), `statusState` (`info`/`success`/`error`), `paymentMethod`, `payment`, `date` |

`config/mongodb.js` enables Mongoose `sanitizeFilter`, so `$`-operators sent in request data are treated as literal values. It connects to `${MONGODB_URI}/e-commerce`.

### 4.5 Uploads

`middleware/multer.js` accepts:

- JPEG, PNG, WebP, GIF and AVIF images
- up to 10 MB each, at most 4 files

Files are written to the OS temp directory under a random name. `addProduct` then uploads each file to Cloudinary and stores the returned `secure_url`.

## 5. Configuration and constants

| Where                                  | What                                                              | Scope              |
| -------------------------------------- | ----------------------------------------------------------------- | ------------------ |
| `backend/.env`                         | Server secrets and settings (see README)                          | server only        |
| `frontend/.env`, `admin/.env`          | `VITE_BACKEND_URL`, which is **compiled into the browser bundle** | public             |
| `frontend/src/constants/storage.js`    | `TOKEN_STORAGE_KEY`                                               | storefront         |
| `frontend/src/context/ShopContext.jsx` | `currency`, `delivery_fee`, size order used by `sortSizes`        | storefront         |
| `admin/src/config.js`                  | `backendURL`, `currency`                                          | admin              |
| `frontend/pnpm-workspace.yaml`         | pnpm `minimumReleaseAge` and a `minimatch` override               | storefront tooling |

Some values intentionally appear in more than one app because the apps share no code. These are the currency, the size order (`S`, `M`, `L`, `XL`, `XXL`), the category names and the `token` storage key. Changing one of them means updating the storefront, the admin panel and, where stored, existing data.

## 6. Safe extension points

- **New storefront page:** add a component in `frontend/src/pages/`, register it in the `pages` map in `frontend/src/App.jsx` (path, element, title), and link it from `NavBar.jsx` if needed.
- **New product listing:** reuse `<ProductGrid products={...} />`. It renders the list, the loading skeletons and the scroll reveal.
- **New API endpoint:** add a controller function, then a route in the matching `backend/routes/*Route.js` with `authUser` or `adminAuth` as needed. Keep the `{ success, message }` response shape the clients expect.
- **New global state:** add it to `ShopContext` and to its `value` object.

## 7. Known limitations

These are confirmed in the current code.

- **Client-trusted order data:** `placeOrder` stores the `items` and `amount` sent by the browser without recalculating prices on the server.
- **Bestseller flag lost:** the admin form sends `bestseller`, but the schema field is `bestSeller`, so the flag is not saved. Database products therefore never appear in _Best Sellers_, which reads `bestseller`.
- **Validation result ignored:** `addProduct` responds with success even when product validation fails; the failure is only logged.
- **Bank payments:**
  - Bank Sepah and Tejarat are not implemented. The checkout shows a "not available yet" message.
  - `placeOrderSepah` and `placeOrderTejarat` have empty bodies and never send a response.
- **Contact details not stored:** the checkout collects email and phone but does not send them, while the admin order view displays `address.phone`.
- **Sample orders:** `pages/Orders.jsx` always shows three sample order rows (products 2–4) before the user's real orders.
- **Server cart sync:** the server cart is loaded only on page load. Logging in does not merge or fetch it until the next reload.
- **Tokens:** JWTs have no expiry, and logging out only removes the token from the browser.
- **No automated tests** exist in the repository.
- **`/api/product/single`:** this endpoint is not called by either client.
