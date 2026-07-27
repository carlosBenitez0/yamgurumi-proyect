'use client'

import { useState } from "react";

interface ProductCardProps {
  name: string;
  material?: string;
  price: string;
  image?: string;
}

export default function ProductCard({
  name,
  material,
  price,
  image,
}: ProductCardProps) {
  const [isFav, setIsFav] = useState(false);

  return (
    <article
      className="group relative flex flex-col bg-surface-container-lowest rounded-3xl shadow-card overflow-hidden transition-all duration-300 ease-squish hover:shadow-elevation border border-primary-container/20"
    >
      <div className="relative aspect-square bg-surface-container overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-squish group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30 font-headline text-4xl">
            🧶
          </div>
        )}
        <button
          onClick={() => setIsFav(!isFav)}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-lowest/80 backdrop-blur-sm tactile-press transition-transform duration-200 hover:scale-110"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFav ? "#f4b8b0" : "none"}
            stroke={isFav ? "#f4b8b0" : "#4f4440"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-headline text-headline-sm text-on-surface leading-tight">
          {name}
        </h3>
        {material && (
          <p className="font-body text-body-sm text-on-surface-variant">
            {material}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-headline text-headline-md text-primary font-bold">
            {price}
          </span>
          <button
            aria-label={`Agregar ${name} al carrito`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-on-secondary tactile-press transition-all duration-300 hover:scale-110"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
