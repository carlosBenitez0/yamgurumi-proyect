'use client'

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart, MdCheck } from "react-icons/md";
import type { Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";

interface Props {
  category: string;
  icon: string;
  products: Product[];
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 mt-0.5 sm:gap-1.5 sm:mt-1">
      <div className="flex items-center gap-0.5 text-[#D4A843]">
        {Array.from({ length: 5 }).map((_, i) => (
          i < full ? (
            <MdStar key={i} className="text-[12px] sm:text-[14px]" />
          ) : (
            <MdStarBorder key={i} className="text-[12px] sm:text-[14px]" />
          )
        ))}
      </div>
      <span className="text-on-surface-variant text-[10px] sm:text-[12px] font-body">
        {rating} ({reviews})
      </span>
    </div>
  );
}

const tagColors: Record<string, string> = {
  "Best Seller": "bg-secondary text-on-secondary",
  "Nuevo": "bg-tertiary text-on-tertiary",
  "Popular": "bg-secondary-container text-on-secondary-container",
  "Limitado": "bg-primary text-on-primary",
  "Favorito": "bg-tertiary-container text-on-tertiary-container",
  "Edición Especial": "bg-tertiary text-on-tertiary",
};

export default function CategoryClient({ category, icon, products }: Props) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const toggleFav = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm font-body text-on-surface-variant/60 mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/#tienda" className="hover:text-secondary transition-colors">
              Tienda
            </Link>
            <span>/</span>
            <span className="text-on-surface">{category}</span>
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-5xl mb-4 block">{icon}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-on-surface mb-3">
              {category}
            </h1>
            <p className="text-on-surface-variant font-body text-body-lg max-w-md mx-auto">
              {products.length} {products.length === 1 ? "producto" : "productos"} tejidos a mano con amor
            </p>
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i + 1, 6)}>
                <Link href={`/producto/${product.slug}`} className="block h-full">
                  <article className="group bg-surface-container-lowest rounded-3xl p-2.5 sm:p-4 shadow-card hover:shadow-elevation border border-primary-container/20 flex flex-col transition-all duration-300 hover:-translate-y-1.5 h-full">
                    <div className="relative rounded-2xl overflow-hidden mb-2 sm:mb-3 aspect-square bg-surface-container img-placeholder">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.tags[0] && (
                        <span
                          className={`absolute top-3 left-3 badge-pill text-[10px] px-2 py-0.5 sm:text-[12px] sm:px-3 sm:py-1 font-bold shadow-sm ${tagColors[product.tags[0]] || "bg-surface-container text-on-surface"}`}
                        >
                          {product.tags[0]}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFav(product.id);
                        }}
                        className={`absolute top-2 right-2 w-7 h-7 sm:top-3 sm:right-3 sm:w-9 sm:h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
                          favorites[product.id]
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
                        }`}
                        aria-label="Agregar a favoritos"
                      >
                        {favorites[product.id] ? (
                          <MdFavorite className="text-lg sm:text-[20px]" />
                        ) : (
                          <MdFavoriteBorder className="text-lg sm:text-[20px]" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 px-1">
                      <h3 className="font-headline text-[13px] sm:text-headline-sm text-on-surface font-semibold leading-tight group-hover:text-secondary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-on-surface-variant text-[11px] sm:text-body-sm font-body">
                        {product.materials}
                      </p>
                      <StarRating rating={product.rating} reviews={product.reviews} />
                    </div>

                    <div className="mt-2 pt-2 sm:mt-4 sm:pt-3 border-t border-outline-variant/15 flex items-center justify-between flex-wrap gap-x-2 gap-y-1.5 px-1">
                      <span className="font-bold font-headline text-[15px] sm:text-headline-md text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAdd(product);
                        }}
                        className={`bg-secondary text-on-secondary px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-bold tactile-press transition-all shadow-button ${
                          addedId === product.id ? "bg-[#3a9d62] hover:bg-[#3a9d62]" : "hover:bg-secondary/90"
                        }`}
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                        aria-label={`Agregar ${product.name} a la bolsa`}
                      >
                        {addedId === product.id ? (
                          <>
                            <MdCheck className="text-[15px] sm:text-[18px]" />
                            <span aria-live="polite">¡Añadido!</span>
                          </>
                        ) : (
                          <>
                            <MdAddShoppingCart className="text-[15px] sm:text-[18px]" />
                            <span>Añadir</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-on-surface-variant font-body text-body-lg">
              Próximamente tendremos productos en esta categoría.
            </p>
            <Link
              href="/#tienda"
              className="inline-block mt-4 bg-secondary text-on-secondary px-6 py-3 rounded-full font-bold tactile-press transition-all shadow-button hover:bg-secondary/90"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
