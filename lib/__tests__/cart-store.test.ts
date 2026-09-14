import { describe, it, expect, beforeEach } from "vitest";
import {
  useCartStore,
  selectCount,
  selectSubtotal,
  selectDiscountAmount,
  selectTotal,
  BASE_OPTIONS_INFO,
} from "../cart-store";
import type { Product } from "@/data/products";

const mockProduct: Product = {
  id: "prod-1",
  name: "Gatito Amigurumi",
  slug: "gatito-amigurumi",
  price: 15.0,
  imageUrl: "/images/gatito.jpg",
  category: "Muñecos",
  size: "Mediano",
  description: "Un gatito tejido con amor",
  materials: "Algodón 100%",
  tags: ["gato", "amigurumi"],
  rating: 5,
  reviews: 1,
  searchKeywords: ["gatito"],
  stock: 5,
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("debe iniciar con un carrito vacío y sin descuento", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.discountCode).toBeNull();
    expect(state.discountPercent).toBe(0);
    expect(selectCount(state)).toBe(0);
    expect(selectSubtotal(state)).toBe(0);
  });

  it("debe agregar un producto correctamente sin base extra", () => {
    useCartStore.getState().addItem(mockProduct, 1, "none");
    const state = useCartStore.getState();

    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe("Gatito Amigurumi");
    expect(state.items[0].price).toBe(15.0);
    expect(selectCount(state)).toBe(1);
    expect(selectSubtotal(state)).toBe(15.0);
  });

  it("debe agregar un producto con base normal (+$1.00) y base grande (+$1.50)", () => {
    useCartStore.getState().addItem(mockProduct, 1, "standard");
    let state = useCartStore.getState();
    expect(state.items[0].price).toBe(16.0); // 15 + 1.00

    useCartStore.getState().addItem(mockProduct, 1, "large");
    state = useCartStore.getState();
    expect(state.items.length).toBe(2); // Diferente ID de ítem por base
    expect(state.items[1].price).toBe(16.5); // 15 + 1.50
    expect(selectSubtotal(state)).toBe(32.5);
  });

  it("debe limitar la cantidad máxima a 9 unidades por producto", () => {
    useCartStore.getState().addItem(mockProduct, 5, "none");
    useCartStore.getState().addItem(mockProduct, 10, "none"); // intenta agregar 10 más

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(9); // Máximo de 9
  });

  it("debe modificar la cantidad de un producto correctamente con setQuantity", () => {
    useCartStore.getState().addItem(mockProduct, 2, "none");
    const itemId = useCartStore.getState().items[0].id;

    useCartStore.getState().setQuantity(itemId, 5);
    let state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);

    // setQuantity sujeta la cantidad a un mínimo de MIN_QTY (1)
    useCartStore.getState().setQuantity(itemId, 0);
    state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(1);

    // Para eliminar el ítem se utiliza removeItem
    useCartStore.getState().removeItem(itemId);
    state = useCartStore.getState();
    expect(state.items.length).toBe(0);
  });

  it("debe alternar la base del producto ciclativamente con toggleItemBase", () => {
    useCartStore.getState().addItem(mockProduct, 1, "none");
    let itemId = useCartStore.getState().items[0].id;
    expect(useCartStore.getState().items[0].price).toBe(15.0);

    // Primera alternancia: de none a standard
    useCartStore.getState().toggleItemBase(itemId);
    itemId = useCartStore.getState().items[0].id;
    expect(useCartStore.getState().items[0].baseType).toBe("standard");
    expect(useCartStore.getState().items[0].price).toBe(16.0);

    // Segunda alternancia: de standard a large
    useCartStore.getState().toggleItemBase(itemId);
    itemId = useCartStore.getState().items[0].id;
    expect(useCartStore.getState().items[0].baseType).toBe("large");
    expect(useCartStore.getState().items[0].price).toBe(16.5);

    // Tercera alternancia: de large a none
    useCartStore.getState().toggleItemBase(itemId);
    expect(useCartStore.getState().items[0].baseType).toBe("none");
    expect(useCartStore.getState().items[0].price).toBe(15.0);
  });

  it("debe aplicar y remover cupones de descuento correctamente", () => {
    useCartStore.getState().addItem(mockProduct, 2, "none"); // Total = 30.00
    useCartStore.getState().applyDiscount("PROMO20", 20, "coup-123");

    const state = useCartStore.getState();
    expect(state.discountCode).toBe("PROMO20");
    expect(state.discountPercent).toBe(20);
    expect(state.discountCouponId).toBe("coup-123");

    expect(selectSubtotal(state)).toBe(30.0);
    expect(selectDiscountAmount(state)).toBe(6.0); // 20% de 30 = 6
    expect(selectTotal(state)).toBe(24.0); // 30 - 6 = 24

    // Remover descuento
    useCartStore.getState().removeDiscount();
    const resetState = useCartStore.getState();
    expect(resetState.discountCode).toBeNull();
    expect(selectTotal(resetState)).toBe(30.0);
  });

  it("debe vaciar el carrito completamente con clearCart", () => {
    useCartStore.getState().addItem(mockProduct, 3, "none");
    useCartStore.getState().applyDiscount("WELCOME10", 10);
    useCartStore.getState().clearCart();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.discountCode).toBeNull();
    expect(state.discountPercent).toBe(0);
    expect(selectTotal(state)).toBe(0);
  });
});
