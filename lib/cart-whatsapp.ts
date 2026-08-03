import type { CartItem } from "./cart-store";

/* ── Configuración del taller ──────────────────────────── */

export const WHATSAPP_NUMBER = "50377311064";

export const SHIPPING = {
  zones: ["San Salvador", "Antiguo Cuscatlán", "Santa Tecla", "Zona norte", "Otro destino"],
  price: "Se coordina en el chat",
  note: "Se coordina en el chat",
} as const;

export const DELIVERY_ZONES = SHIPPING.zones;

/* ── Texto del pedido ──────────────────────────────────── */

const WEBSITE_LINE = "\n—Enviado desde el sitio web de Yamgurumi";

function formatItems(items: CartItem[]): string {
  return items
    .map((item) => `• ${item.quantity}× ${item.name} — $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/* ── Enlace listo para pegar en WhatsApp ───────────────── */

export interface DeliveryDetails {
  name: string;
  phone: string;
  zone: string;
  note: string;
}

export function buildWhatsAppLink(
  items: CartItem[],
  details: DeliveryDetails,
): string {
  const lines = [
    "*Pedido para Yamgurumi*",
    "",
    formatItems(items),
    "",
    `Subtotal: $${calculateSubtotal(items).toFixed(2)}`,
    `Envío: ${SHIPPING.price}`,
    "",
    `*Nombre:* ${details.name.trim()}`,
    `*Teléfono:* ${details.phone.trim()}`,
    `*Zona:* ${details.zone}`,
  ];

  if (details.note.trim()) {
    lines.push(`*Nota:* ${details.note.trim()}`);
  }

  lines.push(WEBSITE_LINE);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
