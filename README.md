# Product Details Page with Cart

A product details page with shopping cart functionality built with React Router v7, TypeScript, and plain CSS.

## Features

- Server-side rendered product page fetched from an external API
- Size selection with validation (required before adding to cart)
- Mini-cart dropdown with item quantities
- Duplicate product-size combinations consolidated into single rows
- Cart persistence via localStorage
- Plain CSS with CSS custom properties (variables)
- Docker support for containerized deployment

## Tech Stack

- **React Router v7** - Routing, SSR, data loading (loaders)
- **React 19** - UI components
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS** - Plain CSS with custom properties

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
  components/
    navbar/                  # Top navigation bar with cart button
    mini-cart/               # Cart dropdown with item list
    product-detail/          # Product display with size selection
    size-selector/           # Size option buttons
  context/
    cart-context.tsx          # Cart state management with localStorage
  types/
    product.ts               # Shared TypeScript interfaces
```

## Docker Deployment

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```
