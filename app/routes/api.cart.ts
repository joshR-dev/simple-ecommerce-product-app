import {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
} from "~/db/cart.server";
import type { Route } from "./+types/api.cart";

function toJSON(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function loader({}: Route.LoaderArgs) {
  const items = getCartItems();
  return toJSON({ items });
}

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json();

  switch (request.method) {
    case "POST": {
      const items = addCartItem({
        productId: body.productId,
        productTitle: body.productTitle,
        sizeLabel: body.sizeLabel,
        price: body.price,
        imageURL: body.imageURL,
      });
      return toJSON({ items }, 201);
    }
    case "PUT": {
      const items = updateCartItemQuantity(body.id, body.quantity);
      return toJSON({ items });
    }
    case "DELETE": {
      const items = removeCartItem(body.id);
      return toJSON({ items });
    }
    default:
      return toJSON({ error: "Method not allowed" }, 405);
  }
}
