"use client";

import Link from "next/link";
import { MdCheck, MdFilterListOff } from "react-icons/md";
import { categories, sizeOptions } from "@/data/products";

/* ── Filtros del catálogo ─────────────────────────────────
 * Panel único reutilizado en dos lugares: el sidebar sticky
 * de escritorio y el drawer de mobile. Cada sección es un
 * grupo nativo (radio/checkbox) — selección por teclado y
 * estado visible sin inventar semántica.
 */

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  /* Categorías (radio, una a la vez — sincroniza con la URL) */
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  totalProducts: number;
  /* Precio (rango min/max, textos + inputMode decimal) */
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  minPrice: number;
  maxPrice: number;
  /* Tamaño (checkbox, multi) */
  activeSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  sizeCounts: Record<string, number>;
  /* Etiquetas (checkbox, multi) */
  activeTags: string[];
  onTagsChange: (tags: string[]) => void;
  tagCounts: Record<string, number>;
  /* Acciones */
  hasActiveFilters: boolean;
  onClear: () => void;
  /* Prefijo de nombre para los inputs de categoría (radio):
     cada instancia del panel debe formar su propio grupo de radios,
     de lo contrario comparten grupo a nivel de documento y un set de
     `checked` desmarca al otro panel (sidebar ↔ drawer). */
  namePrefix?: string;
}

/* ── Sección ────────────────────────────────────────────── */

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
    <section aria-labelledby={id} className="border-t border-outline-variant/15 pt-5 first:border-t-0 first:pt-0">
      <h3
        id={id}
        className="font-headline text-headline-sm font-bold text-on-surface mb-3"
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ── Fila de categoría (radio) ──────────────────────────── */

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
    <label className="group flex items-center gap-2.5 w-full rounded-full px-3.5 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-secondary-container/20 has-checked:bg-secondary-container/40 focus-within:ring-2 focus-within:ring-secondary/40">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      {icon && <span className="text-[14px] flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span
        className={`flex-1 text-sm font-body min-w-0 truncate transition-colors ${
          checked ? "text-secondary font-bold" : "text-on-surface font-medium group-hover:text-on-surface"
        }`}
      >
        {label}
      </span>
      <span className="text-xs font-label text-on-surface-variant/70 flex-shrink-0">
        {count}
      </span>
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 transition-all duration-150 ${
          checked
            ? "border-secondary bg-secondary"
            : "border-outline-variant/60 bg-surface-container-lowest"
        }`}
      >
        <MdCheck
          className={`w-3 h-3 text-on-secondary transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
    </label>
  );
}

/* ── Fila de checkbox (tamaño / etiquetas) ──────────────── */

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
    <label className="group flex items-center gap-2.5 w-full rounded-full px-3.5 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-secondary-container/20 has-checked:bg-secondary-container/40 focus-within:ring-2 focus-within:ring-secondary/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-md border flex-shrink-0 transition-all duration-150 ${
          checked
            ? "border-secondary bg-secondary"
            : "border-outline-variant/60 bg-surface-container-lowest group-hover:border-outline-variant"
        }`}
      >
        <MdCheck
          className={`w-3.5 h-3.5 text-on-secondary transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
      <span
        className={`flex-1 text-sm font-body min-w-0 truncate transition-colors ${
          checked ? "text-secondary font-bold" : "text-on-surface font-medium"
        }`}
      >
        {label}
      </span>
      <span className="text-xs font-label text-on-surface-variant/70 flex-shrink-0">
        {count}
      </span>
    </label>
  );
}

/* ── Panel ──────────────────────────────────────────────── */

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
    <div className="flex flex-col gap-5">
      {/* Cabecera del panel */}
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-headline-sm font-bold text-primary">
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-on-surface-variant hover:bg-secondary-container/30 hover:text-secondary transition-colors duration-200 focus-ring"
          >
            <MdFilterListOff className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>

      {/* Categorías */}
      <Section id="filter-categories" title="Categorías">
        <div role="radiogroup" aria-label="Categorías" className="flex flex-col gap-0.5">
          <CategoryRow
            label="Todos"
            count={totalProducts}
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
      <Section id="filter-price" title="Precio">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-sm font-body"
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
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-7 pr-3 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
            />
          </div>
          <span aria-hidden="true" className="text-on-surface-variant/40 text-sm flex-shrink-0">
            —
          </span>
          <div className="relative flex-1 min-w-0">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-sm font-body"
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
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-7 pr-3 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
            />
          </div>
        </div>
        <p className="mt-2.5 text-xs font-body text-on-surface-variant/80">
          El catálogo va de ${minPrice} a ${maxPrice}
        </p>
      </Section>

      {/* Tamaño */}
      <Section id="filter-size" title="Tamaño">
        <div className="flex flex-col gap-0.5">
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
      <Section id="filter-tags" title="Etiquetas">
        <div className="flex flex-col gap-0.5">
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

      {/* Pedidos personalizados */}
      <div className="rounded-3xl bg-primary-container/25 border border-primary-container/40 p-5 mt-1">
        <h3 className="font-headline text-headline-sm font-bold text-primary">
          ¿Tu amigurumi no está acá?
        </h3>
        <p className="mt-2 font-body text-body-sm text-on-surface-variant leading-relaxed">
          Contanos qué tenés en mente — personaje, colores, tamaño — y el
          taller lo teje solo para vos.
        </p>
        <Link
          href="/contact?subject=custom"
          className="mt-4 inline-flex items-center justify-center w-full bg-secondary text-on-secondary px-5 py-3 rounded-full font-body text-sm font-bold shadow-button hover:bg-secondary/90 transition-all active:scale-[0.97] tactile-press focus-ring"
        >
          Pedir un encargo
        </Link>
      </div>
    </div>
  );
}
