import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MiniCart } from "./index";
import { CartProvider, useCart } from "~/context/cart-context";

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
    vi.restoreAllMocks();
  });

  it("shows empty message when no items", () => {
    mockFetch({ "GET /api/cart": { items: [] } });
    render(
      <CartProvider>
        <MiniCart />
      </CartProvider>,
    );
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("renders item details when items exist", async () => {
    mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": { items: [mockApiItem] },
    });
    render(
      <CartProvider>
        <AddItemButton />
        <MiniCart />
      </CartProvider>,
    );
    act(() => screen.getByText("Add Item").click());
    await waitFor(() => {
      expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    });
    expect(screen.getByText("Size: S")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("shows updated quantity for duplicate items", async () => {
    let callCount = 0;
    mockFetch({
      "GET /api/cart": { items: [] },
      "POST /api/cart": () => {
        callCount++;
        return { items: [{ ...mockApiItem, quantity: callCount }] };
      },
    });
    render(
      <CartProvider>
        <AddItemButton />
        <MiniCart />
      </CartProvider>,
    );
    act(() => screen.getByText("Add Item").click());
    await waitFor(() => {
      expect(screen.getByText(/1x/)).toBeInTheDocument();
    });
    act(() => screen.getByText("Add Item").click());
    await waitFor(() => {
      expect(screen.getByText(/2x/)).toBeInTheDocument();
    });
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("calls updateQuantity when +/- buttons are clicked", async () => {
    const fetchSpy = mockFetch({
      "GET /api/cart": { items: [{ ...mockApiItem, quantity: 2 }] },
      "PUT /api/cart": { items: [{ ...mockApiItem, quantity: 3 }] },
    });
    render(
      <CartProvider>
        <MiniCart />
      </CartProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/2x/)).toBeInTheDocument();
    });
    act(() =>
      screen
        .getByLabelText("Increase quantity of Classic Tee size S")
        .click(),
    );
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1, quantity: 3 }),
      });
    });
  });

  it("calls removeItem when Remove button is clicked", async () => {
    const fetchSpy = mockFetch({
      "GET /api/cart": { items: [mockApiItem] },
      "DELETE /api/cart": { items: [] },
    });
    render(
      <CartProvider>
        <MiniCart />
      </CartProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    });
    act(() =>
      screen
        .getByLabelText("Remove Classic Tee size S from cart")
        .click(),
    );
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1 }),
      });
    });
    await waitFor(() => {
      expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    });
  });
});
