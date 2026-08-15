'use client'

import { memo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart, MdCheck } from "react-icons/md";
import type { Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { useFavoritesStore } from "@/src/store/useFavoritesStore";

/* ── Tag color map ──────────────────────────────────────── */

const tagColors: Record<string, string> = {
  "Best Seller": "bg-secondary text-on-secondary shadow-sm",
  "Nuevo": "bg-tertiary text-on-tertiary shadow-sm",
  "Popular": "bg-secondary-container text-on-secondary-container",
  "Limitado": "bg-primary text-on-primary shadow-sm",
  "Favorito": "bg-tertiary-container text-on-tertiary-container",
  "Edición Especial": "bg-tertiary text-on-tertiary shadow-sm",
};

/* ── Star Rating ────────────────────────────────────────── */

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 mt-0.5 sm:gap-1.5 sm:mt-1">
      <div className="flex items-center gap-0.5 text-star">
        {Array.from({ length: 5 }).map((_, i) =>
          i < full ? (
            <MdStar key={i} className="text-[12px] sm:text-[14px]" />
          ) : (
            <MdStarBorder key={i} className="text-[12px] sm:text-[14px]" />
          )
        )}
      </div>
      <span className="text-on-surface-variant/80 text-[10px] sm:text-[12px] font-body font-medium">
        {rating} ({reviews})
      </span>
    </div>
  );
}

/* ── Props ──────────────────────────────────────────────── */

export interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  /** Tamaño del card: 'default' (usado en catálogo), 'compact' (slider) */
  size?: "default" | "compact";
  /** Retraso para scroll reveal (0 = sin retraso) */
  revealDelay?: number;
}

/* ── Component ──────────────────────────────────────────── */

