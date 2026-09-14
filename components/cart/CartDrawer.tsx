"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdClose, MdShoppingBag, MdEdit } from "react-icons/md";
import {
  useCartStore,
  selectCount,
  selectSubtotal,
  BASE_OPTIONS_INFO,
  type BaseType,
} from "@/lib/cart-store";
import QtyStepper from "@/components/cart/QtyStepper";
import { YarnBall, StitchDots } from "@/components/ui/CraftBackground";
import { SHIPPING } from "@/lib/cart-whatsapp";

/* ── Drawer ────────────────────────────────────────────── */

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleItemBase = useCartStore((s) => s.toggleItemBase);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotal);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  /* Cerrar con Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeDrawer]);

  /* Body lock + foco */
  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      // Enfocar el botón de cierre tras la transición de entrada
      const t = setTimeout(() => closeBtnRef.current?.focus(), 350);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
        lastFocusedRef.current?.focus();
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-on-surface/30 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed top-0 right-0 z-[60] h-full w-[min(92vw,420px)] bg-surface-bright shadow-elevation flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <MdShoppingBag className="text-secondary text-[22px]" />
            <span className="font-headline text-headline-sm text-primary font-bold">
              Tu pedido
            </span>
            {count > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-label-md font-bold">
                {count} {count === 1 ? "pieza" : "piezas"}
              </span>
            )}
          </div>
          <button
            ref={closeBtnRef}
            onClick={closeDrawer}
            className="p-2 hover:bg-secondary-container/50 rounded-full transition-all active:scale-95 focus-ring"
            aria-label="Cerrar pedido"
          >
            <MdClose className="text-[22px] text-on-surface-variant" />
          </button>
        </div>

        {items.length === 0 ? (
          /* ── Vacío ─────────────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <StitchDots className="w-28 h-28 opacity-40" />
              <YarnBall className="w-20 h-20" />
            </div>
            <h3 className="font-headline text-headline-md font-bold text-primary">
              Tu bolsa está vacía
            </h3>
            <p className="text-body-sm text-on-surface-variant font-body max-w-[260px]">
              Aún no has elegido ningún amigurumi. El taller está listo cuando
              tú lo estés.
            </p>
            <Link
              href="/catalog"
              onClick={closeDrawer}
              className="mt-2 inline-flex items-center gap-2 bg-secondary text-on-secondary px-7 py-3 rounded-full font-body text-sm font-bold shadow-button hover:bg-secondary/90 transition-all active:scale-95 tactile-press focus-ring"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            {/* ── Items ────────────────────────────────────── */}
            <ul className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {items.map((item) => {
                const bType: BaseType = item.baseType || (item.hasBase ? "standard" : "none");
                const bInfo = BASE_OPTIONS_INFO[bType];

                return (
                  <li
                    key={item.id}
                    className="relative flex gap-3.5 bg-surface-container-lowest/90 backdrop-blur-xs rounded-2xl border border-outline-variant/15 p-3 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <Link
                      href={`/producto/${item.slug}`}
                      onClick={closeDrawer}
                      className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 focus-ring shadow-2xs ring-1 ring-black/5 dark:ring-white/10"
                      aria-label={`Ver ${item.name}`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0">
                            <Link
                              href={`/producto/${item.slug}`}
                              onClick={closeDrawer}
                              className="font-headline text-[14px] font-bold text-on-surface hover:text-secondary transition-colors leading-tight focus-ring block truncate"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[11px] font-body text-on-surface-variant/70 font-medium mt-0.5">
                              ${item.price.toFixed(2)} c/u
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-full bg-surface-container-high/40 hover:bg-error/10 text-on-surface-variant/70 hover:text-error transition-all flex items-center justify-center flex-shrink-0 focus-ring active:scale-95 -mt-0.5 -mr-0.5"
                            aria-label={`Quitar ${item.name} del pedido`}
                            title="Quitar de la bolsa"
                          >
                            <MdClose className="text-[15px]" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => toggleItemBase(item.id)}
                            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                              bType !== "none"
                                ? "bg-secondary-container/40 hover:bg-secondary-container/70 text-secondary border-secondary/30 shadow-2xs"
                                : "bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant/80 hover:text-on-surface border-outline-variant/20 shadow-2xs"
                            }`}
                            title="Haz clic para alternar: Sin base ➔ Normal (+$1.00) ➔ Grande (+$1.50)"
                          >
                            <span>{bType !== "none" ? `🪵 ${bInfo.label}` : "Sin base"}</span>
                            <MdEdit className="text-[10px] opacity-60 flex-shrink-0" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/10">
                        <QtyStepper id={item.id} qty={item.quantity} />
                        <span className="font-headline text-body-md font-bold text-primary tabular-nums tracking-tight">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ── Footer ───────────────────────────────────── */}
            <div className="px-6 py-5 border-t border-outline-variant/20 bg-surface-container-low/40 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-body-sm text-on-surface-variant font-body">
                  Subtotal
                </span>
                <span className="font-headline text-headline-sm font-bold text-primary tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant/80 font-body mb-4">
                {SHIPPING.note} · El pago se coordina por chat
              </p>
              <Link
                href="/bag"
                onClick={closeDrawer}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-on-secondary px-6 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-secondary/90 transition-all active:scale-[0.97] tactile-press focus-ring"
              >
                Ver mi pedido
                <MdShoppingBag className="text-[18px]" />
              </Link>
              <button
                onClick={closeDrawer}
                className="w-full mt-2 px-6 py-2.5 rounded-full font-body text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors focus-ring"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
