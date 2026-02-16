import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MiniCart } from "./index";
import { CartProvider, useCart } from "~/context/cart-context";

function AddItemButton() {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() =>
        addToCart({
          productId: 1,
          productTitle: "Classic Tee",
          sizeLabel: "S",
          price: 75,
          imageURL: "https://example.com/image.jpg",
        })
      }
    >
      Add Item
    </button>
  );
}

describe("MiniCart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows empty message when no items", () => {
    render(
      <CartProvider>
        <MiniCart />
      </CartProvider>,
    );
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("renders item details when items exist", () => {
    render(
      <CartProvider>
        <AddItemButton />
        <MiniCart />
      </CartProvider>,
    );
    act(() => screen.getByText("Add Item").click());

    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("Size: S")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("shows updated quantity for duplicate items", () => {
    render(
      <CartProvider>
        <AddItemButton />
        <MiniCart />
      </CartProvider>,
    );
    act(() => screen.getByText("Add Item").click());
    act(() => screen.getByText("Add Item").click());

    expect(screen.getByText(/2x/)).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });
});
