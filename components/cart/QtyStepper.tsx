"use client";

import { MdAdd, MdRemove } from "react-icons/md";
import { useCartStore, MAX_QTY } from "@/lib/cart-store";

interface QtyStepperProps {
  id: string;
  qty: number;
}

export default function QtyStepper({ id, qty }: QtyStepperProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const name = useCartStore((s) => s.items.find((i) => i.id === id)?.name ?? "");

  return (
    <div className="inline-flex items-center rounded-full border border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
      <button
        onClick={() => setQuantity(id, qty - 1)}
        disabled={qty <= 1}
        className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:bg-secondary-container/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-ring"
        aria-label={`Quitar uno de ${name}`}
      >
        <MdRemove className="text-[16px]" />
      </button>
      <span
        className="w-8 text-center text-body-sm font-bold font-body text-on-surface tabular-nums"
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        onClick={() => setQuantity(id, qty + 1)}
        disabled={qty >= MAX_QTY}
        className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:bg-secondary-container/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-ring"
        aria-label={`Agregar uno a ${name}`}
      >
        <MdAdd className="text-[16px]" />
      </button>
    </div>
  );
}
