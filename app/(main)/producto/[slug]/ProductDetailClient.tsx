"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ui/ProductCard";
import { type Product } from "@/data/products";
import { useCartStore, type BaseType, BASE_OPTIONS_INFO } from "@/lib/cart-store";
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
  MdArrowForward,
  MdChevronLeft,
  MdChevronRight,
  MdZoomIn,
  MdClose,
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
          <MdStar
            key={`e${i}`}
            className="text-outline-variant/40 text-[18px]"
          />
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
    Infantil:
      "bg-secondary-container text-secondary border border-secondary/30",
    Seguro: "bg-secondary-container text-secondary border border-secondary/30",
    Navideño: "bg-tertiary/10 text-tertiary border border-tertiary/30",
    Temporada: "bg-tertiary/10 text-tertiary border border-tertiary/30",
    Decoración:
      "bg-primary-container/40 text-on-primary-container border border-primary-container/30",
    Hogar:
      "bg-primary-container/40 text-on-primary-container border border-primary-container/30",
    Llaveros:
      "bg-secondary-container text-secondary border border-secondary/30",
    Accesorios:
      "bg-secondary-container text-secondary border border-secondary/30",
    Bebé: "bg-tertiary/15 text-tertiary border border-tertiary/30",
  };

  return (
    <span
      className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
        colorMap[tag] ||
        "bg-surface-container-lowest text-on-surface-variant border border-primary-container/25"
      }`}
    >
      {tag}
    </span>
  );
}

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
  whatsappTemplates?: Record<string, string>;
}

export default function ProductDetailClient({
  product,
  related,
  whatsappTemplates,
}: ProductDetailClientProps) {
  const [baseOption, setBaseOption] = useState<BaseType>("none");
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [magnifier, setMagnifier] = useState({ active: false, x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const baseExtra = BASE_OPTIONS_INFO[baseOption].price;
  const effectivePrice = product.price + baseExtra;

  const galleryImages = useMemo(() => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls;
    }
    return [product.imageUrl];
  }, [product]);

  const currentImage = galleryImages[activeImgIndex] || product.imageUrl;

  const mainImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (mainImgRef.current && mainImgRef.current.complete) {
      setImageLoaded(true);
    }
  }, [currentImage]);

  const handlePrevImage = useCallback(() => {
    setActiveImgIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
    setImageLoaded(false);
  }, [galleryImages.length]);

  const handleNextImage = useCallback(() => {
    setActiveImgIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
    setImageLoaded(false);
  }, [galleryImages.length]);

  // Teclado para navegar en Lightbox / Pantalla Completa
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrevImage, handleNextImage]);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const whatsappMessage = useMemo(() => {
    const baseLabel = BASE_OPTIONS_INFO[baseOption].label;
    const productNameWithBase = baseOption !== 'none' ? `${product.name} (${baseLabel})` : product.name;

    const defaultMsg = `¡Hola Yamgurumi Studio! 🧶\n\nEstoy interesado en adquirir el amigurumi *${productNameWithBase}* ($${effectivePrice.toFixed(2)} USD).\n\n¿Tienen disponibilidad inmediata para envío en El Salvador? ¡Gracias!`;
    const templateText = whatsappTemplates?.wa_tpl_product_buy || defaultMsg;

    const interpolated = templateText
      .replaceAll('{producto}', productNameWithBase)
      .replaceAll('{precio}', effectivePrice.toFixed(2))
      .replaceAll('{dias_elaboracion}', product.craftingDays || 'Entrega Inmediata ⚡');

    return encodeURIComponent(interpolated);
  }, [product, baseOption, effectivePrice, whatsappTemplates]);

  /* Mensaje para cuando no hay stock: la artesana lo teje bajo encargo. */
  const madeToOrderMessage = useMemo(() => {
    const baseLabel = BASE_OPTIONS_INFO[baseOption].label;
    const productNameWithBase = baseOption !== 'none' ? `${product.name} (${baseLabel})` : product.name;

    const defaultMsg = `¡Hola Yamgurumi Studio! 🧶\n\nQuisiera encargar la fabricación del amigurumi *${productNameWithBase}* ($${effectivePrice.toFixed(2)} USD).\n\nSé que actualmente no hay piezas disponibles y que la artesana lo tejerá especialmente para mí. ¿Cuál sería el tiempo estimado de elaboración y entrega? ¡Gracias!`;
    const templateText = whatsappTemplates?.wa_tpl_product_custom || defaultMsg;

    const interpolated = templateText
      .replaceAll('{producto}', productNameWithBase)
      .replaceAll('{precio}', effectivePrice.toFixed(2))
      .replaceAll('{dias_elaboracion}', product.craftingDays || '5-10 días hábiles');

    return encodeURIComponent(interpolated);
  }, [product, baseOption, effectivePrice, whatsappTemplates]);

  /* Disponibilidad: stock === undefined → producto estático (fallback),
   * se comporta como disponible. stock === 0 → solo bajo encargo. */
  const stock = typeof product.stock === "number" ? product.stock : null;
  const isOutOfStock = stock !== null && stock <= 0;
  const isLowStock = stock !== null && stock > 0 && stock <= 3;

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
    addItem(product, 1, baseOption);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addItem, product, baseOption]);

  const makerStory = {
    title: "Artesanía Salvadoreña",
    content:
      "Cada amigurumi es creado por una artesana en San Salvador que ha perfeccionado la técnica del tejido a crochet. Con paciencia y dedicación, cada pieza toma entre 8 y 20 horas de trabajo continuo punto a punto.",
  };

  const trustItems = [
    {
      icon: <MdLocalShipping className="text-[20px]" />,
      label: "Envíos directos a todo El Salvador 🇸🇻",
    },
    {
      icon: <MdShield className="text-[20px]" />,
      label: "100% Algodón orgánico e hipoalergénico",
    },
    {
      icon: <MdHandshake className="text-[20px]" />,
      label: "Hecho a mano con amor y cuidado",
    },
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
          {/* Image Container with Thumbnails Column on the Left */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-stretch">
            {/* Tira de Miniaturas a la Izquierda (Alineada al alto exacto de la imagen principal en desktop) */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col items-center justify-start sm:justify-between gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-hidden p-1 shrink-0 w-full sm:w-22 lg:w-24 sm:self-stretch scrollbar-none">
                {galleryImages.slice(0, 6).map((img, idx) => {
                  const isActive = idx === activeImgIndex;
                  const isLastVisible = idx === 5 && galleryImages.length > 6;
                  const extraCount = galleryImages.length - 5;

                  if (isLastVisible) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLightboxOpen(true);
                        }}
                        className="relative w-14 h-14 sm:w-full sm:h-auto sm:flex-1 min-h-0 aspect-square rounded-2xl overflow-hidden shrink-0 border border-primary-container/30 transition-all duration-300 hover:scale-105 group cursor-pointer shadow-sm"
                        title={`Ver todas las ${galleryImages.length} fotos`}
                      >
                        <img
                          src={img}
                          alt="Ver más fotografías"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80";
                          }}
                          className="w-full h-full object-cover filter blur-[1px] group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-1">
                          <span className="font-headline font-extrabold text-xs sm:text-sm text-amber-300">
                            +{extraCount}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-200">
                            Ver todas
                          </span>
                        </div>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImgIndex(idx);
                        setImageLoaded(false);
                      }}
                      className={`relative w-14 h-14 sm:w-full sm:h-auto sm:flex-1 min-h-0 aspect-square rounded-2xl overflow-hidden shrink-0 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-2 border-secondary ring-2 sm:ring-4 ring-secondary/25 scale-105 shadow-md"
                          : "border border-primary-container/30 opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} miniatura ${idx + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80";
                        }}
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-secondary/10 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Imagen Principal */}
            <div
              ref={imgContainerRef}
              className="relative flex-1 w-full rounded-3xl overflow-hidden bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-high aspect-square sm:aspect-[4/5] lg:aspect-square shadow-elevation border border-primary-container/25 cursor-zoom-in group select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMagnifier({ active: true, x, y });
              }}
              onMouseLeave={() =>
                setMagnifier((prev) => ({ ...prev, active: false }))
              }
              onClick={() => setIsLightboxOpen(true)}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 img-placeholder" />
              )}
              <img
                ref={mainImgRef}
                key={currentImage}
                src={currentImage}
                alt={`${product.name} - Fotografía ${activeImgIndex + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80";
                  setImageLoaded(true);
                }}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded
                    ? "opacity-100 group-hover:scale-105"
                    : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Handcrafted Badge (z-30 sobre la lupa z-20) */}
              <div
                onMouseEnter={() =>
                  setMagnifier((prev) => ({ ...prev, active: false }))
                }
                className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary-container/25 shadow-md text-xs font-bold text-on-surface flex items-center gap-1.5 z-30"
              >
                <span>🧶</span>
                <span>Tejido 100% a Mano</span>
              </div>

              {/* Counter Badge & Fullscreen Button (z-30 sobre la lupa z-20) */}
              <div
                onMouseEnter={() =>
                  setMagnifier((prev) => ({ ...prev, active: false }))
                }
                className="absolute top-4 right-4 flex items-center gap-2 z-30"
              >
                {galleryImages.length > 1 && (
                  <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full border border-primary-container/25 shadow-sm text-xs font-extrabold text-on-surface">
                    {activeImgIndex + 1} / {galleryImages.length}
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMagnifier((prev) => ({ ...prev, active: false }));
                    setIsLightboxOpen(true);
                  }}
                  className="w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-primary-container/25 shadow-md text-on-surface hover:text-secondary hover:scale-110 flex items-center justify-center transition-all cursor-pointer"
                  title="Ver en pantalla completa y detalles"
                >
                  <MdZoomIn className="text-xl" />
                </button>
              </div>

              {/* Navigation Arrows for Main Image (z-30 sobre la lupa z-20) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onMouseEnter={() =>
                      setMagnifier((prev) => ({ ...prev, active: false }))
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setMagnifier((prev) => ({ ...prev, active: false }));
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-primary-container/25 text-on-surface hover:text-secondary hover:scale-110 hover:bg-surface-container-lowest flex items-center justify-center transition-all shadow-md z-30 opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="Foto anterior"
                  >
                    <MdChevronLeft className="text-2xl" />
                  </button>

                  <button
                    type="button"
                    onMouseEnter={() =>
                      setMagnifier((prev) => ({ ...prev, active: false }))
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setMagnifier((prev) => ({ ...prev, active: false }));
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-primary-container/25 text-on-surface hover:text-secondary hover:scale-110 hover:bg-surface-container-lowest flex items-center justify-center transition-all shadow-md z-30 opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="Foto siguiente"
                  >
                    <MdChevronRight className="text-2xl" />
                  </button>
                </>
              )}

              {/* Magnifier lens (z-20) */}
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
                    style={{
                      width: magnifierStyle.lensSize,
                      height: magnifierStyle.lensSize,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${currentImage})`,
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
                  ${effectivePrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  USD {baseExtra > 0 ? `(+$${baseExtra.toFixed(2)} base)` : "(IVA incluido)"}
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

              {/* Stock Availability */}
              {stock !== null && (
                <div
                  className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-sm ${
                    isOutOfStock
                      ? "bg-gradient-to-r from-tertiary-container/25 to-primary-container/20 border-tertiary/25"
                      : isLowStock
                        ? "bg-gradient-to-r from-[#e6a817]/10 to-tertiary-container/20 border-[#e6a817]/30"
                        : "bg-gradient-to-r from-[#2e7d51]/10 to-secondary-container/30 border-[#2e7d51]/25"
                  }`}
                >
                  <span className="relative flex h-3 w-3 shrink-0 mt-1">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${
                        isOutOfStock
                          ? "bg-tertiary"
                          : isLowStock
                            ? "bg-[#e6a817]"
                            : "bg-[#2e7d51]"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        isOutOfStock
                          ? "bg-tertiary"
                          : isLowStock
                            ? "bg-[#e6a817]"
                            : "bg-[#2e7d51]"
                      }`}
                    />
                  </span>
                  <div className="min-w-0">
                    {isOutOfStock ? (
                      <>
                        <span className="block text-sm font-body font-extrabold text-tertiary">
                          Agotado por ahora
                        </span>
                        <span className="block text-xs text-on-surface-variant font-medium leading-snug mt-0.5">
                          Se teje bajo encargo: la artesana lo creará
                          especialmente para ti (aprox. {product.craftingDays || "5–10 días hábiles"}).
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`block text-sm font-body font-extrabold ${
                            isLowStock ? "text-[#9c6f10]" : "text-[#2e7d51]"
                          }`}
                        >
                          {stock === 1
                            ? "¡Solo queda 1 pieza!"
                            : isLowStock
                              ? `¡Solo quedan ${stock} piezas!`
                              : `${stock} piezas disponibles`}
                        </span>
                        <span className="block text-xs text-on-surface-variant font-medium leading-snug mt-0.5">
                          {isLowStock
                            ? "Venta inmediata — aparta la tuya antes de que se agote."
                            : "Venta inmediata — listo para envío."}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Selector de Base de Exhibición */}
              <div className="space-y-2.5 pt-3 border-t border-primary-container/15">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-on-surface flex items-center gap-1.5 font-label min-w-0 truncate">
                    <span>🪵</span>
                    <span className="truncate">Base de Exhibición</span>
                  </span>
                  <span className="text-[11px] text-secondary font-bold bg-secondary-container/30 px-2.5 py-0.5 rounded-full border border-secondary/20 whitespace-nowrap shrink-0">
                    {BASE_OPTIONS_INFO[baseOption].shortLabel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Sin Base */}
                  <button
                    type="button"
                    onClick={() => setBaseOption("none")}
                    className={`relative p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      baseOption === "none"
                        ? "bg-secondary-container/40 border-secondary ring-2 ring-secondary/25 shadow-sm"
                        : "bg-surface-container-lowest border-primary-container/30 hover:border-secondary/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="font-headline font-bold text-xs sm:text-sm text-on-surface whitespace-nowrap truncate">
                        Sin Base
                      </span>
                      {baseOption === "none" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-secondary text-white flex items-center justify-center text-[9px] font-bold shadow-sm shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-on-surface-variant font-extrabold whitespace-nowrap">
                      +$0.00
                    </span>
                  </button>

                  {/* Base Normal */}
                  <button
                    type="button"
                    onClick={() => setBaseOption("standard")}
                    className={`relative p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      baseOption === "standard"
                        ? "bg-secondary-container/40 border-secondary ring-2 ring-secondary/25 shadow-sm"
                        : "bg-surface-container-lowest border-primary-container/30 hover:border-secondary/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="font-headline font-bold text-xs sm:text-sm text-on-surface whitespace-nowrap truncate">
                        Normal 🪵
                      </span>
                      {baseOption === "standard" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-secondary text-white flex items-center justify-center text-[9px] font-bold shadow-sm shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-secondary font-extrabold whitespace-nowrap">
                      +$1.00 USD
                    </span>
                  </button>

                  {/* Base Grande */}
                  <button
                    type="button"
                    onClick={() => setBaseOption("large")}
                    className={`relative p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      baseOption === "large"
                        ? "bg-secondary-container/40 border-secondary ring-2 ring-secondary/25 shadow-sm"
                        : "bg-surface-container-lowest border-primary-container/30 hover:border-secondary/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="font-headline font-bold text-xs sm:text-sm text-on-surface whitespace-nowrap truncate">
                        Grande 🪵
                      </span>
                      {baseOption === "large" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-secondary text-white flex items-center justify-center text-[9px] font-bold shadow-sm shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-secondary font-extrabold whitespace-nowrap">
                      +$1.50 USD
                    </span>
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              {isOutOfStock ? (
                /* ── Sin stock: encargo de fabricación (motor del negocio) ── */
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://api.whatsapp.com/send?phone=50377311064&text=${madeToOrderMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex-1 min-w-0 inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border border-whatsapp/30 bg-whatsapp px-6 py-4 font-body text-sm font-bold text-white cta-glow-pulse will-change-transform transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-whatsapp-hover active:translate-y-0 active:scale-[0.97] focus-ring cursor-pointer"
                      aria-label={`Encargar la fabricación de ${product.name} por WhatsApp`}
                    >
                      <span
                        aria-hidden="true"
                        className="cta-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      />
                      <span className="flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[10deg] group-hover:scale-110">
                        <MdAutoAwesome className="h-5 w-5 animate-pulse-whatsapp" />
                      </span>
                      <span className="relative">Pedir que me lo tejan</span>
                      <MdArrowForward
                        aria-hidden="true"
                        className="-ml-1 w-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-0 group-hover:w-5 group-hover:opacity-100"
                      />
                    </a>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-5 py-4 rounded-full font-body text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 border border-tertiary/30 cursor-pointer ${
                        addedToCart
                          ? "bg-[#2e7d51] text-white"
                          : "bg-tertiary-container/30 text-tertiary hover:bg-tertiary-container/60"
                      }`}
                    >
                      {addedToCart ? (
                        <>
                          <MdCheck className="text-lg flex-shrink-0" />
                          <span>¡Añadido (Bajo Encargo)!</span>
                        </>
                      ) : (
                        <>
                          <MdShoppingBag className="text-lg flex-shrink-0 text-tertiary" />
                          <span>Agregar a Bolsa (Encargo)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-[11px] text-on-surface-variant/80 font-medium leading-snug">
                    Sin compromiso — coordinas detalles, precio y tiempo de
                    entrega directamente con la artesana por WhatsApp o desde tu bolsa.
                  </p>
                </div>
              ) : (
                /* ── Con stock: venta inmediata ── */
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
                    href={`https://api.whatsapp.com/send?phone=50377311064&text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-full font-body text-sm font-bold whitespace-nowrap bg-[#075e54] hover:bg-[#054f47] text-white transition-all duration-300 active:scale-95 shadow-button hover:shadow-elevation cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 flex-shrink-0"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Pedir por WhatsApp</span>
                  </a>
                </div>
              )}

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
                      <span className="text-base block mb-0.5">
                        {item.icon}
                      </span>
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

      {/* ── Modal de Galería de Imágenes (Pop-up Estándar E-Commerce) ───────────── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Tarjeta Modal Centrada */}
          <div
            className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-surface-container-lowest border border-primary-container/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-surface-container-low to-surface-container-lowest border-b border-primary-container/20 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="text-base sm:text-xl shrink-0">🧶</span>
                <h3 className="font-headline font-bold text-xs xs:text-sm sm:text-lg text-on-surface leading-tight truncate">
                  Galería — {product.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-primary-container/40 text-primary font-headline font-extrabold text-[11px] sm:text-xs px-2.5 py-1 rounded-full border border-primary-container/30 whitespace-nowrap shrink-0">
                  {activeImgIndex + 1} de {galleryImages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container-high hover:bg-secondary hover:text-white text-on-surface flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Cerrar (Esc)"
                >
                  <MdClose className="text-base sm:text-xl" />
                </button>
              </div>
            </div>

            {/* Cuerpo del Modal: Imagen Principal + Tira de Miniaturas */}
            <div className="p-3 sm:p-6 overflow-y-auto flex flex-col items-center justify-between space-y-3 sm:space-y-5 bg-gradient-to-b from-surface-container-lowest to-surface-container-low/30 flex-1">
              {/* Visor de Imagen Principal */}
              <div className="relative w-full h-[280px] xs:h-[330px] sm:h-[440px] bg-surface-container-lowest/90 rounded-2xl border border-primary-container/20 flex items-center justify-center overflow-hidden p-2 sm:p-3 shadow-inner">
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.name} vista ampliada`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80";
                  }}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-md transition-all duration-300"
                />

                {/* Flechas de Navegación */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-primary-container/30 text-on-surface hover:text-secondary hover:scale-110 shadow-md flex items-center justify-center transition-all cursor-pointer"
                      title="Foto anterior"
                    >
                      <MdChevronLeft className="text-xl sm:text-2xl" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-primary-container/30 text-on-surface hover:text-secondary hover:scale-110 shadow-md flex items-center justify-center transition-all cursor-pointer"
                      title="Foto siguiente"
                    >
                      <MdChevronRight className="text-xl sm:text-2xl" />
                    </button>
                  </>
                )}
              </div>

              {/* Tira de Miniaturas */}
              {galleryImages.length > 1 && (
                <div className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto py-2 px-4 sm:px-2 w-full scrollbar-none shrink-0">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        setActiveImgIndex(idx);
                        setImageLoaded(false);
                        e.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }}
                      className={`w-13 h-13 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                        idx === activeImgIndex
                          ? "border-2 border-secondary ring-2 sm:ring-4 ring-secondary/20 scale-105 shadow-md"
                          : "border border-primary-container/30 opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}
