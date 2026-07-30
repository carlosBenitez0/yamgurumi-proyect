'use client'

import { memo } from "react";
import Link from "next/link";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart } from "react-icons/md";
import type { Product } from "@/data/products";

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
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex items-center gap-0.5 text-[#D4A843]">
        {Array.from({ length: 5 }).map((_, i) =>
          i < full ? (
            <MdStar key={i} className="text-[14px]" />
          ) : (
            <MdStarBorder key={i} className="text-[14px]" />
          )
        )}
      </div>
      <span className="text-on-surface-variant text-[12px] font-body">
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

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const TagBadge = product.tags[0] && (
    <span
      className={`absolute top-3 left-3 badge-pill text-[12px] font-bold px-3 py-1 shadow-sm ${
        tagColors[product.tags[0]] || "bg-surface-container text-on-surface"
      }`}
    >
      {product.tags[0]}
    </span>
  );

  const FavButton = (
    <button
      onClick={handleFav}
      className={`absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
        isFavorite
          ? "bg-tertiary text-on-tertiary"
          : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
      }`}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? (
        <MdFavorite className="text-[20px]" />
      ) : (
        <MdFavoriteBorder className="text-[20px]" />
      )}
    </button>
  );

  const cardContent = (
    <article
      className={`group bg-surface-container-lowest rounded-3xl border border-primary-container/20 flex flex-col transition-all duration-300 h-full ${
        isCompact
          ? "p-3 hover:shadow-elevation hover:-translate-y-1.5"
          : "p-4 shadow-card hover:shadow-elevation hover:-translate-y-1.5"
      }`}
    >
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden mb-3 aspect-square bg-surface-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {TagBadge}
        {FavButton}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 flex-1 px-1">
        <h3
          className={`font-headline text-on-surface font-semibold leading-tight group-hover:text-secondary transition-colors ${
            isCompact ? "text-sm" : "text-headline-sm"
          }`}
        >
          {product.name}
        </h3>
        <p className="text-on-surface-variant text-body-sm font-body leading-tight">
          {product.materials}
        </p>
        <StarRating rating={product.rating} reviews={product.reviews} />
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-outline-variant/15 flex items-center justify-between px-1">
        <span className="font-bold font-headline text-headline-md text-primary">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={handleCart}
          className="bg-secondary text-on-secondary px-4 min-h-[44px] rounded-full flex items-center gap-2 text-xs font-bold tactile-press transition-all shadow-button hover:bg-secondary/90"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <MdAddShoppingCart className="text-[18px]" />
          <span>Añadir</span>
        </button>
      </div>
    </article>
  );

  if (revealDelay > 0) {
    const delayClass =
      revealDelay <= 5 ? `reveal-delay-${revealDelay}` : "reveal-delay-5";
    return (
      <Link href={`/producto/${product.slug}`} className="block h-full group/card">
        <div className={`reveal ${delayClass}`}>{cardContent}</div>
      </Link>
    );
  }

  return (
    <Link href={`/producto/${product.slug}`} className="block h-full group/card">
      {cardContent}
    </Link>
  );
});

export default ProductCard;
