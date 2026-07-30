"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

      // Solo crear observer si está fuera del viewport
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(el);
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );

      observer.observe(el);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const delayStyle =
    delay > 0 ? { transitionDelay: `${delay * 0.08}s` } : undefined;

  return (
    <div
      ref={ref}
      className={className || undefined}
      style={{
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transition:
          "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        ...delayStyle,
      }}
    >
      {children}
    </div>
  );
}
