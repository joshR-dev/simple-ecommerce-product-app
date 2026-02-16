import { useCart } from "~/context/cart-context";
import "./mini-cart.css";

export function MiniCart() {
  const { items, updateQuantity, removeItem } = useCart();

  return (
    <div className="mini-cart-dropdown">
      {items.length === 0 ? (
        <p className="mini-cart-empty">Your cart is empty.</p>
      ) : (
        <ul className="mini-cart-list">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.sizeLabel}`}
              className="mini-cart-item"
            >
              <img
                src={item.imageURL}
                alt={item.productTitle}
                className="mini-cart-item-image"
              />
              <div className="mini-cart-item-details">
                <p className="mini-cart-item-title">{item.productTitle}</p>
                <p className="mini-cart-item-price">
                  {item.quantity}x{" "}
                  <strong>${item.price.toFixed(2)}</strong>
                </p>
                <p className="mini-cart-item-size">Size: {item.sizeLabel}</p>
                <div className="mini-cart-item-actions">
                  <button
                    className="mini-cart-qty-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label={`Decrease quantity of ${item.productTitle} size ${item.sizeLabel}`}
                  >
                    -
                  </button>
                  <span className="mini-cart-qty-value">{item.quantity}</span>
                  <button
                    className="mini-cart-qty-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label={`Increase quantity of ${item.productTitle} size ${item.sizeLabel}`}
                  >
                    +
                  </button>
                  <button
                    className="mini-cart-remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.productTitle} size ${item.sizeLabel} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
