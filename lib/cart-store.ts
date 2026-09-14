"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";

/* ── Tipos ─────────────────────────────────────────────── */

export type BaseType = "none" | "standard" | "large";

export const BASE_OPTIONS_INFO: Record<BaseType, { label: string; shortLabel: string; price: number }> = {
  none: { label: "Sin base", shortLabel: "Sin base", price: 0 },
  standard: { label: "Base Normal (+$1.00)", shortLabel: "Base Normal (+$1.00)", price: 1.0 },
  large: { label: "Base Grande (+$1.50)", shortLabel: "Base Grande (+$1.50)", price: 1.5 },
};

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  basePrice?: number;
  imageUrl: string;
  category: string;
  quantity: number;
  baseType?: BaseType;
  hasBase?: boolean;
  stock?: number;
  craftingDays?: string;
}

export const MIN_QTY = 1;
export const MAX_QTY = 9;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  discountCode: string | null;
  discountCouponId: string | null;
  discountPercent: number;
  addItem: (product: Product, quantity?: number, baseType?: BaseType | boolean) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  toggleItemBase: (id: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyDiscount: (code: string, percent: number, couponId?: string | null) => void;
  removeDiscount: () => void;
}

/* ── Selectores ────────────────────────────────────────── */

export const selectCount = (s: Pick<CartState, "items">) =>
  s.items.reduce((n, i) => n + i.quantity, 0);

export const selectSubtotal = (s: Pick<CartState, "items">) =>
  s.items.reduce((n, i) => n + i.price * i.quantity, 0);

export const selectDiscountAmount = (s: Pick<CartState, "items" | "discountPercent">) => {
  const subtotal = selectSubtotal(s);
  return (subtotal * s.discountPercent) / 100;
};

export const selectTotal = (s: Pick<CartState, "items" | "discountPercent">) => {
  const subtotal = selectSubtotal(s);
  const discount = selectDiscountAmount(s);
  return subtotal - discount;
};

/* ── Store ─────────────────────────────────────────────── */

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      discountCode: null,
      discountCouponId: null,
      discountPercent: 0,

      addItem: (product, quantity = 1, baseType: BaseType | boolean = "none") =>
        set((state) => {
          const resolvedBaseType: BaseType =
            typeof baseType === "string"
              ? baseType
              : baseType
                ? "standard"
                : "none";
          const extraPrice = BASE_OPTIONS_INFO[resolvedBaseType].price;
          const unitPrice = product.price + extraPrice;
          const itemId = `${product.id}-${resolvedBaseType}`;

          const existing = state.items.find((i) => i.id === itemId);
          const items = existing
            ? state.items.map((i) =>
                i.id === existing.id
                  ? {
                      ...i,
                      quantity: Math.min(MAX_QTY, i.quantity + quantity),
                      stock: product.stock !== undefined ? product.stock : i.stock,
                    }
                  : i,
              )
            : [
                ...state.items,
                {
                  id: itemId,
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: unitPrice,
                  basePrice: product.price,
                  imageUrl: product.imageUrl,
                  category: product.category,
                  quantity: Math.min(MAX_QTY, quantity),
                  baseType: resolvedBaseType,
                  hasBase: resolvedBaseType !== "none",
                  stock: product.stock,
                  craftingDays: product.craftingDays || "5-10 días hábiles",
                },
              ];
          return { items };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id
                ? { ...i, quantity: Math.max(MIN_QTY, Math.min(MAX_QTY, quantity)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      toggleItemBase: (id) =>
        set((state) => {
          const target = state.items.find((i) => i.id === id);
          if (!target) return state;

          const currentBType: BaseType =
            target.baseType || (target.hasBase ? "standard" : "none");
          const cycleMap: Record<BaseType, BaseType> = {
            none: "standard",
            standard: "large",
            large: "none",
          };
          const nextBType = cycleMap[currentBType];
          const prodId = target.productId || target.id.split("-")[0];
          const newId = `${prodId}-${nextBType}`;

          const origBasePrice = target.basePrice ?? (target.price - BASE_OPTIONS_INFO[currentBType].price);
          const newUnitPrice = origBasePrice + BASE_OPTIONS_INFO[nextBType].price;

          const existing = state.items.find((i) => i.id === newId && i.id !== id);
          if (existing) {
            return {
              items: state.items
                .filter((i) => i.id !== id)
                .map((i) =>
                  i.id === newId
                    ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + target.quantity) }
                    : i
                ),
            };
          } else {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? {
                      ...i,
                      id: newId,
                      price: newUnitPrice,
                      basePrice: origBasePrice,
                      baseType: nextBType,
                      hasBase: nextBType !== "none",
                    }
                  : i
              ),
            };
          }
        }),

      clearCart: () => set({ items: [], discountCode: null, discountCouponId: null, discountPercent: 0 }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      applyDiscount: (code, percent, couponId = null) =>
        set({ discountCode: code, discountPercent: percent, discountCouponId: couponId || null }),
      removeDiscount: () => set({ discountCode: null, discountCouponId: null, discountPercent: 0 }),
    }),
    {
      name: "yamgurumi-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        discountCode: state.discountCode,
        discountCouponId: state.discountCouponId,
        discountPercent: state.discountPercent
      }),
    },
  ),
);

/* ── Hidratación (evita mismatch SSR en el contador) ───── */

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useCartStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return () => unsub();
  }, []);

  return hydrated;
}
