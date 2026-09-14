import type { CartItem } from "./cart-store";

/* ── Configuración del taller ──────────────────────────── */

export const WHATSAPP_NUMBER = "50377311064";

export const SHIPPING = {
  zones: ["Todo El Salvador"],
  price: "Se coordina por chat (Estimada)",
  note: "Hacemos envíos a todo El Salvador. La tarifa es estimada y puede variar según la zona de entrega.",
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

const BOLT = String.fromCodePoint(0x26A1);

function formatItemsGrouped(items: CartItem[]): string {
  const immediateItems = items.filter((item) => item.stock === undefined || item.stock > 0);
  const madeToOrderItems = items.filter((item) => item.stock !== undefined && item.stock <= 0);

  const formatLine = (item: CartItem) => {
    const baseTag =
      item.baseType === "large"
        ? "Base Grande 🪵 (+$1.50)"
        : item.baseType === "standard" || item.hasBase
          ? "Base Normal 🪵 (+$1.00)"
          : "Sin base";
    return `  • ${item.quantity}× ${item.name} (${baseTag}) — $${(
      item.price * item.quantity
    ).toFixed(2)}`;
  };

  const output: string[] = [];

  if (immediateItems.length > 0) {
    output.push(`${BOLT} *Piezas en Stock (Entrega Inmediata):*`);
    immediateItems.forEach((i) => output.push(formatLine(i)));
  }

  if (madeToOrderItems.length > 0) {
    if (output.length > 0) output.push("");
    output.push(`${E.YARN} *Piezas a Confeccionar Bajo Encargo:*`);
    madeToOrderItems.forEach((i) => {
      const line = formatLine(i);
      const cDays = i.craftingDays ? ` [${i.craftingDays}]` : "";
      output.push(`${line}${cDays}`);
    });
  }

  // Fallback si por alguna razón ninguna categoría capturó ítems
  if (output.length === 0) {
    output.push(`${E.CLIPBOARD} *Productos Seleccionados:*`);
    items.forEach((i) => output.push(formatLine(i)));
  }

  return output.join("\n");
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
  customTemplate?: string,
  couponId?: string | null
): string {
  const subtotal = calculateSubtotal(items);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;
  const itemsText = formatItemsGrouped(items);
  const discountText = discountCode && discountPercent > 0 ? `${discountCode} (-$${discountAmount.toFixed(2)})` : '0.00';

  if (customTemplate) {
    return customTemplate
      .replaceAll('{productos}', itemsText)
      .replaceAll('{subtotal}', subtotal.toFixed(2))
      .replaceAll('{descuento}', discountAmount.toFixed(2))
      .replaceAll('{envio}', SHIPPING.price)
      .replaceAll('{total}', total.toFixed(2))
      .replaceAll('{zona}', details.zone)
      .replaceAll('{notas}', details.note.trim() || 'Sin notas adicionales')
      .replaceAll('{nombre}', details.name.trim())
      .replaceAll('{telefono}', details.phone.trim());
  }

  const lines = [
    `${E.SPARKLES} *NUEVO PEDIDO DESDE LA WEB - YAMGURUMI* ${E.YARN}`,
    "",
    `¡Hola! Quisiera realizar el pedido de los siguientes amigurumis artesanales:`,
    "",
    itemsText,
    "",
    `Subtotal: $${subtotal.toFixed(2)}`,
  ];

  if (discountCode && discountPercent > 0) {
    const couponRefInfo = couponId ? ` | ID: ${couponId}` : '';
    lines.push(`🎟️ *Cupón Aplicado (${discountCode}${couponRefInfo}):* -$${discountAmount.toFixed(2)} (-${discountPercent}%)`);
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
  customTemplate?: string,
  couponId?: string | null
): string {
  const text = buildCartMessageText(items, details, discountCode, discountPercent, customTemplate, couponId);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
}
