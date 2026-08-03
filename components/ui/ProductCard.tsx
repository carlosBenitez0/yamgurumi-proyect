'use client'

import { memo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart, MdCheck } from "react-icons/md";
import type { Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";

/* ── Tag color map ──────────────────────────────────────── */

const tagColors: Record<string, string> = {
  "Best Seller": "bg-secondary text-on-secondary",
  "Nuevo": "bg-tertiary text-on-tertiary",
  "Popular": "bg-secondary-container text-on-secondary-container",
  "Limitado": "bg-primary text-on-primary",
  "Favorito": "bg-tertiary-container text-on-tertiary-container",
  "Edición Especial": "bg-tertiary text-on-tertiary",
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
      <span className="text-on-surface-variant text-[10px] sm:text-[12px] font-body">
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
  /** Tamaño del card: 'default' (p-4, usado en catálogo), 'compact' (p-3, slider) */
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
    onToggleFavorite?.(product.id);
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
      className={`absolute top-3 left-3 badge-pill font-bold shadow-sm ${
        isCompact
          ? "text-[12px] px-3 py-1"
          : "text-[10px] px-2 py-0.5 sm:text-[12px] sm:px-3 sm:py-1"
      } ${tagColors[product.tags[0]] || "bg-surface-container text-on-surface"}`}
    >
      {product.tags[0]}
    </span>
  );

  // Offsets absolutos de los botones overlay relativos al wrapper
  // default: mobile p-3 (12px imagen + 12px = 24px) → sm p-4 (12px + 16px = 28px)
  // compact (slider): siempre p-3 → 24px
  const favOffset = isCompact ? "top-6 right-6" : "top-[22px] right-[22px] sm:top-7 sm:right-7";
  const cartOffset = isCompact ? "bottom-3 right-3" : "bottom-[10px] right-[10px] sm:bottom-4 sm:right-4";

  const revealClass =
    revealDelay > 0
      ? `reveal ${revealDelay <= 5 ? `reveal-delay-${revealDelay}` : "reveal-delay-5"}`
      : "";

  return (
    <div className={`relative h-full group group/card ${revealClass}`}>
      {/* Stretched link — cubre toda la card, por debajo de los botones overlay */}
      <Link
        href={`/producto/${product.slug}`}
        className="absolute inset-0 z-10 rounded-3xl"
        aria-label={`Ver detalles de ${product.name}`}
      />

      <article
        className={`bg-surface-container-lowest rounded-3xl border border-primary-container/20 flex flex-col transition-all duration-300 h-full ${
          isCompact
            ? "p-3 hover:shadow-elevation hover:-translate-y-1.5"
            : "p-2.5 sm:p-4 shadow-card hover:shadow-elevation hover:-translate-y-1.5"
        }`}
      >
        {/* Image */}
        <div className={`relative rounded-2xl overflow-hidden aspect-square bg-surface-container ${isCompact ? "mb-3" : "mb-2 sm:mb-3"}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={isCompact ? "(min-width: 640px) 280px, 200px" : "(min-width: 1024px) 280px, 50vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {TagBadge}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5 flex-1 px-1">
          <h3
            className={`font-headline text-on-surface font-semibold leading-tight group-hover:text-secondary transition-colors ${
              isCompact ? "text-sm" : "text-[13px] sm:text-headline-sm"
            }`}
          >
            {product.name}
          </h3>
          <p className={`text-on-surface-variant font-body leading-tight ${isCompact ? "text-body-sm" : "text-[11px] sm:text-body-sm"}`}>
            {product.materials}
          </p>
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        {/* Footer — precio; el botón de carrito es overlay */}
        <div className={`border-t border-outline-variant/15 flex items-center justify-between px-1 ${isCompact ? "mt-3 pt-3" : "mt-2 pt-2 sm:mt-3 sm:pt-3"}`}>
          <span className="font-bold font-headline text-[15px] sm:text-headline-md text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </article>

      {/* Fav button — overlay por encima del stretched link */}
      <button
        onClick={handleFav}
        className={`absolute ${favOffset} z-20 ${isCompact ? "w-11 h-11" : "w-9 h-9 sm:w-11 sm:h-11"} flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
          isFavorite
            ? "bg-tertiary text-on-tertiary"
            : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
        }`}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {isFavorite ? (
          <MdFavorite className="text-lg sm:text-[20px]" />
        ) : (
          <MdFavoriteBorder className="text-lg sm:text-[20px]" />
        )}
      </button>

      {/* Cart button — overlay por encima del stretched link */}
      <button
        onClick={handleCart}
        className={`absolute ${cartOffset} z-20 bg-secondary text-on-secondary ${
          isCompact
            ? "px-4 min-h-[44px]"
            : "px-2.5 sm:px-4 min-h-[36px] sm:min-h-[44px]"
        } rounded-full flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold tactile-press transition-all shadow-button ${
          justAdded ? "bg-[#3a9d62] hover:bg-[#3a9d62]" : "hover:bg-secondary/90"
        }`}
        aria-label={`Agregar ${product.name} a la bolsa`}
      >
        {justAdded ? (
          <>
            <MdCheck className="text-base sm:text-[18px]" />
            <span aria-live="polite">¡Añadido!</span>
          </>
        ) : (
          <>
            <MdAddShoppingCart className="text-base sm:text-[18px]" />
            <span>Añadir</span>
          </>
        )}
      </button>
    </div>
  );
});

export default ProductCard;