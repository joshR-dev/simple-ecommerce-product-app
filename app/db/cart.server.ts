import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.resolve("data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "cart.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    product_title TEXT NOT NULL,
    size_label TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE(product_id, size_label)
  )
`);

export interface CartItemRow {
  id: number;
  product_id: number;
  product_title: string;
  size_label: string;
  price: number;
  image_url: string;
  quantity: number;
}

export function getCartItems(): CartItemRow[] {
  return db.prepare("SELECT * FROM cart_items").all() as CartItemRow[];
}

export function addCartItem(item: {
  productId: number;
  productTitle: string;
  sizeLabel: string;
  price: number;
  imageURL: string;
}): CartItemRow[] {
  db.prepare(
    `INSERT INTO cart_items (product_id, product_title, size_label, price, image_url, quantity)
     VALUES (?, ?, ?, ?, ?, 1)
     ON CONFLICT(product_id, size_label)
     DO UPDATE SET quantity = quantity + 1`
  ).run(item.productId, item.productTitle, item.sizeLabel, item.price, item.imageURL);

  return getCartItems();
}

export function updateCartItemQuantity(id: number, quantity: number): CartItemRow[] {
  if (quantity <= 0) {
    db.prepare("DELETE FROM cart_items WHERE id = ?").run(id);
  } else {
    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(quantity, id);
  }
  return getCartItems();
}

export function removeCartItem(id: number): CartItemRow[] {
  db.prepare("DELETE FROM cart_items WHERE id = ?").run(id);
  return getCartItems();
}

export function clearCart(): void {
  db.prepare("DELETE FROM cart_items").run();
}