const ProductCard = memo(function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  size = "default",
  revealDelay = 0,
}: ProductCardProps) {
  const isCompact = size === "compact";
  const addItem = useCartStore((s) => s.addItem);
  const storeIsFav = useFavoritesStore((s) => s.favoritesMap[product.id] || s.favoritesMap[product.slug]);
  const storeToggleFav = useFavoritesStore((s) => s.toggleFavorite);
  const effectiveIsFavorite = isFavorite || !!storeIsFav;

  const [justAdded, setJustAdded] = useState(false);
  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addTimer.current) clearTimeout(addTimer.current);
    },
    [],
  );

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
    storeToggleFav(product.id);
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    } else {
      addItem(product);
    }
    setJustAdded(true);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setJustAdded(false), 1200);
  };

  const TagBadge = product.tags[0] && (
    <span
      className={`absolute top-3 left-3 badge-pill font-bold ${
        isCompact
          ? "text-[11px] px-2.5 py-0.5"
          : "text-[10px] px-2.5 py-0.5 sm:text-[11px] sm:px-3 sm:py-1"
      } ${tagColors[product.tags[0]] || "bg-surface-container-lowest/90 backdrop-blur-md text-on-surface border border-primary-container/20"}`}
    >
      {product.tags[0]}
    </span>
  );

  const favOffset = isCompact ? "top-3 right-3" : "top-3 right-3 sm:top-3.5 sm:right-3.5";
  const cartOffset = isCompact ? "bottom-3 right-3" : "bottom-3 right-3 sm:bottom-3.5 sm:right-3.5";

  const revealClass =
    revealDelay > 0
      ? `reveal ${revealDelay <= 5 ? `reveal-delay-${revealDelay}` : "reveal-delay-5"}`
      : "";

  return (
    <div className={`relative h-full group group/card ${revealClass}`}>
      {/* Stretched link — cubre toda la card */}
      <Link
        href={`/producto/${product.slug}`}
        className="absolute inset-0 z-10 rounded-3xl"
        aria-label={`Ver detalles de ${product.name}`}
      />

      <article
        className={`bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest to-surface-container-low/50 rounded-3xl border border-primary-container/25 flex flex-col justify-between transition-all duration-300 h-full relative overflow-hidden ${
          isCompact
            ? "p-3 hover:shadow-elevation hover:-translate-y-1.5"
            : "p-3 sm:p-4 shadow-card hover:shadow-elevation hover:-translate-y-1.5"
        }`}
      >
        {/* Glow de fondo ambiental al pasar cursor */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

        <div>
          {/* Contenedor de Imagen */}
          <div className={`relative rounded-2xl overflow-hidden aspect-square bg-surface-container shadow-inner border border-primary-container/20 ${isCompact ? "mb-3" : "mb-2.5 sm:mb-3.5"}`}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes={isCompact ? "(min-width: 640px) 280px, 200px" : "(min-width: 1024px) 280px, 50vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />
            {TagBadge}

            {/* Insignia Artesanal abajo a la izquierda */}
            <div className="absolute bottom-2.5 left-2.5 bg-surface-container-lowest/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-primary-container/20 shadow-sm text-[10px] font-bold text-on-surface hidden sm:flex items-center gap-1">
              <span>🧶</span>
              <span>Artesanal</span>
            </div>
          </div>

          {/* Info del Producto */}
          <div className="flex flex-col gap-1 px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary">
              {product.category}
            </span>
            <h3
              className={`font-headline text-on-surface font-bold leading-snug group-hover:text-secondary transition-colors line-clamp-1 ${
                isCompact ? "text-sm" : "text-[14px] sm:text-headline-sm"
              }`}
            >
              {product.name}
            </h3>
            <p className={`text-on-surface-variant font-body leading-tight line-clamp-1 ${isCompact ? "text-[11px]" : "text-[11px] sm:text-body-sm"}`}>
              {product.materials}
            </p>
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
        </div>

        {/* Footer — Precio & Botón */}
        <div className={`border-t border-primary-container/15 flex items-center justify-between px-1 ${isCompact ? "mt-3 pt-3" : "mt-3 pt-3"}`}>
          <div>
            <span className="text-[9px] font-extrabold text-on-surface-variant uppercase tracking-wider block">
              Precio
            </span>
            <span className="font-bold font-headline text-[15px] sm:text-headline-md text-secondary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </article>

      {/* Botón Favorito — Overlay */}
      <button
        onClick={handleFav}
        className={`absolute ${favOffset} z-20 ${isCompact ? "w-9 h-9" : "w-9 h-9 sm:w-10 sm:h-10"} flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all tactile-press active:scale-90 shadow-md ${
          effectiveIsFavorite
            ? "text-tertiary hover:bg-tertiary hover:text-white"
            : "text-on-surface-variant/70 hover:text-tertiary hover:bg-tertiary/10"
        }`}
        aria-label={effectiveIsFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {effectiveIsFavorite ? (
          <MdFavorite className="text-lg sm:text-[20px]" />
        ) : (
          <MdFavoriteBorder className="text-lg sm:text-[20px]" />
        )}
      </button>

      {/* Botón Carrito — Overlay */}
      <button
        onClick={handleCart}
        className={`absolute ${cartOffset} z-20 bg-secondary text-white ${
          isCompact
            ? "px-3 py-2 text-xs"
            : "px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs"
        } rounded-full flex items-center gap-1.5 font-bold tactile-press transition-all shadow-button active:scale-95 ${
          justAdded ? "bg-[#2e7d51] hover:bg-[#2e7d51]" : "hover:bg-secondary/90"
        }`}
        aria-label={`Agregar ${product.name} a la bolsa`}
      >
        {justAdded ? (
          <>
            <MdCheck className="text-base sm:text-lg" />
            <span aria-live="polite">Añadido</span>
          </>
        ) : (
          <>
            <MdAddShoppingCart className="text-base sm:text-lg" />
            <span>Añadir</span>
          </>
        )}
      </button>
    </div>
  );
});

export default ProductCard;