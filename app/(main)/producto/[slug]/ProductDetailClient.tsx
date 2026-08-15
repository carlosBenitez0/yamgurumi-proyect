"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ui/ProductCard";
import { type Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import {
  MdStar,
  MdStarHalf,
  MdLocalShipping,
  MdShield,
  MdHandshake,
  MdArrowBack,
  MdShoppingBag,
  MdCheck,
  MdStraighten,
  MdCleaningServices,
  MdAutoStories,
  MdAutoAwesome,
  MdFavorite,
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
      <span className="text-body-sm text-on-surface-variant font-body font-bold">
        {rating} ({reviews} reseñas)
      </span>
    </div>
  );
}

function TagBadge({ tag }: { tag: string }) {
  const colorMap: Record<string, string> = {
    "Best Seller": "bg-secondary text-white shadow-sm",
    Nuevo: "bg-tertiary text-white shadow-sm",
    Popular: "bg-secondary-container text-secondary border border-secondary/30",
    Limitado: "bg-primary text-white shadow-sm",
    Infantil: "bg-secondary-container text-secondary border border-secondary/30",
    Seguro: "bg-secondary-container text-secondary border border-secondary/30",
    Navideño: "bg-tertiary/10 text-tertiary border border-tertiary/30",
    Temporada: "bg-tertiary/10 text-tertiary border border-tertiary/30",
    Decoración: "bg-primary-container/40 text-on-primary-container border border-primary-container/30",
    Hogar: "bg-primary-container/40 text-on-primary-container border border-primary-container/30",
    Llaveros: "bg-secondary-container text-secondary border border-secondary/30",
    Accesorios: "bg-secondary-container text-secondary border border-secondary/30",
    Bebé: "bg-tertiary/15 text-tertiary border border-tertiary/30",
  };

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
        colorMap[tag] || "bg-surface-container-lowest text-on-surface-variant border border-primary-container/25"
      }`}
    >
      {tag}
    </span>
  );
}

export default function ProductDetailClient({
  product,
  related,
}: ProductDetailClientProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [magnifier, setMagnifier] = useState({ active: false, x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const whatsappMessage = useMemo(() => {
    const baseUrl = typeof window !== "undefined"
      ? window.location.origin
      : "https://yamgurumi.com";
    const productUrl = `${baseUrl}/producto/${product.slug}`;

    return encodeURIComponent(
      `¡Hola Yamgurumi Studio! 🧶\n\nEstoy interesado en adquirir el amigurumi *${product.name}* ($${product.price.toFixed(2)} USD).\n\nEnlace del producto: ${productUrl}\n\n¿Tienen disponibilidad inmediata para envío en El Salvador? ¡Gracias!`
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
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addItem, product]);

  const makerStory = {
    title: "Artesanía Salvadoreña",
    content:
      "Cada amigurumi es creado por una artesana en San Salvador que ha perfeccionado la técnica del tejido a crochet. Con paciencia y dedicación, cada pieza toma entre 8 y 20 horas de trabajo continuo punto a punto.",
  };

  const trustItems = [
    { icon: <MdLocalShipping className="text-[20px]" />, label: "Envíos directos a todo El Salvador 🇸🇻" },
    { icon: <MdShield className="text-[20px]" />, label: "100% Algodón orgánico e hipoalergénico" },
    { icon: <MdHandshake className="text-[20px]" />, label: "Hecho a mano con amor y cuidado" },
  ];

  return (
    <main className="min-h-screen bg-background pb-16 sm:pb-24">
      {/* ── Back button ──────────────────────────────────── */}
      <div className="section-container pt-28 sm:pt-32 pb-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-secondary font-body text-sm font-bold transition-colors duration-300 group relative"
        >
          <MdArrowBack className="text-lg group-hover:-translate-x-1 transition-transform duration-300 text-secondary" />
          <span className="relative">
            Volver al Catálogo Yamgurumi
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-300" />
          </span>
        </Link>
      </div>

      {/* ── Product Hero Section ────────────────────────── */}
      <section className="section-container pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Image Container with Ambient Glow */}
          <div className="lg:col-span-7">
            <div
              ref={imgContainerRef}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-high aspect-square sm:aspect-[4/5] lg:aspect-square shadow-elevation border border-primary-container/25 cursor-crosshair group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMagnifier({ active: true, x, y });
              }}
              onMouseLeave={() => setMagnifier((prev) => ({ ...prev, active: false }))}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 img-placeholder" />
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Handcrafted Badge */}
              <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary-container/25 shadow-md text-xs font-bold text-on-surface flex items-center gap-1.5 z-10">
                <span>🧶</span>
                <span>Tejido 100% a Mano</span>
              </div>

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
                </div>
              )}
            </div>
          </div>

          {/* Info Card Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest to-surface-container-low/60 rounded-3xl border border-primary-container/25 p-6 sm:p-8 shadow-card space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>

              {/* Category & Title */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-secondary block mb-1">
                  Categoría: {product.category}
                </span>
                <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <StarRating rating={product.rating} reviews={product.reviews} />

              {/* Price Tag */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-primary-container/15">
                <span className="font-headline text-4xl sm:text-5xl font-extrabold text-secondary">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  USD (IVA incluido)
                </span>
              </div>

              {/* Description */}
              <p className="text-body-sm sm:text-body-md text-on-surface-variant font-body leading-relaxed">
                {product.description}
              </p>

              {/* Materials Banner */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-secondary-container/40 to-tertiary-container/30 rounded-2xl border border-secondary/20 shadow-sm">
                <span className="text-xl shrink-0">🧶</span>
                <span className="text-xs sm:text-sm text-secondary font-body font-bold">
                  Material: {product.materials}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-2.5 px-6 py-4 rounded-full font-body text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 shadow-button hover:shadow-elevation cursor-pointer ${
                    addedToCart
                      ? "bg-[#2e7d51] text-white"
                      : "bg-secondary text-white hover:bg-secondary/90"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <MdCheck className="text-lg flex-shrink-0" />
                      <span>¡Añadido a la Bolsa!</span>
                    </>
                  ) : (
                    <>
                      <MdShoppingBag className="text-lg flex-shrink-0" />
                      <span>Agregar a la Bolsa</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/50377311064?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-full font-body text-sm font-bold whitespace-nowrap bg-[#075e54] hover:bg-[#054f47] text-white transition-all duration-300 active:scale-95 shadow-button hover:shadow-elevation cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Pedir por WhatsApp</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col gap-2 pt-3 border-t border-primary-container/15">
                {trustItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-on-surface-variant text-xs font-semibold"
                  >
                    <span className="text-secondary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Info Cards Section ───────────────────────────── */}
      <ScrollReveal>
        <section className="section-container py-12 sm:py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Garantía Yamgurumi
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                Detalles & Especificaciones Técnicas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Materiales */}
              <div className="bg-gradient-to-b from-surface-container-lowest to-surface-container-low/50 rounded-3xl shadow-card border border-primary-container/25 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
                    <MdShield className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-bold text-on-surface">
                      Seguridad & Hipoalergénico
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Estándares artesanos de protección
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
                  {[
                    "100% Algodón orgánico suave y lavable a mano",
                    "Relleno hipoalergénico de alta densidad",
                    "Ojos de seguridad reforzados con trabas internas",
                    "Sin componentes tóxicos ni pintura desprendible",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dimensiones */}
              <div className="bg-gradient-to-b from-surface-container-lowest to-surface-container-low/50 rounded-3xl shadow-card border border-primary-container/25 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-tertiary/15 flex items-center justify-center text-tertiary">
                    <MdStraighten className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-bold text-on-surface">
                      Dimensiones & Peso
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Medidas estimadas de la pieza
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Altura", value: "18–25 cm", icon: "↕" },
                    { label: "Peso", value: "80–150 g", icon: "⚖" },
                    { label: "Base", value: "8–12 cm", icon: "⬡" },
                    { label: "Elaboración", value: "8–20 hrs", icon: "⏱" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-surface-container-lowest/80 rounded-2xl p-3 text-center border border-primary-container/20 shadow-sm"
                    >
                      <span className="text-base block mb-0.5">{item.icon}</span>
                      <span className="font-headline text-base font-bold text-on-surface block">
                        {item.value}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuidado */}
              <div className="bg-gradient-to-b from-surface-container-lowest to-surface-container-low/50 rounded-3xl shadow-card border border-primary-container/25 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-secondary">
                    <MdCleaningServices className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-bold text-on-surface">
                      Cuidado & Conservación
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Para mantener la forma impecable
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
                  {[
                    "Lavar a mano suavemente con jabón neutro",
                    "Secar a la sombra en superficie horizontal",
                    "Evitar exprimidoras o lavadoras centrífugas",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* La Artesana */}
              <div className="bg-gradient-to-b from-surface-container-lowest to-surface-container-low/50 rounded-3xl shadow-card border border-primary-container/25 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-tertiary-container/40 flex items-center justify-center text-tertiary">
                    <MdAutoStories className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-bold text-on-surface">
                      {makerStory.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      El toque artesanal
                    </p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  {makerStory.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Related Products Carousel ───────────────────── */}
      {related.length > 0 && (
        <ScrollReveal>
          <section className="section-container py-12 sm:py-16">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="text-center">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Recomendados para ti
                </span>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                  Amigurumis Relacionados
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {related.slice(0, 4).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </main>
  );
}

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}
