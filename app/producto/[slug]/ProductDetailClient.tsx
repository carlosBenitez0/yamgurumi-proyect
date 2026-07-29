"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Product } from "@/data/products";
import {
  MdStar,
  MdStarHalf,
  MdLocalShipping,
  MdShield,
  MdHandshake,
  MdArrowBack,
  MdShoppingCart,
  MdCheck,
  MdStraighten,
  MdCleaningServices,
  MdAutoStories,
} from "react-icons/md";

/* ── Helpers ──────────────────────────────────────────── */

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <MdStar key={`f${i}`} className="text-[#e6a817] text-[18px]" />
        ))}
        {half && <MdStarHalf className="text-[#e6a817] text-[18px]" />}
        {Array.from({ length: empty }).map((_, i) => (
          <MdStar key={`e${i}`} className="text-outline-variant/40 text-[18px]" />
        ))}
      </div>
      <span className="text-body-sm text-on-surface-variant font-body">
        {rating} ({reviews} reseñas)
      </span>
    </div>
  );
}

function TagBadge({ tag }: { tag: string }) {
  const colorMap: Record<string, string> = {
    "Best Seller": "bg-secondary/10 text-secondary border-secondary/20",
    Nuevo: "bg-tertiary/10 text-tertiary border-tertiary/20",
    Popular: "bg-secondary-container/50 text-secondary border-secondary-container/40",
    Limitado: "bg-primary-container/50 text-on-primary-container border-primary-container/40",
    Infantil: "bg-secondary-container/50 text-secondary border-secondary-container/40",
    Seguro: "bg-secondary-container/50 text-secondary border-secondary-container/40",
    Navideño: "bg-tertiary/10 text-tertiary border-tertiary/20",
    Temporada: "bg-tertiary/10 text-tertiary border-tertiary/20",
    Decoración: "bg-primary-container/30 text-on-primary-container border-primary-container/30",
    Hogar: "bg-primary-container/30 text-on-primary-container border-primary-container/30",
    Llaveros: "bg-secondary-container/50 text-secondary border-secondary-container/40",
    Accesorios: "bg-secondary-container/50 text-secondary border-secondary-container/40",
    Bebé: "bg-tertiary/10 text-tertiary border-tertiary/20",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-label uppercase tracking-wider border ${
        colorMap[tag] || "bg-surface-container text-on-surface-variant border-outline-variant/30"
      }`}
    >
      {tag}
    </span>
  );
}

/* ── Main Component ───────────────────────────────────── */

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({
  product,
  related,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [magnifier, setMagnifier] = useState({ active: false, x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const whatsappMessage = useMemo(() => {
    const baseUrl = typeof window !== "undefined"
      ? window.location.origin
      : "https://yamgurumi.com";
    const productUrl = `${baseUrl}/producto/${product.slug}`;

    // Unicode symbols with universal WhatsApp support
    const STAR = "\u2605";
    const HAND = "\u261E";
    const DIAMOND = "\u25C6";
    const CHECK = "\u2713";

    return encodeURIComponent(
`${STAR}${STAR} Tejido con amor, pensado para ti! ${STAR}${STAR}

${STAR} ${product.name}
  $${product.price.toFixed(2)}  |  ${product.category}

${HAND} Detalles:
${product.description}

${DIAMOND} Materiales: ${product.materials}
${STAR} ${product.rating}/5  |  ${product.reviews} resenas

----------

${CHECK} Lo vi aqui:
${productUrl}

${HAND} Sigue disponible?
${STAR}${STAR} Gracias, Yamgurumi! ${STAR}${STAR}`
    );
  }, [product]);

  const scrollSlider = useCallback((direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.6;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const magnifierStyle = useMemo(() => {
    if (!magnifier.active || !imgContainerRef.current) return null;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const imgW = rect.width;
    const imgH = rect.height;
    const zoom = 2.5;
    const lensSize = 250;
    const lensRadius = lensSize / 2;
    const bgW = imgW * zoom;
    const bgH = imgH * zoom;
    const bgX = -(magnifier.x * zoom - lensRadius);
    const bgY = -(magnifier.y * zoom - lensRadius);
    return { lensSize, bgW, bgH, bgX, bgY };
  }, [magnifier]);

  const handleAddToCart = useCallback(() => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, []);

  const makerStory = {
    title: "La Artesana",
    content:
      "Cada amigurumi es creado por una artesana en El Salvador que dedicó años a perfeccionar el arte del crochet. Con paciencia y cariño, cada pieza toma entre 8 y 20 horas en completarse. No hay máquinas, no hay prisa — solo manos que transforman hilo en amigos.",
  };

  const trustItems = [
    { icon: <MdLocalShipping className="text-[20px]" />, label: "Envío gratis en San Salvador" },
    { icon: <MdShield className="text-[20px]" />, label: "100% Algodón orgánico" },
    { icon: <MdHandshake className="text-[20px]" />, label: "Hecho a mano con amor" },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* ── Back button ──────────────────────────────────── */}
      <div className="section-container pt-28 sm:pt-32 pb-2">
        <Link
          href="/#tienda"
          className="inline-flex items-center gap-2 text-on-surface-variant/70 hover:text-secondary font-body text-sm font-medium transition-colors duration-300 group relative"
        >
          <MdArrowBack className="text-[16px] group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative">
            Volver al catálogo
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-secondary/40 group-hover:w-full transition-all duration-300" />
          </span>
        </Link>
      </div>

      {/* ── Product Hero ─────────────────────────────────── */}
      <section className="section-container pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Image — 7 cols on desktop */}
          <div className="lg:col-span-7">
            <div
              ref={imgContainerRef}
              className="relative rounded-3xl overflow-hidden bg-surface-container aspect-square sm:aspect-[4/5] lg:aspect-square shadow-card cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMagnifier({ active: true, x, y });
              }}
              onMouseLeave={() => setMagnifier((prev) => ({ ...prev, active: false }))}
            >
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 img-placeholder" />
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Magnifier lens */}
              {magnifier.active && imageLoaded && magnifierStyle && (
                <div
                  className="pointer-events-none absolute z-20 hidden sm:block"
                  style={{
                    left: magnifier.x,
                    top: magnifier.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Lens ring */}
                  <div
                    className="rounded-full border-[3px] border-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden"
                    style={{ width: magnifierStyle.lensSize, height: magnifierStyle.lensSize }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${product.imageUrl})`,
                        backgroundSize: `${magnifierStyle.bgW}px ${magnifierStyle.bgH}px`,
                        backgroundPosition: `${magnifierStyle.bgX}px ${magnifierStyle.bgY}px`,
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                  {/* Magnifier handle */}
                  <div className="absolute bottom-[-10px] right-[-10px] w-[38px] h-[38px] rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.2)] border border-black/5 flex items-center justify-center rotate-[-30deg]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#72594e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info — 5 cols on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="flex flex-col gap-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>

              {/* Name */}
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-[40px] font-bold text-on-surface leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <StarRating rating={product.rating} reviews={product.reviews} />

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-4xl sm:text-[42px] font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-body-sm text-on-surface-variant font-body">
                  USD
                </span>
              </div>

              {/* Description */}
              <p className="text-body text-on-surface-variant font-body leading-relaxed">
                {product.description}
              </p>

              {/* Materials preview */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary-container/20 rounded-2xl border border-secondary-container/30">
                <span className="text-[18px]">🧶</span>
                <span className="text-body-sm text-secondary font-body font-semibold">
                  {product.materials}
                </span>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-body text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-[0.97] shadow-button hover:shadow-elevation ${
                    addedToCart
                      ? "bg-secondary/90 text-on-secondary"
                      : "bg-secondary text-on-secondary hover:bg-secondary/90"
                  }`}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {addedToCart ? (
                    <>
                      <MdCheck className="text-[18px] flex-shrink-0" />
                      ¡Agregado!
                    </>
                  ) : (
                    <>
                      <MdShoppingCart className="text-[18px] flex-shrink-0" />
                      Agregar al carrito
                    </>
                  )}
                </button>

                <Link
                  href={`https://wa.me/50377311064?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-body text-sm font-bold whitespace-nowrap bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all duration-300 active:scale-[0.97] shadow-button hover:shadow-elevation"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-2.5 mt-3">
                {trustItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-on-surface-variant"
                  >
                    <span className="text-secondary">{item.icon}</span>
                    <span className="text-body-sm font-body">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Info Cards ────────────────────────────────────── */}
      <ScrollReveal>
        <section className="section-container py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3 font-label">
                Detalles del producto
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                Lo que necesitas saber
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Materiales y Seguridad */}
              <div className="bg-surface-container-lowest rounded-3xl shadow-card border border-primary-container/15 p-5 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <MdShield className="text-[22px] text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-semibold text-on-surface">
                      Materiales y Seguridad
                    </h3>
                    <p className="text-body-sm text-on-surface-variant/60 font-body">
                      100% orgánico y seguro
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "100% Algodón mercerizado orgánico — suave, resistente y lavable",
                    "Relleno hipoalergénico, seguro para niños y bebés",
                    "Ojos de seguridad cosidos (no pegados) — certificación ASTM",
                    "Libre de toxinas, colorantes seguros lavables",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MdCheck className="text-[11px] text-secondary" />
                      </span>
                      <span className="text-body-sm text-on-surface-variant font-body leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dimensiones */}
              <div className="bg-surface-container-lowest rounded-3xl shadow-card border border-primary-container/15 p-5 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                    <MdStraighten className="text-[22px] text-tertiary" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-semibold text-on-surface">
                      Dimensiones
                    </h3>
                    <p className="text-body-sm text-on-surface-variant/60 font-body">
                      Tamaño y peso real
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Altura", value: "18–25 cm", icon: "↕" },
                    { label: "Peso", value: "80–150 g", icon: "⚖" },
                    { label: "Base", value: "8–12 cm", icon: "⬡" },
                    { label: "Tiempo", value: "8–20 hrs", icon: "⏱" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-surface-container/60 rounded-2xl p-3.5 text-center border border-outline-variant/8"
                    >
                      <span className="text-[18px] block mb-1">{item.icon}</span>
                      <span className="font-headline text-lg font-bold text-on-surface block">
                        {item.value}
                      </span>
                      <span className="text-body-sm text-on-surface-variant/60 font-body">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuidado y Mantenimiento */}
              <div className="bg-surface-container-lowest rounded-3xl shadow-card border border-primary-container/15 p-5 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary-container/30 flex items-center justify-center flex-shrink-0">
                    <MdCleaningServices className="text-[22px] text-on-primary-container" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-semibold text-on-surface">
                      Cuidado y Mantenimiento
                    </h3>
                    <p className="text-body-sm text-on-surface-variant/60 font-body">
                      Lavar, secar, conservar
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Lavado a mano con agua tibia y jabón suave",
                    "No usar blanqueador ni secadora",
                    "Secar a la sombra, presionando sin torcer",
                    "Almacenar en lugar seco, alejado de la luz directa",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary-container/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-on-primary-container font-bold">{i + 1}</span>
                      </span>
                      <span className="text-body-sm text-on-surface-variant font-body leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* La Artesana */}
              <div className="bg-surface-container-lowest rounded-3xl shadow-card border border-primary-container/15 p-5 sm:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#81524c]/10 flex items-center justify-center flex-shrink-0">
                    <MdAutoStories className="text-[22px] text-[#81524c]" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-semibold text-on-surface">
                      La Artesana
                    </h3>
                    <p className="text-body-sm text-on-surface-variant/60 font-body">
                      La historia detrás de cada pieza
                    </p>
                  </div>
                </div>
                <p className="text-body-sm text-on-surface-variant font-body leading-relaxed mb-3">
                  {makerStory.content}
                </p>
                <div className="flex items-center gap-3 bg-[#81524c]/5 rounded-2xl px-4 py-3 border border-[#81524c]/10">
                  <span className="text-[20px]">🧶</span>
                  <span className="text-body-sm text-[#81524c] font-body font-semibold italic">
                    "No hay máquinas, no hay prisa — solo manos que transforman hilo en amigos."
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Related Products ─────────────────────────────── */}
      {related.length > 0 && (
        <ScrollReveal>
          <section className="section-container py-12 sm:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3 font-label">
                  Que también te pueden gustar
                </span>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                  Productos Relacionados
                </h2>
              </div>

              <div className="relative group/slider">
                {/* Left arrow */}
                <button
                  onClick={() => scrollSlider("left")}
                  className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-container-lowest shadow-card border border-primary-container/20 flex items-center justify-center transition-all duration-200 hover:shadow-elevation hover:border-secondary/30 active:scale-95 focus-ring text-on-surface-variant hover:text-secondary"
                  aria-label="Anterior"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Scrollable container */}
                <div
                  ref={sliderRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-0 scroll-smooth"
                >
                  {related.map((item, idx) => (
                    <Link
                      key={item.id}
                      href={`/producto/${item.slug}`}
                      className="flex-shrink-0 w-[240px] sm:w-[270px] group/card first:ml-0 last:mr-0 sm:first:ml-0 sm:last:mr-0"
                    >
                      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-card hover:shadow-elevation transition-all duration-500 border border-primary-container/15 hover:-translate-y-1.5 h-full">
                        {/* Image */}
                        <div className="aspect-square overflow-hidden bg-surface-container relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                            loading={idx < 3 ? undefined : "lazy"}
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              {item.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-body font-semibold px-2.5 py-1 rounded-full bg-white/90 text-on-surface/80 backdrop-blur-sm shadow-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Hover CTA */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                            <span className="px-5 py-2.5 rounded-2xl bg-white/95 text-on-surface font-body text-sm font-bold shadow-lg backdrop-blur-sm translate-y-2 group-hover/card:translate-y-0 transition-all duration-500">
                              Ver producto
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-body font-semibold text-secondary uppercase tracking-wider bg-secondary/8 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="font-headline text-headline-sm text-on-surface font-semibold group-hover/card:text-secondary transition-colors duration-300 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                            <span className="font-headline text-xl font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1">
                              <MdStar className="text-[#e6a817] text-[14px]" />
                              <span className="text-xs text-on-surface-variant font-body font-medium">
                                {item.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => scrollSlider("right")}
                  className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-container-lowest shadow-card border border-primary-container/20 flex items-center justify-center transition-all duration-200 hover:shadow-elevation hover:border-secondary/30 active:scale-95 focus-ring text-on-surface-variant hover:text-secondary"
                  aria-label="Siguiente"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Scroll dots indicator */}
                <div className="flex items-center justify-center gap-2 mt-4 sm:hidden">
                  {related.slice(0, Math.min(related.length, 6)).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!sliderRef.current) return;
                        const card = sliderRef.current.children[idx] as HTMLElement;
                        if (card) {
                          card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
                        }
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-on-surface/15 hover:bg-secondary/50 transition-colors duration-300"
                      aria-label={`Ir al producto ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </main>
  );
}
