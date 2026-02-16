import { useRef, useEffect } from "react";
import { useCart } from "~/context/cart-context";
import { MiniCart } from "~/components/mini-cart";
import "./navbar.css";
import { Link } from "react-router";

export function Navbar() {
  const { totalItemCount, isCartOpen, toggleCart, closeCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node)
      ) {
        closeCart();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeCart]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/product" className="navbar-logo">
          Product
        </Link>
        <div className="navbar-cart-wrapper" ref={cartRef}>
          <button
            className="navbar-cart-button"
            onClick={toggleCart}
          >
            My Cart ( {totalItemCount} )
          </button>
          {isCartOpen && <MiniCart />}
        </div>
      </div>
    </header>
  );
}
