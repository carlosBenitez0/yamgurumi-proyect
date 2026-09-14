import { describe, it, expect } from "vitest";
import { buildCartMessageText, buildWhatsAppLink, WHATSAPP_NUMBER } from "../cart-whatsapp";
import type { CartItem } from "../cart-store";

const mockInStockItem: CartItem = {
  id: "prod-1-none",
  productId: "prod-1",
  name: "Gatito Amigurumi",
  slug: "gatito-amigurumi",
  price: 15.0,
  basePrice: 15.0,
  imageUrl: "/images/gatito.jpg",
  category: "Gatos",
  quantity: 2,
  baseType: "none",
  stock: 5,
};

const mockMadeToOrderItem: CartItem = {
  id: "prod-2-standard",
  productId: "prod-2",
  name: "Perrito Personalizado",
  slug: "perrito-personalizado",
  price: 21.0,
  basePrice: 20.0,
  imageUrl: "/images/perrito.jpg",
  category: "Perros",
  quantity: 1,
  baseType: "standard",
  stock: 0,
  craftingDays: "7-12 días hábiles",
};

const mockDeliveryDetails = {
  name: "Carlos Benítez",
  phone: "+503 7000 0000",
  zone: "San Salvador",
  note: "Entregar por la tarde",
};

describe("cart-whatsapp", () => {
  it("debe generar el mensaje de texto formateado con productos en stock y encargo", () => {
    const text = buildCartMessageText(
      [mockInStockItem, mockMadeToOrderItem],
      mockDeliveryDetails,
      "SUMMER10",
      10,
      undefined,
      "coup-abc-123"
    );

    expect(text).toContain("NUEVO PEDIDO DESDE LA WEB - YAMGURUMI");
    expect(text).toContain("Piezas en Stock (Entrega Inmediata):");
    expect(text).toContain("2× Gatito Amigurumi");
    expect(text).toContain("Piezas a Confeccionar Bajo Encargo:");
    expect(text).toContain("1× Perrito Personalizado");
    expect(text).toContain("Base Normal");
    expect(text).toContain("[7-12 días hábiles]");

    // Verificación de totales y cupones
    expect(text).toContain("Subtotal: $51.00"); // (15*2) + 21 = 51
    expect(text).toContain("SUMMER10");
    expect(text).toContain("ID: coup-abc-123");
    expect(text).toContain("-$5.10"); // 10% de 51
    expect(text).toContain("Total a Pagar:* *$45.90*");

    // Datos de entrega
    expect(text).toContain("Carlos Benítez");
    expect(text).toContain("San Salvador");
    expect(text).toContain("Entregar por la tarde");
  });

  it("debe reemplazar correctamente los marcadores de una plantilla personalizada", () => {
    const customTemplate = "Hola {nombre}, tu total es {total} para enviar a {zona}. Descuento aplicado: {descuento}.";
    const text = buildCartMessageText(
      [mockInStockItem],
      mockDeliveryDetails,
      "DISC5",
      5,
      customTemplate
    );

    expect(text).toBe("Hola Carlos Benítez, tu total es 28.50 para enviar a San Salvador. Descuento aplicado: 1.50.");
  });

  it("debe construir un enlace válido de WhatsApp API con los parámetros codificados", () => {
    const link = buildWhatsAppLink([mockInStockItem], mockDeliveryDetails);
    expect(link).toContain(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=`);
    expect(link).toContain(encodeURIComponent("Carlos Benítez"));
  });
});
