"use client";

import Link from "next/link";
import { MdCheck, MdFilterListOff, MdAutoAwesome } from "react-icons/md";
import { categories, sizeOptions } from "@/data/products";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  totalProducts: number;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  minPrice: number;
  maxPrice: number;
  activeSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  sizeCounts: Record<string, number>;
  activeTags: string[];
  onTagsChange: (tags: string[]) => void;
  tagCounts: Record<string, number>;
  hasActiveFilters: boolean;
  onClear: () => void;
  namePrefix?: string;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-primary-container/15 pt-5 first:border-t-0 first:pt-0">
      <h3
        id={id}
        className="font-headline text-headline-sm font-bold text-on-surface mb-3 flex items-center justify-between"
      >
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}

function CategoryRow({
  label,
  count,
  icon,
  checked,
  onChange,
  name,
}: {
  label: string;
  count: number;
  icon?: string;
  checked: boolean;
  onChange: () => void;
  name: string;
}) {
  return (
    <label className={`group flex items-center gap-2.5 w-full rounded-2xl px-3.5 py-2.5 cursor-pointer transition-all duration-200 ${
      checked
        ? "bg-secondary text-white shadow-button scale-[1.01]"
        : "bg-surface-container-low/40 hover:bg-secondary-container/30 text-on-surface"
    }`}>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      {icon && <span className="text-base flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span
        className={`flex-1 text-xs sm:text-sm font-body min-w-0 truncate font-bold transition-colors ${
          checked ? "text-white" : "text-on-surface group-hover:text-secondary"
        }`}
      >
        {label}
      </span>
      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 transition-colors ${
        checked ? "bg-white/20 text-white" : "bg-primary-container/20 text-on-surface-variant"
      }`}>
        {count}
      </span>
    </label>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className={`group flex items-center gap-2.5 w-full rounded-2xl px-3 py-2 cursor-pointer transition-all duration-200 ${
      checked
        ? "bg-secondary-container/50 border border-secondary/30 text-secondary"
        : "hover:bg-surface-container-low/60 text-on-surface"
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`flex items-center justify-center w-4 h-4 rounded-md border flex-shrink-0 transition-all duration-200 ${
          checked
            ? "border-secondary bg-secondary text-white"
            : "border-primary-container/40 bg-surface-container-lowest group-hover:border-secondary"
        }`}
      >
        <MdCheck
          className={`w-3 h-3 transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
      <span
        className={`flex-1 text-xs font-body min-w-0 truncate transition-colors ${
          checked ? "font-bold text-secondary" : "font-medium text-on-surface"
        }`}
      >
        {label}
      </span>
      <span className="text-[10px] font-extrabold text-on-surface-variant/70 bg-surface-container-low px-1.5 py-0.5 rounded-full flex-shrink-0">
        {count}
      </span>
    </label>
  );
}

export default function FilterPanel({
  activeCategory,
  onCategoryChange,
  totalProducts,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  minPrice,
  maxPrice,
  activeSizes,
  onSizesChange,
  sizeCounts,
  activeTags,
  onTagsChange,
  tagCounts,
  hasActiveFilters,
  onClear,
  namePrefix = "catalog",
}: FilterPanelProps) {
  const toggleSize = (value: string) => {
    onSizesChange(
      activeSizes.includes(value)
        ? activeSizes.filter((v) => v !== value)
        : [...activeSizes, value]
    );
  };

  const toggleTag = (value: string) => {
    onTagsChange(
      activeTags.includes(value)
        ? activeTags.filter((v) => v !== value)
        : [...activeTags, value]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera del panel */}
      <div className="flex items-center justify-between border-b border-primary-container/20 pb-3">
        <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
          <span>Filtros de Colección</span>
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-tertiary bg-tertiary-container/30 hover:bg-tertiary hover:text-white transition-all tactile-press active:scale-95 cursor-pointer"
          >
            <MdFilterListOff className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Categorías */}
      <Section id="filter-categories" title="Categorías">
        <div role="radiogroup" aria-label="Categorías" className="flex flex-col gap-1.5">
          <CategoryRow
            label="Todos los Amigurumis"
            count={totalProducts}
            icon="🧶"
            checked={!activeCategory}
            onChange={() => onCategoryChange("")}
            name={`${namePrefix}-category`}
          />
          {categories.map((cat) => (
            <CategoryRow
              key={cat.name}
              label={cat.name}
              count={cat.count}
              icon={cat.icon}
              checked={activeCategory === cat.name}
              onChange={() => onCategoryChange(cat.name)}
              name={`${namePrefix}-category`}
            />
          ))}
        </div>
      </Section>

      {/* Precio */}
      <Section id="filter-price" title="Rango de Precio ($)">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary font-bold text-xs"
            >
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              placeholder={String(minPrice)}
              aria-label="Precio mínimo"
              className="w-full bg-surface-container-lowest border border-primary-container/25 rounded-full pl-7 pr-3 py-2 font-body text-xs font-bold text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-inner"
            />
          </div>
          <span aria-hidden="true" className="text-on-surface-variant/40 text-xs font-bold shrink-0">
            a
          </span>
          <div className="relative flex-1 min-w-0">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary font-bold text-xs"
            >
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              placeholder={String(maxPrice)}
              aria-label="Precio máximo"
              className="w-full bg-surface-container-lowest border border-primary-container/25 rounded-full pl-7 pr-3 py-2 font-body text-xs font-bold text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-inner"
            />
          </div>
        </div>
        <p className="mt-2 text-[11px] font-body text-on-surface-variant/70 text-center font-medium">
          Rango disponible: ${minPrice} — ${maxPrice} USD
        </p>
      </Section>

      {/* Tamaño */}
      <Section id="filter-size" title="Tamaño">
        <div className="flex flex-col gap-1">
          {sizeOptions.map((opt) => (
            <CheckRow
              key={opt.value}
              label={opt.label}
              count={sizeCounts[opt.value] ?? 0}
              checked={activeSizes.includes(opt.value)}
              onChange={() => toggleSize(opt.value)}
            />
          ))}
        </div>
      </Section>

      {/* Etiquetas */}
      <Section id="filter-tags" title="Colecciones & Etiquetas">
        <div className="flex flex-col gap-1">
          {(
            [
              { value: "best-seller", label: "Best Seller" },
              { value: "nuevo", label: "Nuevo" },
              { value: "limitado", label: "Limitado" },
              { value: "popular", label: "Popular" },
              { value: "regalo", label: "Regalo" },
              { value: "favorito", label: "Favorito" },
              { value: "bebe", label: "Bebé" },
            ] as FilterOption[]
          ).map((opt) => (
            <CheckRow
              key={opt.value}
              label={opt.label}
              count={tagCounts[opt.value] ?? 0}
              checked={activeTags.includes(opt.value)}
              onChange={() => toggleTag(opt.value)}
            />
          ))}
        </div>
      </Section>

      {/* Pedidos personalizados en recuadro cálido */}
      <div className="rounded-3xl bg-gradient-to-br from-secondary-container/30 via-tertiary-container/20 to-secondary-container/40 border border-secondary/20 p-5 shadow-sm">
        <div className="flex items-center gap-1.5 text-secondary font-bold text-xs mb-1">
          <MdAutoAwesome />
          <span>Yamgurumi Bespoke</span>
        </div>
        <h3 className="font-headline text-sm font-bold text-on-surface">
          ¿Buscas una creación única?
        </h3>
        <p className="mt-1 font-body text-xs text-on-surface-variant leading-relaxed">
          Diseñamos y tejemos el amigurumi de tus sueños con colores y tamaño a tu elección.
        </p>
        <Link
          href="/contact?subject=custom"
          className="mt-3.5 inline-flex items-center justify-center w-full bg-secondary text-white px-4 py-2.5 rounded-full font-body text-xs font-bold shadow-button hover:bg-secondary/90 transition-all tactile-press active:scale-95 cursor-pointer"
        >
          Solicitar Pedido Especial
        </Link>
      </div>
    </div>
  );
}
