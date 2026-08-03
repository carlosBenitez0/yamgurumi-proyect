"use client";

import { useEffect, useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Diálogo de confirmación con el lenguaje visual del taller.
 * Foco inicial en "cancelar" (acción segura), cierre con Escape,
 * trampa de foco y restauración del foco al cerrar.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  /* Mantener la referencia de onCancel fresca sin re-disparar el efecto */
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => cancelRef.current?.focus(), 100);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancelRef.current();
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocusedRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        style={{ animation: "search-fade-in 0.2s ease-out" }}
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative w-full max-w-sm bg-surface-bright rounded-3xl border border-outline-variant/20 shadow-elevation p-6 flex flex-col items-center text-center"
        style={{ animation: "search-slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            destructive
              ? "bg-error-container/60 text-error"
              : "bg-secondary-container/60 text-secondary"
          }`}
        >
          <MdDeleteOutline className="text-[28px]" />
        </div>

        <h2
          id="confirm-dialog-title"
          className="font-headline text-headline-sm font-bold text-primary"
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-message"
          className="text-body-sm text-on-surface-variant font-body mt-2 leading-relaxed"
        >
          {message}
        </p>

        <div className="flex gap-3 w-full mt-6">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 border-2 border-outline-variant/50 text-on-surface-variant font-bold font-body text-sm px-6 py-3 rounded-full hover:bg-surface-container/60 hover:text-on-surface transition-all active:scale-[0.97] tactile-press focus-ring"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-bold font-body text-sm px-6 py-3 rounded-full shadow-button transition-all active:scale-[0.97] tactile-press focus-ring ${
              destructive
                ? "bg-error text-on-error hover:bg-error/90"
                : "bg-secondary text-on-secondary hover:bg-secondary/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
