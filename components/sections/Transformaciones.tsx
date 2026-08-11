'use client'

import { useState, useRef, useEffect, useCallback } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StitchDots, YarnThread } from "@/components/ui/CraftBackground";
import { MdWhatsapp, MdImage } from "react-icons/md";
import { products as allProducts } from "@/data/products";

/* ── Pares "antes → después" ─────────────────────────────────
 * TODO: reemplazar las URLs placeholder de "antes" con fotos de origen reales
 * en `public/images/transformaciones/<id>-antes.jpg`.
 * "Después" = imageUrl real de cada producto. */

const BEFORE_BG = "ede0d4";
const BEFORE_FG = "72594e";

function pickProduct(id: string) {
  return allProducts.find((p) => p.id === id) ?? allProducts[0];
}

const pares = [
  { id: "gato-naranja", tema: "Gatito" },
  { id: "buho-sabio", tema: "Búho" },
  { id: "dragon-celestino", tema: "Dragón" },
  { id: "zorro-otonal", tema: "Zorro" },
  { id: "amigurumi-unicornio", tema: "Unicornio" },
  { id: "conejo-primavera", tema: "Conejo" },
].map((p) => {
  const producto = pickProduct(p.id);
  return {
    tema: p.tema,
    producto,
    antes: `https://placehold.co/400x400/png/${BEFORE_BG}/${BEFORE_FG}?text=${encodeURIComponent(p.tema)}`,
    despues: producto.imageUrl,
  };
});

const WHATSAPP_URL = `https://wa.me/50377311064?text=${encodeURIComponent(
  "Hola Yamgurumi! Quiero transformar una imagen en un amigurumi. Te envío la foto por acá.",
)}`;

/* ── Card de transformación reutilizable (desktop grid) ── */
function TransformCard({
  par,
  delay,
  className = "",
}: {
  par: (typeof pares)[number];
  delay: number;
  className?: string;
}) {
  return (
    <ScrollReveal delay={delay}>
      <CardInner par={par} className={className} />
    </ScrollReveal>
  );
}

/* ── Card interior compartida entre grid y slider ── */
function CardInner({
  par,
  className = "",
}: {
  par: (typeof pares)[number];
  className?: string;
}) {
  return (
    <div
      className={`group relative bg-surface-container-lowest rounded-[16px] overflow-hidden ring-1 ring-black/[0.04] transition-all duration-300 hover:ring-black/[0.08] hover:shadow-[0_8px_30px_rgba(114,89,78,0.08)] hover:-translate-y-0.5 ${className}`}
    >
      {/* Nombre del producto como overlay superior */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 via-black/10 to-transparent p-3 pointer-events-none">
        <span className="font-headline text-[11px] sm:text-xs font-bold text-white drop-shadow-sm tracking-wide">
          {par.producto.name}
        </span>
      </div>

      {/* Grid interno: Antes | Después */}
      <div className="grid grid-cols-2 h-full">
        {/* Antes */}
        <div className="relative overflow-hidden bg-surface-container aspect-square">
          <img
            src={par.antes}
            alt={`Antes: ${par.tema} como imagen de origen`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className =
                "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-container";
              fallback.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-on-surface-variant/30"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="text-on-surface-variant/40 font-body text-[10px]">Tu imagen</span>
              `;
              img.parentElement!.appendChild(fallback);
            }}
          />
          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-on-surface-variant/80 backdrop-blur-sm">
            Antes
          </span>
        </div>

        {/* Después */}
        <div className="relative overflow-hidden bg-surface-container aspect-square">
          <img
            src={par.despues}
            alt={`Después: ${par.producto.name} como amigurumi`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-on-surface-variant/80 backdrop-blur-sm">
            Después
          </span>
          {/* Flecha decorativa entre las dos mitades */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary/90 text-white flex items-center justify-center shadow-md text-[10px] font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            →
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Transformaciones() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  /* Track which slide is visible via IntersectionObserver */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slides = container.querySelectorAll<HTMLElement>("[data-slide]");
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-slide"));
            if (!isNaN(idx)) setActiveSlide(idx);
          }
        }
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Scroll to a specific slide when tapping a dot */
  const scrollToSlide = useCallback((idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const slide = container.querySelector<HTMLElement>(`[data-slide="${idx}"]`);
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  return (
    <SectionWrapper
      id="transformaciones"
      className="relative overflow-hidden"
    >
      {/* Craft decorations */}
      <StitchDots className="top-4 right-8 craft-drift opacity-30 hidden md:block" />
      <YarnThread
        d="M 0 60 Q 300 20, 600 60 T 1200 60"
        color="#f6bab2"
        strokeWidth={1.5}
        opacity={0.1}
        className="absolute bottom-2 left-0 w-full h-20 craft-sway -z-10"
      />

      {/* Header */}
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Transformaciones
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface">
            De tu foto al amigurumi
          </h2>
          <p className="text-on-surface-variant font-body text-body-md mt-2">
            Envianos cualquier imagen — un personaje de dibujos, una ilustración o
            incluso un boceto a mano — y el taller la transforma en un amigurumi
            único, tejido a mano.
          </p>
        </div>
      </ScrollReveal>

      {/* ── Mobile: horizontal scroll-snap slider ── */}
      <div className="sm:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {pares.map((par, i) => (
            <div
              key={par.producto.id}
              data-slide={i}
              className="flex-none w-[85vw] max-w-[360px] snap-center"
            >
              <CardInner par={par} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {pares.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a transformación ${i + 1}`}
              onClick={() => scrollToSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? "w-5 h-2 bg-secondary"
                  : "w-2 h-2 bg-on-surface-variant/20 hover:bg-on-surface-variant/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop/Tablet: 3-col grid ── */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TransformCard par={pares[0]} delay={1} />
        <TransformCard par={pares[1]} delay={2} />
        <TransformCard par={pares[2]} delay={3} />

        <TransformCard par={pares[3]} delay={4} />
        <TransformCard par={pares[4]} delay={5} />
        <TransformCard par={pares[5]} delay={6} />
      </div>

      {/* CTA — full width (always visible) */}
      <div className="mt-4">
        <ScrollReveal delay={7}>
          <div className="relative bg-surface-container-lowest rounded-[16px] border-2 border-dashed border-primary-container/30 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8 text-center sm:text-left transition-all duration-300 hover:border-secondary/40 hover:bg-surface-container-lowest/90 hover:shadow-[0_8px_30px_rgba(114,89,78,0.06)] hover:-translate-y-0.5">
            <div className="w-14 h-14 rounded-[12px] bg-secondary/10 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110">
              <MdImage className="text-[28px] text-secondary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline text-sm font-bold text-on-surface">
                ¿Tienes una imagen en mente?
              </span>
              <span className="text-xs text-on-surface-variant/60 font-body leading-relaxed max-w-sm">
                Envianos tu foto, boceto o ilustración y la transformamos en un amigurumi único tejido a mano.
              </span>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-white px-5 py-2.5 font-bold rounded-full hover:bg-whatsapp-hover active:scale-95 transition-all text-center text-xs inline-flex justify-center items-center gap-1.5 tactile-press shadow-button focus-ring shrink-0 sm:ml-auto"
            >
              <MdWhatsapp className="text-[16px]" />
              Enviar por WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}
