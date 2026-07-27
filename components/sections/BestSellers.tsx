'use client'

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { YarnBall, CrochetHook } from "@/components/ui/CraftBackground";
import { MdStar, MdStarBorder, MdFavorite, MdFavoriteBorder, MdAddShoppingCart } from "react-icons/md";

const categoriesFilter = ["Todos", "Muñecos", "Decoración", "Accesorios"];

const products = [
  {
    name: "Dragón Celestino",
    material: "100% Algodón Mercerizado",
    price: "$35.00",
    tag: "Best Seller",
    tagColor: "bg-secondary text-on-secondary",
    rating: 4.9,
    reviews: 128,
    category: "Muñecos",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuJZfQ3_jcHBVxa8U-w0JdB_i0R_ig-_zhmxxSiXeuoCT9Q4U8q1PVIGj4d_2_C-8LPGhzFbNmMCCZUC8NV9buaT-KI2FTX-tkOcdciubZRLbhArNH1IMz2HtFo5zNbw8-5zAIOsnhDG9ojVp1ih31G2_5p3h3wlQdoYDfLwZoXn0iOP_QXPKheCS8d3s-tjfRC6EyTOtqdK5HLHk9TFEA9NL_lRYVA83z4jk5deT7x5uTp3ARrEbEqYtvixD0dzTDYWC4pDOaUww",
  },
  {
    name: "Set de Setas Mágicas",
    material: "Decoración Otoñal",
    price: "$28.00",
    tag: "Nuevo",
    tagColor: "bg-tertiary text-on-tertiary",
    rating: 4.8,
    reviews: 86,
    category: "Decoración",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBm8LoBy849NuYsnfBC5YX7x2QJ45X18U6rl7DC9zRoOa6ajtP5g8Pxp5o8PPHY4wTl9Z1c45Az-QIzQxm_oX1FltC8fKEbSdTjvmen4z60slHvxsTar22AanphM1AtDhHEt-z8kXvYcsY7B2Er-LTMnUoY06Q7nY8lwxwY61eORBbs1cxpqDkxo5Qj2ZUO4idN2-gLEzOHVEA2z0UPNNs_3ZmBXwmNL0wiBG4wVTqO23dRsfH9IZoTpHzSgR79F1GpS4it77XvMeg",
  },
  {
    name: "Ballena Mini Llavero",
    material: "Perfecto para llaves",
    price: "$15.00",
    tag: "Popular",
    tagColor: "bg-secondary-container text-on-secondary-container",
    rating: 5.0,
    reviews: 203,
    category: "Accesorios",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkPkmx8nFi1PvYcdrUfRZldtYnRnHBQ_4AMcmZ9rmpIn0pGeyaA8691-nx8-v4EjEg2WdTbTK3CTu6w3Dn8moeNGCt1jBJaWaRYAI-sWXnFNnQhtVufLqdT1BpOKs55K3ZU6uyLTRsBD37r-BuOQhaLIX5kpFIG8vQ-tG9XTwdEYyElnW0OZKnK1865p3Dno-ULTL5b4k8WtwroHusBGHsdT6ZbphXUcQjtlPn1gamBg8hHHIgd5cFprnhx5Xqkb2gXOW5pG51G28",
  },
  {
    name: "Zorro Otoñal",
    material: "Con bufanda tejida",
    price: "$42.00",
    tag: "Limitado",
    tagColor: "bg-primary text-on-primary",
    rating: 4.7,
    reviews: 64,
    category: "Muñecos",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCy-o0mq6JZVbVl6dctp_gVvzf6BTzue0lREeWS296bwZRDQFyHLaTQV8z6U4kj20WSN-kpni2kEPjVDNXllVFdqcehDu0Swwm9FFVx0749lKq-V5vmzAtE_10Gbie2n-eFec416MjKmjHN1O549UMtpwtjSXBh2lIOd1nTphjK39fBFmRPblviPJF7o8X8f6M7UlyvU3rH61AHnY6xeIiJ8oDsirnQY4mDazJyK8A0LA3R8BOsSI2_cmVi_AOs9mbuzN13wrTt8ww",
  },
];

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

  const toggleFav = (name: string) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredProducts = activeTab === "Todos" 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <SectionWrapper
      id="tienda"
      className="bg-surface-container-low/60 relative border-y border-primary-container/20"
    >
      <div className="absolute inset-0 knit-texture -z-10 opacity-10" />

      {/* Craft decorations */}
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
        
        {/* Section Header */}
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
                Descubre los diseños preferidos tejidas con hilos 100% orgánicos.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              {categoriesFilter.map((tab) => (
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
            </div>
          </div>
        </ScrollReveal>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product, i) => (
            <ScrollReveal key={product.name} delay={Math.min(i + 1, 4)}>
              <article
                className="group bg-surface-container-lowest rounded-3xl p-4 shadow-card hover:shadow-elevation border border-primary-container/20 flex flex-col transition-all duration-300 hover:-translate-y-1.5 h-full"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-surface-container img-placeholder">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {product.tag && (
                    <span
                      className={`absolute top-3 left-3 badge-pill text-[12px] font-bold px-3 py-1 shadow-sm ${product.tagColor}`}
                    >
                      {product.tag}
                    </span>
                  )}
                  <button
                    onClick={() => toggleFav(product.name)}
                    className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
                      favorites[product.name]
                        ? "bg-tertiary text-on-tertiary"
                        : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-tertiary/20"
                    }`}
                    aria-label="Agregar a favoritos"
                  >
                    {favorites[product.name] ? (
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
                    {product.material}
                  </p>
                  <StarRating rating={product.rating} reviews={product.reviews} />
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between px-1">
                  <span className="font-bold font-headline text-headline-md text-primary">
                    {product.price}
                  </span>
                  <button
                    className="bg-secondary text-on-secondary px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold tactile-press transition-all shadow-button hover:bg-secondary/90"
                    style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <MdAddShoppingCart className="text-[18px]" />
                    <span>Añadir</span>
                  </button>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
    </SectionWrapper>
  );
}
