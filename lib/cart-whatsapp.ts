import type { CartItem } from "./cart-store";

/* ── Configuración del taller ──────────────────────────── */

export const WHATSAPP_NUMBER = "50377311064";

export const SHIPPING = {
  zones: ["San Salvador", "Antiguo Cuscatlán", "Santa Tecla", "Zona norte", "Otro destino"],
  price: "Se coordina en el chat",
  note: "Se coordina en el chat",
} as const;

export const DELIVERY_ZONES = SHIPPING.zones;

/* ── Emojis dinámicos en tiempo de ejecución ──────────── */

const E = {
  SPARKLES: String.fromCodePoint(0x2728),
  YARN: String.fromCodePoint(0x1F9F6),
  CLIPBOARD: String.fromCodePoint(0x1F4CB),
  MONEY: String.fromCodePoint(0x1F4B0),
  PIN: String.fromCodePoint(0x1F4CD),
  PHONE: String.fromCodePoint(0x1F4F1),
  NOTE: String.fromCodePoint(0x1F4DD),
  HEART: String.fromCodePoint(0x2764, 0xFE0F),
};

function formatItems(items: CartItem[]): string {
  return items
    .map((item) => `  • ${item.quantity}× ${item.name} — $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export interface DeliveryDetails {
  name: string;
  phone: string;
  zone: string;
  note: string;
}

export function buildCartMessageText(
  items: CartItem[],
  details: DeliveryDetails,
  discountCode?: string | null,
  discountPercent: number = 0,
): string {
  const subtotal = calculateSubtotal(items);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const lines = [
    `${E.SPARKLES} *NUEVO PEDIDO DESDE LA WEB - YAMGURUMI* ${E.YARN}`,
    "",
    `¡Hola! Quisiera realizar la compra de los siguientes amigurumis artesanales:`,
    "",
    `${E.CLIPBOARD} *Productos Seleccionados:*`,
    formatItems(items),
    "",
    `Subtotal: $${subtotal.toFixed(2)}`,
  ];

  if (discountCode && discountPercent > 0) {
    lines.push(`Descuento (${discountCode}): -$${discountAmount.toFixed(2)} (-${discountPercent}%)`);
  }

  lines.push(
    `Envío: ${SHIPPING.price}`,
    `${E.MONEY} *Total a Pagar:* *$${total.toFixed(2)}*`,
    "",
    `👤 *Cliente:* ${details.name.trim()}`,
    `${E.PHONE} *WhatsApp / Teléfono:* ${details.phone.trim()}`,
    `${E.PIN} *Zona de Entrega:* ${details.zone}`,
  );

  if (details.note.trim()) {
    lines.push(`${E.NOTE} *Nota Especial:* ${details.note.trim()}`);
  }

  lines.push("", `Quedo a la espera de sus datos de pago para confirmar. ¡Muchas gracias! ${E.HEART}`);

  return lines.join("\n");
}

export function buildWhatsAppLink(
  items: CartItem[],
  details: DeliveryDetails,
  discountCode?: string | null,
  discountPercent: number = 0,
): string {
  const text = buildCartMessageText(items, details, discountCode, discountPercent);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
}
