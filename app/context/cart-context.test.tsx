import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CartProvider, useCart } from "./cart-context";

const mockItem = {
  productId: 1,
  productTitle: "Classic Tee",
  sizeLabel: "S",
  price: 75,
  imageURL: "https://example.com/image.jpg",
};

function TestConsumer() {
  const { items, totalItemCount, isCartOpen, addToCart, toggleCart } =
    useCart();
  return (
    <div>
      <span data-testid="count">{totalItemCount}</span>
      <span data-testid="items">{JSON.stringify(items)}</span>
      <span data-testid="cart-open">{String(isCartOpen)}</span>
      <button onClick={() => addToCart(mockItem)}>Add S</button>
      <button
        onClick={() => addToCart({ ...mockItem, sizeLabel: "L" })}
      >
        Add L
      </button>
      <button onClick={toggleCart}>Toggle</button>
    </div>
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty cart", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("items")).toHaveTextContent("[]");
  });

  it("adds a new item with quantity 1", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    const items = JSON.parse(screen.getByTestId("items").textContent!);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].sizeLabel).toBe("S");
  });

  it("increments quantity for same product+size", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    act(() => screen.getByText("Add S").click());
    const items = JSON.parse(screen.getByTestId("items").textContent!);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("creates separate entry for different size", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    act(() => screen.getByText("Add L").click());
    const items = JSON.parse(screen.getByTestId("items").textContent!);
    expect(items).toHaveLength(2);
    expect(items[0].sizeLabel).toBe("S");
    expect(items[1].sizeLabel).toBe("L");
  });

  it("calculates totalItemCount correctly", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    act(() => screen.getByText("Add S").click());
    act(() => screen.getByText("Add L").click());
    expect(screen.getByTestId("count")).toHaveTextContent("3");
  });

  it("opens cart when item is added", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    expect(screen.getByTestId("cart-open")).toHaveTextContent("false");
    act(() => screen.getByText("Add S").click());
    expect(screen.getByTestId("cart-open")).toHaveTextContent("true");
  });

  it("toggles cart open/close", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    expect(screen.getByTestId("cart-open")).toHaveTextContent("false");
    act(() => screen.getByText("Toggle").click());
    expect(screen.getByTestId("cart-open")).toHaveTextContent("true");
    act(() => screen.getByText("Toggle").click());
    expect(screen.getByTestId("cart-open")).toHaveTextContent("false");
  });

  it("persists to localStorage", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    const stored = JSON.parse(localStorage.getItem("cart")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].sizeLabel).toBe("S");
  });

  it("restores from localStorage on mount", () => {
    const savedItems = [{ ...mockItem, quantity: 3 }];
    localStorage.setItem("cart", JSON.stringify(savedItems));

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    // Wait for useEffect hydration
    expect(screen.getByTestId("count")).toHaveTextContent("3");
  });
});
