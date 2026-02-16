import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "./cart-context";

const mockItem = {
  productId: 1,
  productTitle: "Classic Tee",
  sizeLabel: "S",
  price: 75,
  imageURL: "https://example.com/image.jpg",
};

const mockApiItem = {
  id: 1,
  product_id: 1,
  product_title: "Classic Tee",
  size_label: "S",
  price: 75,
  image_url: "https://example.com/image.jpg",
  quantity: 1,
};

function mockFetch(responses: Record<string, unknown>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(
    async (_url, options) => {
      const method = (options as RequestInit)?.method ?? "GET";
      const key = `${method} /api/cart`;
      const data = typeof responses[key] === "function"
        ? (responses[key] as () => unknown)()
        : responses[key] ?? { items: [] };
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  );
}

function TestConsumer() {
  const { items, totalItemCount, isCartOpen, addToCart, toggleCart } =
    useCart();
  return (
    <div>
      <span data-testid="count">{totalItemCount}</span>
      <span data-testid="items">{JSON.stringify(items)}</span>
      <span data-testid="cart-open">{String(isCartOpen)}</span>
      <button onClick={() => addToCart(mockItem)}>Add S</button>
      <button onClick={() => addToCart({ ...mockItem, sizeLabel: "L" })}>
        Add L
      </button>
      <button onClick={toggleCart}>Toggle</button>
    </div>
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with an empty cart", async () => {
    mockFetch({ "GET /api/cart": { items: [] } });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
    expect(screen.getByTestId("items")).toHaveTextContent("[]");
  });

  it("adds a new item with quantity 1", async () => {
    mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": { items: [mockApiItem] },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    await waitFor(() => {
      const items = JSON.parse(screen.getByTestId("items").textContent!);
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(1);
      expect(items[0].sizeLabel).toBe("S");
    });
  });

  it("increments quantity for same product+size", async () => {
    let callCount = 0;
    mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": () => {
        callCount++;
        return {
          items: [{ ...mockApiItem, quantity: callCount }],
        };
      },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    await waitFor(() => {
      const items = JSON.parse(screen.getByTestId("items").textContent!);
      expect(items[0]?.quantity).toBe(1);
    });
    act(() => screen.getByText("Add S").click());
    await waitFor(() => {
      const items = JSON.parse(screen.getByTestId("items").textContent!);
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it("creates separate entry for different size", async () => {
    const mockApiItemL = {
      ...mockApiItem,
      id: 2,
      size_label: "L",
    };
    let items: typeof mockApiItem[] = [];
    mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": () => {
        if (items.length === 0) {
          items = [mockApiItem];
        } else {
          items = [mockApiItem, mockApiItemL];
        }
        return { items };
      },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    await waitFor(() => {
      const parsed = JSON.parse(screen.getByTestId("items").textContent!);
      expect(parsed).toHaveLength(1);
    });
    act(() => screen.getByText("Add L").click());
    await waitFor(() => {
      const parsed = JSON.parse(screen.getByTestId("items").textContent!);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].sizeLabel).toBe("S");
      expect(parsed[1].sizeLabel).toBe("L");
    });
  });

  it("calculates totalItemCount correctly", async () => {
    mockFetch({
      "GET /api/cart": {
        items: [
          { ...mockApiItem, quantity: 2 },
          { ...mockApiItem, id: 2, size_label: "L", quantity: 1 },
        ],
      },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("3");
    });
  });

  it("opens cart when item is added", async () => {
    mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": { items: [mockApiItem] },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    expect(screen.getByTestId("cart-open")).toHaveTextContent("false");
    act(() => screen.getByText("Add S").click());
    expect(screen.getByTestId("cart-open")).toHaveTextContent("true");
  });

  it("toggles cart open/close", async () => {
    mockFetch({ "GET /api/cart": { items: [] } });
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

  it("fetches cart items from API on mount", async () => {
    const fetchSpy = mockFetch({
      "GET /api/cart": {
        items: [{ ...mockApiItem, quantity: 3 }],
      },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("3");
    });
    expect(fetchSpy).toHaveBeenCalledWith("/api/cart");
  });

  it("sends POST to API when adding item", async () => {
    const fetchSpy = mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": { items: [mockApiItem] },
    });
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );
    act(() => screen.getByText("Add S").click());
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockItem),
      });
    });
  });
});
