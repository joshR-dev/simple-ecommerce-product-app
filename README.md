# Product Details Page with Cart

A product details page with shopping cart functionality built with React Router v7, TypeScript, and plain CSS.

## Features

- Server-side rendered product page fetched from an external API
- Size selection with validation (required before adding to cart)
- Mini-cart dropdown with item quantities
- Duplicate product-size combinations consolidated into single rows
- Cart persistence via SQLite database (REST API)
- Plain CSS with CSS custom properties (variables)
- Automated tests with Vitest and Testing Library
- Docker Compose for local deployment

## Tech Stack

- **React Router v7** - Routing, SSR, data loading (loaders/actions)
- **React 19** - UI components
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **SQLite** - Cart persistence via better-sqlite3
- **CSS** - Plain CSS with custom properties
- **Vitest** - Unit and integration testing

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

Navigate to `/product` to view the product details page.

### Testing

```bash
npm run test
```

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```text
app/
  app.css                    # Global styles and CSS variables
  root.tsx                   # Root layout with CartProvider and Navbar
  routes.ts                  # Route configuration
  routes/
    home.tsx                 # Home page
    product.tsx              # Product page with server-side loader
    api.cart.ts              # Cart REST API (GET/POST/PUT/DELETE)
  components/
    navbar/                  # Top navigation bar with cart button
    mini-cart/               # Cart dropdown with item list
    product-detail/          # Product display with size selection
    size-selector/           # Size option buttons
  context/
    cart-context.tsx          # Cart state management (fetches from API)
  db/
    cart.server.ts            # SQLite database layer
  types/
    product.ts               # Shared TypeScript interfaces
```

## Cart API

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/cart` | Retrieve all cart items |
| POST | `/api/cart` | Add item (deduplicates) |
| PUT | `/api/cart` | Update item quantity |
| DELETE | `/api/cart` | Remove item |

## Docker Compose

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`. Cart data persists across container restarts via a Docker volume.
