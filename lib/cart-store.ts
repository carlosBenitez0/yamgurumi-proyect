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
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

/* ── Selectores ────────────────────────────────────────── */

export const selectCount = (s: Pick<CartState, "items">) =>
  s.items.reduce((n, i) => n + i.quantity, 0);

export const selectSubtotal = (s: Pick<CartState, "items">) =>
  s.items.reduce((n, i) => n + i.price * i.quantity, 0);

/* ── Store ─────────────────────────────────────────────── */

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

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

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: "yamgurumi-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
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
