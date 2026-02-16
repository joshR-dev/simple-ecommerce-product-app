import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div style={{ padding: "64px 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Welcome</h1>
      <Link
        to="/product"
        style={{
          fontSize: "14px",
          color: "#333",
          textDecoration: "underline",
        }}
      >
        View Product
      </Link>
    </div>
  );
}
