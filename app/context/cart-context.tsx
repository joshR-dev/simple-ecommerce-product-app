import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "~/types/product";

interface ApiCartItem {
  id: number;
  product_id: number;
  product_title: string;
  size_label: string;
  price: number;
  image_url: string;
  quantity: number;
}

function toCartItem(row: ApiCartItem): CartItem {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    sizeLabel: row.size_label,
    price: row.price,
    imageURL: row.image_url,
    quantity: row.quantity,
  };
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity" | "id">) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  totalItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setItems(data.items.map(toCartItem)))
      .catch((e) => console.warn("Failed to fetch cart", e));
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (newItem: Omit<CartItem, "quantity" | "id">) => {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((data) => setItems(data.items.map(toCartItem)))
        .catch((e) => console.warn("Failed to add to cart", e));
      openCart();
    },
    [openCart],
  );

  const updateQuantity = useCallback((id: number, quantity: number) => {
    fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity }),
    })
      .then((res) => res.json())
      .then((data) => setItems(data.items.map(toCartItem)))
      .catch((e) => console.warn("Failed to update cart item", e));
  }, []);

  const removeItem = useCallback((id: number) => {
    fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => setItems(data.items.map(toCartItem)))
      .catch((e) => console.warn("Failed to remove cart item", e));
  }, []);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        totalItemCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
