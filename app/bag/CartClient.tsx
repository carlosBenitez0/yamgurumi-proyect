"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MdClose,
  MdDeleteOutline,
  MdShoppingBag,
} from "react-icons/md";
import {
  useCartStore,
  selectCount,
  selectSubtotal,
} from "@/lib/cart-store";
import {
  buildWhatsAppLink,
  SHIPPING,
  DELIVERY_ZONES,
} from "@/lib/cart-whatsapp";
import QtyStepper from "@/components/cart/QtyStepper";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { YarnBall, StitchDots } from "@/components/ui/CraftBackground";

/* ── Icono WhatsApp ────────────────────────────────────── */

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── Campos del formulario ─────────────────────────────── */

interface DeliveryForm {
  name: string;
  phone: string;
  zone: string;
  note: string;
}

const EMPTY_FORM: DeliveryForm = { name: "", phone: "", zone: "San Salvador", note: "" };

function isValidPhone(phone: string): boolean {
  return /^[267]\d{3}[- ]?\d{4}$/.test(phone.trim());
}

const inputClasses =
  "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-3.5 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all";

/* ── Etiqueta de precio del taller ─────────────────────── */

function PriceTag({ total }: { total: number }) {
  return (
    <div className="stitch-tag relative mt-3 px-5 py-4 flex items-center justify-between -rotate-1">
      {/* Agujero del hilo */}
      <span
        className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border border-secondary/50"
        aria-hidden="true"
      />
      <span className="text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label">
        Total
      </span>
      <span className="font-headline text-headline-lg font-bold text-primary tabular-nums">
        ${total.toFixed(2)}
      </span>
    </div>
  );
}

/* ── Página ────────────────────────────────────────────── */

