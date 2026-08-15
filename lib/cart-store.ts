"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";

/* ── Tipos ─────────────────────────────────────────────── */

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
}

export const MIN_QTY = 1;
export const MAX_QTY = 9;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  discountCode: string | null;
  discountPercent: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyDiscount: (code: string, percent: number) => void;
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
      discountPercent: 0,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          const items = existing
            ? state.items.map((i) =>
                i.id === product.id
                  ? {
                      ...i,
                      quantity: Math.min(MAX_QTY, i.quantity + quantity),
                    }
                  : i,
              )
            : [
                ...state.items,
                {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  category: product.category,
                  quantity: Math.min(MAX_QTY, quantity),
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

      clearCart: () => set({ items: [], discountCode: null, discountPercent: 0 }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      applyDiscount: (code, percent) => set({ discountCode: code, discountPercent: percent }),
      removeDiscount: () => set({ discountCode: null, discountPercent: 0 }),
    }),
    {
      name: "yamgurumi-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        discountCode: state.discountCode,
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
