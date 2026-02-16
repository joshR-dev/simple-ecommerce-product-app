import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ProductDetail } from "./index";
import { CartProvider } from "~/context/cart-context";
import type { Product } from "~/types/product";

const mockProduct: Product = {
  id: 1,
  title: "Classic Tee",
  description: "A great t-shirt.",
  price: 75,
  imageURL: "https://example.com/image.jpg",
  sizeOptions: [
    { id: 1, label: "S" },
    { id: 2, label: "M" },
    { id: 3, label: "L" },
  ],
};

function renderProductDetail() {
  return render(
    <CartProvider>
      <ProductDetail product={mockProduct} />
    </CartProvider>,
  );
}

describe("ProductDetail", () => {
  it("renders product title, price, description, and image", () => {
    renderProductDetail();
    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
    expect(screen.getByText("A great t-shirt.")).toBeInTheDocument();
    expect(screen.getByAltText("Classic Tee")).toHaveAttribute(
      "src",
      mockProduct.imageURL,
    );
  });

  it("renders all size options", () => {
    renderProductDetail();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
  });

  it("shows error when ADD TO CART clicked without size", () => {
    renderProductDetail();
    act(() => screen.getByText("ADD TO CART").click());
    expect(
      screen.getByText("Please select a size before adding to cart."),
    ).toBeInTheDocument();
  });

  it("clears error when a size is selected", () => {
    renderProductDetail();
    act(() => screen.getByText("ADD TO CART").click());
    expect(
      screen.getByText("Please select a size before adding to cart."),
    ).toBeInTheDocument();

    act(() => screen.getByText("M").click());
    expect(
      screen.queryByText("Please select a size before adding to cart."),
    ).not.toBeInTheDocument();
  });

  it("does not show error when size is selected before adding", () => {
    renderProductDetail();
    act(() => screen.getByText("S").click());
    act(() => screen.getByText("ADD TO CART").click());
    expect(
      screen.queryByText("Please select a size before adding to cart."),
    ).not.toBeInTheDocument();
  });
});