export default function CartClient() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotal);

  const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone", string>>>({});
  const [sent, setSent] = useState(false);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const waLink = useMemo(
    () => buildWhatsAppLink(items, form),
    [items, form],
  );

  const setField = (key: keyof DeliveryForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "name" || key === "phone") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSend = () => {
    const nextErrors: typeof errors = {};
    if (!form.name.trim()) nextErrors.name = "Escribe tu nombre para que el taller te reconozca.";
    if (!form.phone.trim()) nextErrors.phone = "Necesitamos tu teléfono para coordinar la entrega.";
    else if (!isValidPhone(form.phone)) nextErrors.phone = "Revisa el número: 8 dígitos, empieza con 2, 6 o 7.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const target = nextErrors.name ? nameRef.current : phoneRef.current;
      if (target) {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
      }
      return;
    }

    window.open(waLink, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const handleClearRequest = () => setIsClearOpen(true);
  const handleClearConfirm = () => {
    clearCart();
    setIsClearOpen(false);
  };

  /* ── Vacío ───────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="relative w-36 h-36 flex items-center justify-center mb-2">
          <StitchDots className="w-32 h-32 opacity-40" />
          <YarnBall className="w-24 h-24" />
        </div>
        <h1 className="font-headline text-headline-lg sm:text-headline-xl font-bold text-primary">
          Tu bolsa está vacía
        </h1>
        <p className="text-body text-on-surface-variant font-body max-w-md mt-3 leading-relaxed">
          El taller tiene listo cada amigurumi para ti. Empieza por los más
          queridos o pide tu favorito.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-8 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-secondary/90 transition-all active:scale-95 tactile-press focus-ring"
          >
            <MdShoppingBag className="text-[18px]" />
            Ver el catálogo
          </Link>
          <Link
            href="/catalog?sort=rating"
            className="inline-flex items-center justify-center gap-2 border-2 border-primary/60 text-primary px-8 py-3 rounded-full font-body text-sm font-bold hover:bg-primary/5 transition-all active:scale-95 tactile-press focus-ring"
          >
            Los más queridos
          </Link>
        </div>
        <p className="text-body-sm text-on-surface-variant/80 font-body mt-10 max-w-sm">
          ¿Prefieres encargar una pieza especial? Escríbenos directo por{" "}
          <a
            href="https://wa.me/50377311064"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary font-semibold hover:underline"
          >
            WhatsApp
          </a>
          .
        </p>
      </main>
    );
  }

  /* ── Con items ───────────────────────────────────────── */
  return (
    <main className="min-h-screen pb-28 lg:pb-16">
      <div className="section-container pt-28 sm:pt-32">
        {/* ── Encabezado ──────────────────────────────────── */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-headline text-headline-lg sm:text-headline-xl font-bold text-primary">
              Tu pedido
            </h1>
            <p className="text-body-sm text-on-surface-variant font-body mt-1.5">
              {count} {count === 1 ? "pieza" : "piezas"} ·{" "}
              {items.length} {items.length === 1 ? "amigurumi" : "amigurumis"}
            </p>
          </div>
          <button
            onClick={handleClearRequest}
            className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant/80 hover:text-error font-body font-semibold transition-colors px-3.5 py-2.5 -m-2 rounded-full focus-ring"
          >
            <MdDeleteOutline className="text-[18px]" />
            Vaciar pedido
          </button>
        </div>

        {/* ── Dos paneles ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-10 mt-6 sm:mt-8 items-start">
          {/* Panel izquierdo: las piezas */}
          <section aria-label="Piezas de tu pedido">
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 p-3 sm:p-4 sm:rounded-3xl shadow-card"
                >
                  <Link
                    href={`/producto/${item.slug}`}
                    className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-surface-container flex-shrink-0 focus-ring"
                    aria-label={`Ver ${item.name}`}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(min-width: 640px) 96px, 64px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/producto/${item.slug}`}
                          className="font-headline text-body sm:text-headline-sm font-semibold text-on-surface hover:text-secondary transition-colors leading-snug focus-ring"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs sm:text-body-sm text-on-surface-variant font-body mt-0.5">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 flex items-center justify-center -m-1.5 hover:bg-error-container/40 rounded-full text-on-surface-variant hover:text-error transition-colors focus-ring flex-shrink-0"
                        aria-label={`Quitar ${item.name} del pedido`}
                      >
                        <MdClose className="text-[16px] sm:text-[18px]" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
                      <QtyStepper id={item.id} qty={item.quantity} />
                      <span className="font-headline text-headline-sm sm:text-headline-md font-bold text-primary tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Panel derecho: la cuenta + la ficha */}
          <div className="flex flex-col gap-6 self-start w-full">
            {/* ── La cuenta ─────────────────────────────── */}
            <section
              aria-label="Resumen de tu pedido"
              className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card"
            >
              <h2 className="font-headline text-headline-sm font-bold text-primary">
                La cuenta
              </h2>

              <div className="flex items-center justify-between mt-4">
                <span className="text-body-sm text-on-surface-variant font-body">
                  Subtotal
                </span>
                <span className="font-body text-body-md font-bold text-on-surface tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-body-sm text-on-surface-variant font-body">
                  Envío
                </span>
                <span className="text-body-sm text-on-surface-variant font-body text-right max-w-[180px]">
                  {SHIPPING.note}
                </span>
              </div>

              <div className="stitch-divider my-4" aria-hidden="true" />

              <PriceTag total={subtotal} />
            </section>

            {/* ── La ficha ──────────────────────────────── */}
            <section
              aria-label="Datos de entrega"
              className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card"
            >
              <h2 className="font-headline text-headline-sm font-bold text-primary">
                La ficha del encargo
              </h2>
              <p className="text-body-sm text-on-surface-variant font-body mt-1">
                Para que el taller sepa dónde entregar tu pedido.
              </p>

              <div className="flex flex-col gap-4 mt-5">
                <div>
                  <label
                    htmlFor="cart-name"
                    className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
                  >
                    Nombre <span className="text-error" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cart-name"
                    ref={nameRef}
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Tu nombre"
                    className={`${inputClasses} ${errors.name ? "border-error focus:ring-error" : ""}`}
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-describedby={errors.name ? "cart-name-error" : undefined}
                  />
                  {errors.name && (
                    <p
                      id="cart-name-error"
                      className="text-body-sm text-error font-body mt-1.5"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cart-phone"
                    className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
                  >
                    Teléfono <span className="text-error" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cart-phone"
                    ref={phoneRef}
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="7000-0000"
                    className={`${inputClasses} ${errors.phone ? "border-error focus:ring-error" : ""}`}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    aria-required="true"
                    aria-describedby={errors.phone ? "cart-phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p
                      id="cart-phone-error"
                      className="text-body-sm text-error font-body mt-1.5"
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cart-zone"
                    className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
                  >
                    Zona de entrega
                  </label>
                  <select
                    id="cart-zone"
                    value={form.zone}
                    onChange={(e) => setField("zone", e.target.value)}
                    className={inputClasses}
                  >
                    {DELIVERY_ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cart-note"
                    className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
                  >
                    Nota <span className="normal-case tracking-normal font-body font-normal">(opcional)</span>
                  </label>
                  <textarea
                    id="cart-note"
                    value={form.note}
                    onChange={(e) => setField("note", e.target.value)}
                    placeholder="¿Es un regalo? ¿Algún detalle que debamos saber?"
                    rows={3}
                    className={`${inputClasses} resize-none`}
                  />
                </div>
              </div>

              {/* CTA desktop */}
              <button
                onClick={handleSend}
                className="hidden lg:flex w-full mt-6 items-center justify-center gap-2.5 bg-whatsapp text-white px-6 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-whatsapp-hover transition-all active:scale-[0.97] tactile-press focus-ring"
              >
                <WhatsAppIcon className="w-[18px] h-[18px] flex-shrink-0" />
                Enviar pedido por WhatsApp
              </button>

              <p className="hidden lg:block text-body-sm text-on-surface-variant/80 font-body mt-3 text-center leading-relaxed">
                Se abre WhatsApp con tu pedido listo. El pago se coordina por
                chat con el taller.
              </p>
            </section>
          </div>
        </div>

        {/* ── Confirmación de envío ─────────────────────── */}
        {sent && (
          <div
            role="status"
            aria-live="polite"
            className="mt-8 flex flex-col sm:flex-row items-center gap-3 bg-secondary-container/40 border border-secondary-container/60 rounded-2xl px-5 py-4"
          >
            <span className="text-secondary text-label-md font-bold uppercase tracking-widest font-label">
              Pedido armado
            </span>
            <p className="text-body-sm text-on-surface-variant font-body text-center sm:text-left">
              Abrimos WhatsApp con tu pedido. ¿No se abrió?{" "}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-bold hover:underline"
              >
                Ábrelo aquí
              </a>
              .
            </p>
          </div>
        )}
      </div>

      {/* ── Barra inferior fija (mobile) ─────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-surface-bright/95 backdrop-blur-xl border-t border-outline-variant/20 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-body-sm text-on-surface-variant font-body">
            Total
          </span>
          <span className="font-headline text-headline-md font-bold text-primary tabular-nums">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleSend}
          className="w-full flex items-center justify-center gap-2.5 bg-whatsapp text-white px-6 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-whatsapp-hover transition-all active:scale-[0.97] tactile-press focus-ring"
        >
          <WhatsAppIcon className="w-[18px] h-[18px] flex-shrink-0" />
          Enviar pedido por WhatsApp
        </button>
      </div>

      {/* ── Confirmación de vaciado ─────────────────────── */}
      <ConfirmDialog
        open={isClearOpen}
        title="¿Vaciar el pedido?"
        message={`Se quitarán ${count} ${count === 1 ? "pieza" : "piezas"} de tu bolsa. No se puede deshacer.`}
        confirmLabel="Sí, vaciar"
        destructive
        onConfirm={handleClearConfirm}
        onCancel={() => setIsClearOpen(false)}
      />
    </main>
  );
}
