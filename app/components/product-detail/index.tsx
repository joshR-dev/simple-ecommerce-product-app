import { useState } from "react";
import type { Product } from "~/types/product";
import { useCart } from "~/context/cart-context";
import { SizeSelector } from "~/components/size-selector";
import "./product-detail.css";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  function handleSizeSelect(label: string) {
    setSelectedSize(label);
    setError(null);
  }

  function handleAddToCart() {
    if (!selectedSize) {
      setError("Please select a size before adding to cart.");
      return;
    }
    addToCart({
      productId: product.id,
      productTitle: product.title,
      sizeLabel: selectedSize,
      price: product.price,
      imageURL: product.imageURL,
    });
  }

  return (
    <div className="product-detail">
      <div className="product-image-wrapper">
        <img
          src={product.imageURL}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.title}</h1>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-size-section">
          <label className="product-size-label">
            SIZE<span className="product-size-required">*</span>
          </label>
          <SizeSelector
            options={product.sizeOptions}
            selectedSize={selectedSize}
            onSelect={handleSizeSelect}
          />
        </div>

        {error && <p className="product-error">{error}</p>}

        <button className="product-add-to-cart" onClick={handleAddToCart}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
