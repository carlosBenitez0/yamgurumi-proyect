import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Tu pedido — Yamgurumi",
  description:
    "Revisa tu pedido de amigurumis artesanales y envíalo por WhatsApp. Hecho a mano, tejido con amor.",
};

export default function CartPage() {
  return <CartClient />;
}
