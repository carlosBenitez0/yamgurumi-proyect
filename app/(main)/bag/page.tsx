import type { Metadata } from "next";
import { getPublicStoreSettings } from "@/src/lib/storeSettings";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Tu pedido — Yamgurumi",
  description:
    "Revisa tu pedido de amigurumis artesanales y envíalo por WhatsApp. Hecho a mano, tejido con amor.",
};

export const revalidate = 0;

export default async function CartPage() {
  const storeSettings = await getPublicStoreSettings();
  return (
    <CartClient
      shippingNote={storeSettings.shippingNote}
      shippingFlatRate={storeSettings.shippingFlatRate}
    />
  );
}
