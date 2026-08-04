"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

/* ── Shared IntersectionObserver ──────────────────────────
 * Un solo observer para todos los elementos: evita crear un
 * observer por card (40+ en el catálogo).
 */

let sharedObserver: IntersectionObserver | null = null;
const registry = new Map<Element, () => void>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const reveal = registry.get(entry.target);
            if (reveal) {
              reveal();
              registry.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
  }
  return sharedObserver;
}

/* ── Component ──────────────────────────────────────────── */

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  style: styleProp,
}: ScrollRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respetar prefers-reduced-motion: sin desplazamiento ni transición.
    // El contenido nunca se oculta, solo se anula el movimiento.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setRevealed(true);
      return;
    }

    // Verificar visibilidad inmediata después del layout (requestAnimationFrame
    // garantiza que el navegador ya calculó posiciones incluso tras re-render).
    const raf = requestAnimationFrame(() => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const isInViewport =
        rect.top < window.innerHeight + 40 && rect.bottom > 0;

      if (isInViewport) {
        setRevealed(true);
        return;
      }

      // Fuera del viewport: registrarse en el observer compartido
      registry.set(el, () => setRevealed(true));
      getSharedObserver()?.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (el) {
        registry.delete(el);
        sharedObserver?.unobserve(el);
      }
    };
  }, []);

  const delayStyle =
    !reduced && delay > 0 ? { transitionDelay: `${delay * 0.08}s` } : undefined;

  const mergedStyle = styleProp
    ? { ...styleProp, ...delayStyle }
    : delayStyle;

  return (
    <div
      ref={ref}
      className={className || undefined}
      style={{
        transform: reduced || revealed ? "none" : "translateY(24px)",
        transition: reduced
          ? "none"
          : "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        ...mergedStyle,
      }}
    >
      {children}
    </div>
  );
}
