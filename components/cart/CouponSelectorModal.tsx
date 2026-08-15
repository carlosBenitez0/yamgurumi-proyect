"use client";

import { useEffect, useRef, useState } from "react";
import {
  MdClose,
  MdConfirmationNumber,
  MdCheckCircle,
  MdAutoAwesome,
  MdLocalOffer,
  MdArrowForward,
} from "react-icons/md";
import { AvailableDiscount } from "@/src/actions/discounts/get-user-discounts";

interface CouponSelectorModalProps {
  open: boolean;
  onClose: () => void;
  discounts: AvailableDiscount[];
  activeDiscountCode: string | null;
  onApplyCoupon: (code: string) => Promise<void>;
  loading: boolean;
}

export default function CouponSelectorModal({
  open,
  onClose,
  discounts,
  activeDiscountCode,
  onApplyCoupon,
  loading,
}: CouponSelectorModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtnRef.current?.focus(), 100);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    await onApplyCoupon(customInput.trim());
    setCustomInput("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-md animate-[search-fade-in_0.2s_ease]"
    >
      <div
        ref={panelRef}
        className="bg-surface-container-lowest w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-elevation border border-primary-container/30 space-y-6 relative overflow-hidden animate-[search-slide-down_0.3s_cubic-bezier(0.16,1,0.3,1)] max-h-[85vh] flex flex-col"
      >
        {/* Fondo decorativo artesanal */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-primary-container/20 pb-4 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-xl shadow-inner">
              <MdConfirmationNumber />
            </div>
            <div>
              <h2
                id="coupon-modal-title"
                className="font-headline text-xl sm:text-2xl font-bold text-on-surface"
              >
                Tus Cupones Yamgurumi 🧶
              </h2>
              <p className="text-xs text-on-surface-variant font-body">
                Selecciona uno de tus códigos disponibles para aplicar a tu bolsa.
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant focus-ring"
            aria-label="Cerrar ventana de cupones"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Lista de cupones con scroll bonito */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 relative z-10 py-1">
          {discounts.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                <span>Cupones de tu cuenta ({discounts.length})</span>
                <span className="text-secondary flex items-center gap-1 text-[11px] font-semibold">
                  <MdAutoAwesome className="text-sm" /> 1 cupón por pedido
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {discounts.map((disc) => {
                  const isActive = activeDiscountCode === disc.code;
                  return (
                    <div
                      key={disc.code}
                      className={`relative group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isActive
                          ? "border-secondary bg-secondary-container/25 shadow-card ring-2 ring-secondary/20"
                          : "border-dashed border-secondary/40 bg-surface-container-low/40 hover:bg-surface-container-lowest hover:border-secondary hover:shadow-card"
                      }`}
                    >
                      {/* Agujeros decorativos de ticket artesanal */}
                      <span
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant/30 hidden sm:block"
                        aria-hidden="true"
                      />
                      <span
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant/30 hidden sm:block"
                        aria-hidden="true"
                      />

                      <div className="space-y-1.5 min-w-0 pl-1 sm:pl-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-secondary text-white shadow-sm flex items-center gap-1 font-label">
                            <MdLocalOffer className="text-xs" />
                            -{disc.percent}% OFF
                          </span>
                          <span className="font-mono text-base font-extrabold text-on-surface tracking-wider">
                            {disc.code}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-secondary border border-secondary/30">
                              <MdCheckCircle className="text-xs" /> Activo
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-on-surface-variant font-body">
                          {disc.expiresAt
                            ? `Válido hasta el ${new Date(disc.expiresAt).toLocaleDateString("es-ES")}`
                            : "Cupón exclusivo de cliente registrado · Válido para tu pedido"}
                        </p>
                      </div>

                      <div className="w-full sm:w-auto flex items-center justify-end shrink-0 pt-2 sm:pt-0">
                        {isActive ? (
                          <span className="text-xs font-bold text-secondary bg-secondary/15 px-4 py-2 rounded-full flex items-center gap-1.5 border border-secondary/30">
                            <MdCheckCircle /> Aplicado
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                              await onApplyCoupon(disc.code);
                              onClose();
                            }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shadow-button hover:bg-secondary/90 transition-all tactile-press disabled:opacity-50 active:scale-95 cursor-pointer"
                          >
                            <span>Usar este cupón</span>
                            <MdArrowForward className="text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3 bg-surface-container-low/30 rounded-2xl p-4 border border-dashed border-outline-variant/30">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-2xl mx-auto border border-secondary/20 shadow-inner">
                <MdConfirmationNumber />
              </div>
              <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                No tienes cupones personales guardados actualmente. ¡Puedes ingresar un código promocional abajo!
              </p>
            </div>
          )}

          {/* Formulario para código manual dentro del Modal */}
          <div className="pt-3 border-t border-outline-variant/15 space-y-2">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider font-label">
              ¿Tienes otro código promocional?
            </label>
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. PROMO2026"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="bg-surface-container border border-outline-variant/30 rounded-2xl px-4 py-2.5 text-xs font-body outline-none focus:ring-2 focus:ring-secondary w-full"
              />
              <button
                type="submit"
                disabled={loading || !customInput.trim()}
                className="bg-secondary text-white font-bold px-5 py-2.5 rounded-2xl text-xs hover:bg-secondary/90 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer shadow-sm"
              >
                Aplicar
              </button>
            </form>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="pt-2 border-t border-primary-container/20 flex justify-end shrink-0 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
