'use client'

import Link from "next/link";
import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart } from "react-icons/md";
import type { Product } from "@/data/products";

interface Props {
  category: string;
  icon: string;
  products: Product[];
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex items-center gap-0.5 text-[#D4A843]">
        {Array.from({ length: 5 }).map((_, i) => (
          i < full ? (
            <MdStar key={i} className="text-[14px]" />
          ) : (
            <MdStarBorder key={i} className="text-[14px]" />
          )
        ))}
      </div>
      <span className="text-on-surface-variant text-[12px] font-body">
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

  const toggleFav = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i + 1, 6)}>
                <Link href={`/producto/${product.slug}`} className="block h-full">
                  <article className="group bg-surface-container-lowest rounded-3xl p-4 shadow-card hover:shadow-elevation border border-primary-container/20 flex flex-col transition-all duration-300 hover:-translate-y-1.5 h-full">
                    <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-surface-container img-placeholder">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.tags[0] && (
                        <span
                          className={`absolute top-3 left-3 badge-pill text-[12px] font-bold px-3 py-1 shadow-sm ${tagColors[product.tags[0]] || "bg-surface-container text-on-surface"}`}
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
                        className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
                          favorites[product.id]
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
                        }`}
                        aria-label="Agregar a favoritos"
                      >
                        {favorites[product.id] ? (
                          <MdFavorite className="text-[20px]" />
                        ) : (
                          <MdFavoriteBorder className="text-[20px]" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 px-1">
                      <h3 className="font-headline text-headline-sm text-on-surface font-semibold leading-tight group-hover:text-secondary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-on-surface-variant text-body-sm font-body">
                        {product.materials}
                      </p>
                      <StarRating rating={product.rating} reviews={product.reviews} />
                    </div>

                    <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between px-1">
                      <span className="font-bold font-headline text-headline-md text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="bg-secondary text-on-secondary px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold tactile-press transition-all shadow-button hover:bg-secondary/90"
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                        aria-label={`Agregar ${product.name} al carrito`}
                      >
                        <MdAddShoppingCart className="text-[18px]" />
                        <span>Añadir</span>
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
