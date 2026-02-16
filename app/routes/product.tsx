import type { Route } from "./+types/product";
import { ProductDetail } from "~/components/product-detail";

const PRODUCT_API_URL =
  "https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product";

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(PRODUCT_API_URL);
  if (!response.ok) {
    throw new Response("Failed to fetch product", { status: 502 });
  }
  const product = await response.json();
  return { product };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData?.product?.title ?? "Product" },
    { name: "description", content: loaderData?.product?.description ?? "" },
  ];
}

export default function ProductRoute({ loaderData }: Route.ComponentProps) {
  return <ProductDetail product={loaderData.product} />;
}
