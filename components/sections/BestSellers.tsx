'use client'

import { useState, useRef } from "react";
import Link from "next/link";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { YarnBall, CrochetHook } from "@/components/ui/CraftBackground";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart, MdChevronLeft, MdChevronRight, MdStorefront } from "react-icons/md";
import { products as allProducts } from "@/data/products";

const mainCategoryTabs = ["Todos", "Muñecos", "Decoración", "Llaveros"];
const extraCategories = ["Accesorios", "Navideño", "Infantil"];

const tagColors: Record<string, string> = {
  "Best Seller": "bg-secondary text-on-secondary",
  "Nuevo": "bg-tertiary text-on-tertiary",
  "Popular": "bg-secondary-container text-on-secondary-container",
  "Limitado": "bg-primary text-on-primary",
  "Favorito": "bg-tertiary-container text-on-tertiary-container",
  "Edición Especial": "bg-tertiary text-on-tertiary",
};

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

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  const toggleFav = (name: string) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const bestSellers = allProducts.filter(p => p.tags.includes("Best Seller") || p.rating >= 4.8);

  const filteredProducts = activeTab === "Todos"
    ? bestSellers
    : bestSellers.filter(p => p.category === activeTab);

  const displayedProducts = filteredProducts.slice(0, 7);

  const scrollSlider = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const amt = sliderRef.current.clientWidth * 0.6;
    sliderRef.current.scrollBy({ left: dir === "left" ? -amt : amt, behavior: "smooth" });
  };

  return (
    <SectionWrapper
      id="tienda"
      className="bg-surface-container-low/60 relative border-y border-primary-container/20"
    >
      <div className="absolute inset-0 knit-texture -z-10 opacity-10" />

      <YarnBall
        size={48}
        className="absolute top-8 right-12 craft-float -z-10 hidden lg:block"
        color="#acedfe"
        opacity={0.12}
      />
      <CrochetHook
        className="absolute bottom-10 left-8 craft-drift -z-10 hidden lg:block"
        opacity={0.1}
      />

      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="text-center md:text-left max-w-xl">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Favoritos de la Comunidad
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface">
              Los Amigurumis más Queridos
            </h2>
            <p className="text-on-surface-variant font-body text-body-md mt-2">
              Descubre los diseños preferidos tejidos con hilos 100% orgánicos.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            {mainCategoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-secondary text-on-secondary shadow-button scale-105"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/40"
                }`}
              >
                {tab}
              </button>
            ))}
            <Link
              href="/catalog"
              className="px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/40 border border-dashed border-primary-container/30 flex items-center gap-1"
            >
              +{extraCategories.length} más
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Mobile: slider */}
      <div className="relative sm:hidden">
        <button
          onClick={() => scrollSlider("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface-container-lowest/95 shadow-card border border-primary-container/20 flex items-center justify-center transition-all hover:shadow-elevation text-on-surface-variant hover:text-secondary"
          aria-label="Anterior"
        >
          <MdChevronLeft className="text-[18px]" />
        </button>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-0 scroll-smooth"
        >
          {displayedProducts.map((product, i) => (
            <Link
              key={product.id}
              href={`/producto/${product.slug}`}
              className="flex-shrink-0 w-[250px] group/card first:ml-0 last:mr-0"
            >
              <article className="bg-surface-container-lowest rounded-3xl p-3 shadow-card border border-primary-container/20 flex flex-col transition-all duration-300 h-full">
                <div className="relative rounded-2xl overflow-hidden mb-2.5 aspect-square bg-surface-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    loading="lazy"
                  />
                  {product.tags[0] && (
                    <span className={`absolute top-2.5 left-2.5 badge-pill text-[11px] font-bold px-2.5 py-0.5 shadow-sm ${tagColors[product.tags[0]] || "bg-surface-container text-on-surface"}`}>
                      {product.tags[0]}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(product.id); }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
                      favorites[product.id]
                        ? "bg-tertiary text-on-tertiary"
                        : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
                    }`}
                    aria-label="Agregar a favoritos"
                  >
                    {favorites[product.id] ? <MdFavorite className="text-[18px]" /> : <MdFavoriteBorder className="text-[18px]" />}
                  </button>
                </div>
                <div className="flex flex-col gap-0.5 flex-1 px-0.5">
                  <h3 className="font-headline text-sm text-on-surface font-semibold leading-tight group-hover/card:text-secondary transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px]">
                    <MdStar className="text-[#D4A843] text-[12px]" />
                    <span className="text-on-surface-variant font-body">{product.rating}</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-outline-variant/15 flex items-center justify-between px-0.5">
                  <span className="font-bold font-headline text-base text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="bg-secondary text-on-secondary px-3 py-2 rounded-full flex items-center gap-1.5 text-[11px] font-bold tactile-press transition-all shadow-button hover:bg-secondary/90"
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <MdAddShoppingCart className="text-[16px]" />
                    <span>Añadir</span>
                  </button>
                </div>
              </article>
            </Link>
          ))}

          {/* "Ver más" card */}
          <Link
            href="/catalog"
            className="flex-shrink-0 w-[200px] group/card last:mr-0"
          >
            <div className="h-full bg-surface-container-lowest/60 rounded-3xl border-2 border-dashed border-primary-container/30 flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 hover:border-secondary/40 hover:bg-surface-container-lowest/90 hover:shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                <MdStorefront className="text-[28px] text-secondary" />
              </div>
              <span className="font-headline text-sm font-bold text-on-surface text-center">
                Ver catálogo completo
              </span>
              <span className="text-body-sm text-on-surface-variant/60 font-body text-center">
                +{filteredProducts.length} productos
              </span>
              <span className="mt-1 text-xs font-body font-semibold text-secondary group-hover/card:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                Explorar <MdChevronRight className="text-[16px]" />
              </span>
            </div>
          </Link>
        </div>

        <button
          onClick={() => scrollSlider("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface-container-lowest/95 shadow-card border border-primary-container/20 flex items-center justify-center transition-all hover:shadow-elevation text-on-surface-variant hover:text-secondary"
          aria-label="Siguiente"
        >
          <MdChevronRight className="text-[18px]" />
        </button>
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedProducts.map((product, i) => (
          <ScrollReveal key={product.id} delay={Math.min(i + 1, 4)}>
            <Link href={`/producto/${product.slug}`} className="block h-full group/card">
              <article className="bg-surface-container-lowest rounded-3xl p-3.5 shadow-card hover:shadow-elevation border border-primary-container/20 flex flex-col transition-all duration-300 hover:-translate-y-1.5 h-full">
                <div className="relative rounded-2xl overflow-hidden mb-3 aspect-square bg-surface-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    loading="lazy"
                  />
                  {product.tags[0] && (
                    <span className={`absolute top-2.5 left-2.5 badge-pill text-[11px] font-bold px-2.5 py-0.5 shadow-sm ${tagColors[product.tags[0]] || "bg-surface-container text-on-surface"}`}>
                      {product.tags[0]}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(product.id); }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
                      favorites[product.id]
                        ? "bg-tertiary text-on-tertiary"
                        : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
                    }`}
                    aria-label="Agregar a favoritos"
                  >
                    {favorites[product.id] ? <MdFavorite className="text-[18px]" /> : <MdFavoriteBorder className="text-[18px]" />}
                  </button>
                </div>

                <div className="flex flex-col gap-0.5 flex-1 px-0.5">
                  <h3 className="font-headline text-sm text-on-surface font-semibold leading-tight group-hover/card:text-secondary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-on-surface-variant text-[12px] font-body leading-tight">
                    {product.materials}
                  </p>
                  <StarRating rating={product.rating} reviews={product.reviews} />
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-outline-variant/15 flex items-center justify-between px-0.5">
                  <span className="font-bold font-headline text-base text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="bg-secondary text-on-secondary px-3 py-2 rounded-full flex items-center gap-1.5 text-[11px] font-bold tactile-press transition-all shadow-button hover:bg-secondary/90"
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <MdAddShoppingCart className="text-[16px]" />
                    <span>Añadir</span>
                  </button>
                </div>
              </article>
            </Link>
          </ScrollReveal>
        ))}

        {/* "Ver más" card - desktop */}
        <ScrollReveal delay={5}>
          <Link
            href="/catalog"
            className="block h-full group/card"
          >
            <div className="h-full bg-surface-container-lowest/60 rounded-3xl border-2 border-dashed border-primary-container/30 flex flex-col items-center justify-center gap-2 p-4 transition-all duration-300 hover:border-secondary/40 hover:bg-surface-container-lowest/90 hover:shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                <MdStorefront className="text-[28px] text-secondary" />
              </div>
              <span className="font-headline text-sm font-bold text-on-surface text-center">
                Ver catálogo completo
              </span>
              <span className="text-[12px] text-on-surface-variant/60 font-body text-center">
                +{filteredProducts.length} productos disponibles
              </span>
              <span className="text-xs font-body font-semibold text-secondary group-hover/card:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                Explorar todo <MdChevronRight className="text-[16px]" />
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}
