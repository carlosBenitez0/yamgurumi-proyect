'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ui/ProductCard";
import FilterPanel from "@/components/catalog/FilterPanel";
import { YarnBall, CrochetHook } from "@/components/ui/CraftBackground";
import {
  products as allProducts,
  categories,
  searchProducts,
  popularSearches,
  sizeOptions,
  type Product,
} from "@/data/products";
import {
  MdSearch,
  MdClose,
  MdExpandMore,
  MdOutlineFilterList,
  MdFilterListOff,
} from "react-icons/md";

/* ── Constants ──────────────────────────────────────────── */

const INITIAL_VISIBLE = 40;
const LOAD_MORE_COUNT = 12;

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Ordenar por" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor calificados" },
  { value: "name", label: "Nombre A-Z" },
];

interface FilterOption {
  value: string;
  label: string;
}

/* ── Filtros derivados de los datos reales ──────────────── */

const MIN_PRICE = Math.min(...allProducts.map((p) => p.price));
const MAX_PRICE = Math.max(...allProducts.map((p) => p.price));

const sizeSlugByLabel: Record<string, string> = Object.fromEntries(
  sizeOptions.map((o) => [o.label, o.value]),
);
const sizeLabelBySlug: Record<string, string> = Object.fromEntries(
  sizeOptions.map((o) => [o.value, o.label]),
);
const sizeCounts: Record<string, number> = sizeOptions.reduce((acc, o) => {
  acc[o.value] = allProducts.filter((p) => sizeSlugByLabel[p.size] === o.value).length;
  return acc;
}, {} as Record<string, number>);

const tagFilters: FilterOption[] = [
  { value: "best-seller", label: "Best Seller" },
  { value: "nuevo", label: "Nuevo" },
  { value: "limitado", label: "Limitado" },
  { value: "popular", label: "Popular" },
  { value: "regalo", label: "Regalo" },
  { value: "favorito", label: "Favorito" },
  { value: "bebe", label: "Bebé" },
];
const tagLabelBySlug: Record<string, string> = Object.fromEntries(
  tagFilters.map((t) => [t.value, t.label]),
);
const tagCounts: Record<string, number> = tagFilters.reduce((acc, t) => {
  acc[t.value] = allProducts.filter((p) => p.tags.includes(t.label)).length;
  return acc;
}, {} as Record<string, number>);

/* ── Helpers ────────────────────────────────────────────── */

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
  }
  return sorted;
}

function priceChipLabel(min: string, max: string): string {
  const m = min ? `$${min}` : "";
  const x = max ? `$${max}` : "";
  if (m && x) return `Precio ${m} — ${x}`;
  if (m) return `Precio desde ${m}`;
  return `Precio hasta ${x}`;
}

/* ── Category emoji map ─────────────────────────────────── */

const categoryIcon: Record<string, string> = {
  Muñecos: "🧸",
  Decoración: "🏡",
  Accesorios: "✨",
  Llaveros: "🔑",
  Navideño: "🎄",
  Infantil: "👶",
};

/* ── Main Component ─────────────────────────────────────── */

export default function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);

  /* ── State from URL ──────────────────────────────────── */

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = (searchParams.get("sort") as SortOption) || "default";
  const urlMin = searchParams.get("min") || "";
  const urlMax = searchParams.get("max") || "";
  const urlSizes = (searchParams.get("size") || "").split(",").filter(Boolean);
  const urlTags = (searchParams.get("tags") || "").split(",").filter(Boolean);

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortOption, setSortOption] = useState<SortOption>(urlSort);
  const [priceMin, setPriceMin] = useState(urlMin);
  const [priceMax, setPriceMax] = useState(urlMax);
  const [activeSizes, setActiveSizes] = useState(urlSizes);
  const [activeTags, setActiveTags] = useState(urlTags);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ── Sync state → URL ────────────────────────────────── */

  type UrlParams = {
    q?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    size?: string;
    tags?: string;
  };

  const buildUrl = useCallback(
    (params: UrlParams) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, val]) => {
        if (val) sp.set(key, val);
        else sp.delete(key);
      });
      const qs = sp.toString();
      return `${pathname}${qs ? `?${qs}` : ""}`;
    },
    [searchParams, pathname]
  );

  // Acciones discretas (filtro, sort): crean entrada en el historial
  // para que "atrás/adelante" del navegador funcione.
  const pushUrl = useCallback(
    (params: UrlParams) => {
      router.push(buildUrl(params), { scroll: false });
    },
    [buildUrl, router]
  );

  // Tecleo de búsqueda y precio: reemplaza la URL sin spamear el historial.
  const replaceUrl = useCallback(
    (params: UrlParams) => {
      router.replace(buildUrl(params), { scroll: false });
    },
    [buildUrl, router]
  );

  /* ── Filtered & sorted products ───────────────────────── */

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      result = searchProducts(searchQuery.trim());
      // Re-apply category filter after search
      if (activeCategory) {
        result = result.filter((p) => p.category === activeCategory);
      }
    }

    // Price range filter
    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    if (min > 0 || Number.isFinite(max)) {
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Size filter (multi)
    if (activeSizes.length > 0) {
      result = result.filter((p) => activeSizes.includes(sizeSlugByLabel[p.size]));
    }

    // Tags filter (multi, OR dentro del grupo)
    if (activeTags.length > 0) {
      const labels = activeTags.map((t) => tagLabelBySlug[t]);
      result = result.filter((p) => labels.some((l) => p.tags.includes(l)));
    }

    // Sort
    result = sortProducts(result, sortOption);

    return result;
  }, [activeCategory, searchQuery, sortOption, priceMin, priceMax, activeSizes, activeTags]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;
  const remaining = filteredProducts.length - visibleCount;
  const hasActiveFilters =
    !!activeCategory ||
    !!searchQuery.trim() ||
    sortOption !== "default" ||
    !!priceMin ||
    !!priceMax ||
    activeSizes.length > 0 ||
    activeTags.length > 0;

  // Conteo de grupos de filtros activos (badge del botón Filtros)
  const filterCount =
    (activeCategory ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (sortOption !== "default" ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0) +
    (activeSizes.length ? 1 : 0) +
    (activeTags.length ? 1 : 0);

  /* ── Handlers ─────────────────────────────────────────── */

  const handleCategoryChange = useCallback(
    (cat: string) => {
      const next = cat === activeCategory ? "" : cat;
      setActiveCategory(next);
      setVisibleCount(INITIAL_VISIBLE);
      pushUrl({ category: next || undefined });
    },
    [activeCategory, pushUrl]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setVisibleCount(INITIAL_VISIBLE);
      replaceUrl({ q: value.trim() || undefined });
    },
    [replaceUrl]
  );

  const handleSortChange = useCallback(
    (opt: SortOption) => {
      setSortOption(opt);
      setShowSortDropdown(false);
      pushUrl({ sort: opt === "default" ? undefined : opt });
    },
    [pushUrl]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  }, []);

  const handleSizesChange = useCallback(
    (sizes: string[]) => {
      setActiveSizes(sizes);
      setVisibleCount(INITIAL_VISIBLE);
      pushUrl({ size: sizes.length ? sizes.join(",") : undefined });
    },
    [pushUrl]
  );

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      setActiveTags(tags);
      setVisibleCount(INITIAL_VISIBLE);
      pushUrl({ tags: tags.length ? tags.join(",") : undefined });
    },
    [pushUrl]
  );

  // Precio: el input actualiza el estado local al instante; la URL
  // se reemplaza tras 300ms de pausa, igual que la búsqueda.
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitPrice = useCallback(
    (min?: string, max?: string) => {
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
      priceDebounceRef.current = setTimeout(() => {
        setVisibleCount(INITIAL_VISIBLE);
        replaceUrl({ min, max });
      }, 300);
    },
    [replaceUrl]
  );

  const handlePriceMinChange = useCallback(
    (v: string) => {
      setPriceMin(v);
      commitPrice(v.trim() || undefined, priceMax.trim() || undefined);
    },
    [commitPrice, priceMax]
  );

  const handlePriceMaxChange = useCallback(
    (v: string) => {
      setPriceMax(v);
      commitPrice(priceMin.trim() || undefined, v.trim() || undefined);
    },
    [commitPrice, priceMin]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("");
    setSortOption("default");
    setPriceMin("");
    setPriceMax("");
    setActiveSizes([]);
    setActiveTags([]);
    setVisibleCount(INITIAL_VISIBLE);
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    router.replace(pathname, { scroll: false });
    searchInputRef.current?.focus();
  }, [pathname, router]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /* ── Debounced search input ──────────────────────────── */

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearchQuery(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setVisibleCount(INITIAL_VISIBLE);
        replaceUrl({ q: v.trim() || undefined });
      }, 200);
    },
    [replaceUrl]
  );

  /* ── Close sort dropdown on outside click ─────────────── */

  useEffect(() => {
    if (!showSortDropdown) return;
    const handler = () => setShowSortDropdown(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showSortDropdown]);

  /* ── Filter drawer: focus inicial, Escape, scroll lock ── */

  useEffect(() => {
    if (!isFilterOpen) return;
    filterCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFilterOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFilterOpen]);

  /* ── Cleanup ──────────────────────────────────────────── */

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    };
  }, []);

  /* ── Sync URL → state (back/forward navigation) ───────── */

  const prevFilterKey = useRef("");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    const sort = (searchParams.get("sort") as SortOption) || "default";
    const min = searchParams.get("min") || "";
    const max = searchParams.get("max") || "";
    const sizes = (searchParams.get("size") || "").split(",").filter(Boolean);
    const tags = (searchParams.get("tags") || "").split(",").filter(Boolean);

    // Reiniciar paginación solo si cambió algún filtro
    const key = [q, cat, sort, min, max, sizes.join(","), tags.join(",")].join("|");
    if (key !== prevFilterKey.current) {
      setVisibleCount(INITIAL_VISIBLE);
      prevFilterKey.current = key;
    }

    setSearchQuery(q);
    setActiveCategory(cat);
    setSortOption(sort);
    setPriceMin(min);
    setPriceMax(max);
    setActiveSizes(sizes);
    setActiveTags(tags);
  }, [searchParams]);

  /* ── Render ───────────────────────────────────────────── */

  const filterPanelProps = {
    activeCategory,
    onCategoryChange: handleCategoryChange,
    totalProducts: allProducts.length,
    priceMin,
    priceMax,
    onPriceMinChange: handlePriceMinChange,
    onPriceMaxChange: handlePriceMaxChange,
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    activeSizes,
    onSizesChange: handleSizesChange,
    sizeCounts,
    activeTags,
    onTagsChange: handleTagsChange,
    tagCounts,
    hasActiveFilters,
    onClear: clearFilters,
  };

  return (
    <main className="min-h-screen bg-background pt-28 sm:pt-32 pb-16 sm:pb-24">
      <div className="section-container">
        <div className="max-w-7xl w-full">
          {/* ── Header ────────────────────────────────────── */}
          <div className="relative mb-8 sm:mb-10">
            {/* Decorative elements */}
            <YarnBall
              size={40}
              className="absolute -top-4 -right-2 sm:right-4 craft-float -z-10 opacity-[0.08] hidden sm:block"
              color="#acedfe"
              opacity={0.1}
            />
            <CrochetHook
              className="absolute -bottom-2 -left-2 craft-drift -z-10 opacity-[0.06] hidden sm:block"
              opacity={0.06}
            />

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Catálogo Yamgurumi
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">
                  Todos los Amigurumis
                </h1>
                <p aria-live="polite" className="text-on-surface-variant font-body text-body-md mt-1.5">
                  <span className="font-semibold text-on-surface">{filteredProducts.length}</span>{" "}
                  {filteredProducts.length === 1
                    ? "producto tejido a mano"
                    : "productos tejidos a mano con amor"}
                  {activeCategory && ` en ${activeCategory}`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Layout: sidebar + contenido ───────────────── */}
          <div className="lg:flex lg:items-start lg:gap-8">
            {/* Sidebar de filtros (desktop, sticky) */}
            <aside
              aria-label="Filtros del catálogo"
              className="hidden lg:block lg:w-[272px] xl:w-[288px] lg:flex-shrink-0"
            >
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:overscroll-contain rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-card">
                <FilterPanel {...filterPanelProps} namePrefix="sidebar" />
              </div>
            </aside>

            {/* Columna de contenido */}
            <div className="flex-1 min-w-0">
              {/* ── Filters bar ────────────────────────────── */}
              <div className="space-y-4 mb-8">
                {/* Search */}
                <div
                  className="relative"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={(e) => {
                    // Mantener abierto si el focus se mueve dentro del grupo input + dropdown
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setIsSearchFocused(false);
                  }}
                >
                  <div
                    className={`flex items-center gap-3 w-full bg-surface-container-lowest rounded-2xl border transition-all duration-200 ${
                      isSearchFocused
                        ? "border-secondary ring-2 ring-secondary/20"
                        : "border-outline-variant/30 hover:border-outline-variant/60"
                    }`}
                    role="combobox"
                    aria-expanded={isSearchFocused && !searchQuery}
                    aria-haspopup="listbox"
                    aria-controls="popular-searches-listbox"
                    aria-label="Buscar productos"
                  >
                    <MdSearch className="text-on-surface-variant/50 ml-5 flex-shrink-0 w-5 h-5" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={onSearchInput}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setIsSearchFocused(false);
                          e.currentTarget.blur();
                        }
                      }}
                      placeholder="Buscar amigurumis, categorías..."
                      className="flex-1 bg-transparent font-body text-body-md text-on-surface placeholder:text-on-surface-variant/70 outline-none py-3.5 min-w-0"
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Buscar"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          pushUrl({ q: undefined });
                          searchInputRef.current?.focus();
                        }}
                        className="p-2 mr-2 hover:bg-surface-container rounded-full transition-colors flex-shrink-0"
                        aria-label="Limpiar búsqueda"
                      >
                        <MdClose className="w-4 h-4 text-on-surface-variant/60" />
                      </button>
                    )}
                  </div>

                  {/* Popular searches (only when focused + no query) */}
                  {isSearchFocused && !searchQuery && (
                    <div
                      id="popular-searches-listbox"
                      className="absolute top-full left-0 right-0 mt-1 z-30 bg-surface-container-lowest rounded-2xl shadow-elevation border border-outline-variant/20 p-4 animate-[search-slide-down_0.2s_cubic-bezier(0.16,1,0.3,1)]"
                      role="listbox"
                      aria-label="Búsquedas populares"
                    >
                      <p className="text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2.5">
                        Búsquedas populares
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            role="option"
                            onClick={() => {
                              handleSearchChange(term);
                              searchInputRef.current?.blur();
                              setIsSearchFocused(false);
                            }}
                            className="px-3.5 py-2 bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary text-sm font-body font-semibold rounded-full transition-all duration-200"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Toolbar: botón Filtros (mobile) + chips + sort */}
                <div className="flex items-start gap-3 flex-col sm:flex-row sm:items-center">
                  {/* Abrir filtros (solo mobile) */}
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex-shrink-0 relative inline-flex items-center gap-2 px-4 min-h-[44px] rounded-full text-sm font-semibold transition-all duration-200 border border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/40"
                    aria-label={`Abrir filtros${filterCount > 0 ? `, ${filterCount} filtros activos` : ""}`}
                  >
                    <MdOutlineFilterList className="w-4 h-4" />
                    Filtros
                    {filterCount > 0 && (
                      <span className="ml-0.5 w-5 h-5 bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full flex items-center justify-center">
                        {filterCount}
                      </span>
                    )}
                  </button>

                  {/* Active filters summary */}
                  <div className="flex-1 flex items-center gap-2 flex-wrap text-sm min-w-0">
                    {hasActiveFilters && (
                      <span className="text-on-surface-variant text-xs font-body">
                        Filtros activos:
                      </span>
                    )}
                    {activeCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-semibold">
                        {categoryIcon[activeCategory] && (
                          <span className="text-[12px]">{categoryIcon[activeCategory]}</span>
                        )}
                        {activeCategory}
                        <button
                          onClick={() => handleCategoryChange("")}
                          className="ml-0.5 hover:bg-secondary-container/60 rounded-full p-1.5"
                          aria-label={`Quitar filtro ${activeCategory}`}
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-container/40 text-tertiary text-xs font-semibold">
                        “{searchQuery}”
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            pushUrl({ q: undefined });
                          }}
                          className="ml-0.5 hover:bg-tertiary-container/60 rounded-full p-1.5"
                          aria-label="Quitar búsqueda"
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(priceMin || priceMax) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container/40 text-on-primary-container text-xs font-semibold">
                        {priceChipLabel(priceMin, priceMax)}
                        <button
                          onClick={() => {
                            setPriceMin("");
                            setPriceMax("");
                            pushUrl({ min: undefined, max: undefined });
                          }}
                          className="ml-0.5 hover:bg-primary-container/60 rounded-full p-1.5"
                          aria-label="Quitar filtro de precio"
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {activeSizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-semibold"
                      >
                        {sizeLabelBySlug[s]}
                        <button
                          onClick={() => handleSizesChange(activeSizes.filter((v) => v !== s))}
                          className="ml-0.5 hover:bg-secondary-container/60 rounded-full p-1.5"
                          aria-label={`Quitar filtro tamaño ${sizeLabelBySlug[s]}`}
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {activeTags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-container/40 text-tertiary text-xs font-semibold"
                      >
                        {tagLabelBySlug[t]}
                        <button
                          onClick={() => handleTagsChange(activeTags.filter((v) => v !== t))}
                          className="ml-0.5 hover:bg-tertiary-container/60 rounded-full p-1.5"
                          aria-label={`Quitar filtro ${tagLabelBySlug[t]}`}
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {sortOption !== "default" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container/40 text-on-primary-container text-xs font-semibold">
                        {sortOptions.find((o) => o.value === sortOption)?.label}
                        <button
                          onClick={() => handleSortChange("default")}
                          className="ml-0.5 hover:bg-primary-container/60 rounded-full p-1.5"
                          aria-label="Quitar ordenamiento"
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 rounded-full text-on-surface-variant hover:text-on-surface-variant hover:bg-surface-container/60 text-xs font-body transition-colors"
                      >
                        <MdFilterListOff className="w-3.5 h-3.5" />
                        Limpiar todo
                      </button>
                    )}
                  </div>

                  {/* Sort dropdown */}
                  <div
                    className="relative flex-shrink-0 w-full sm:w-auto z-30"
                    onKeyDown={(e) => {
                      if (e.key === "Escape" && showSortDropdown) {
                        setShowSortDropdown(false);
                        // Enfocar el botón ordenar tras cerrar
                        const btn = e.currentTarget.querySelector("button");
                        btn?.focus();
                      }
                    }}
                    onBlur={(e) => {
                      if (showSortDropdown && !e.currentTarget.contains(e.relatedTarget as Node)) {
                        setShowSortDropdown(false);
                      }
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSortDropdown(!showSortDropdown);
                      }}
                      className={`w-full sm:w-auto flex items-center gap-2 px-4 min-h-[44px] rounded-full text-sm font-semibold transition-all duration-200 border ${
                        sortOption !== "default"
                          ? "bg-secondary-container/40 text-secondary border-secondary/30"
                          : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-secondary-container/40"
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={showSortDropdown}
                      aria-controls="sort-options-listbox"
                      aria-label="Ordenar productos"
                    >
                      <MdOutlineFilterList className="w-4 h-4" />
                      <span className="flex-1 text-left">
                        {sortOptions.find((o) => o.value === sortOption)?.label || "Ordenar por"}
                      </span>
                      <MdExpandMore
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showSortDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showSortDropdown && (
                      <div
                        id="sort-options-listbox"
                        className="absolute top-full right-0 mt-1 z-30 w-[220px] bg-surface-container-lowest rounded-2xl shadow-elevation border border-outline-variant/20 py-2 animate-[search-slide-down_0.15s_cubic-bezier(0.16,1,0.3,1)]"
                        role="listbox"
                        aria-label="Opciones de orden"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            role="option"
                            aria-selected={sortOption === opt.value}
                            onClick={() => handleSortChange(opt.value)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors duration-150 ${
                              sortOption === opt.value
                                ? "bg-secondary-container/40 text-secondary font-semibold"
                                : "text-on-surface-variant hover:bg-surface-container/60"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Product Grid ──────────────────────────── */}
              {displayedProducts.length > 0 ? (
                <>
                  <h2 className="sr-only">Productos del catálogo</h2>
                  <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:justify-center">
                    {displayedProducts.map((product, i) => (
                      <ScrollReveal key={product.id} delay={Math.min(i + 1, 6)}>
                        <ProductCard
                          product={product}
                          isFavorite={!!favorites[product.id]}
                          onToggleFavorite={toggleFavorite}
                        />
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Load more */}
                  {hasMore && (
                    <div className="flex justify-center mt-10 sm:mt-12">
                      <button
                        onClick={handleLoadMore}
                        className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-surface-container-lowest rounded-full font-bold font-body text-sm text-on-surface border border-outline-variant/30 hover:border-secondary/40 hover:shadow-card transition-all duration-300 active:scale-[0.98]"
                      >
                        <span className="bg-secondary/10 text-secondary w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300">
                          +
                        </span>
                        <span>Cargar más productos</span>
                        <span className="text-on-surface-variant/80 text-xs font-normal">
                          ({remaining} restantes)
                        </span>
                      </button>
                    </div>
                  )}

                  {/* End notice */}
                  {!hasMore && filteredProducts.length > INITIAL_VISIBLE && (
                    <div className="flex items-center justify-center gap-3 mt-10 sm:mt-12 text-on-surface-variant/80 text-sm font-body">
                      <span className="h-px w-12 bg-outline-variant/30" />
                      Mostrando todos los {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "producto" : "productos"}
                      <span className="h-px w-12 bg-outline-variant/30" />
                    </div>
                  )}
                </>
              ) : (
                /* ── Empty state ──────────────────────────── */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        className="w-12 h-12 text-on-surface-variant/20"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="M16 16l4.5 4.5" />
                        <path d="M8 11h6" />
                      </svg>
                    </div>
                    <YarnBall
                      size={20}
                      className="absolute -top-1 -right-1 craft-float"
                      color="#acedfe"
                      opacity={0.3}
                    />
                  </div>

                  <h2 className="font-headline text-headline-md font-bold text-on-surface mb-2">
                    {searchQuery
                      ? `Sin resultados para "${searchQuery}"`
                      : "No hay productos con estos filtros"}
                  </h2>
                  <p className="font-body text-body-md text-on-surface-variant max-w-md mb-8">
                    {searchQuery
                      ? "Intentá con otra palabra o explorá nuestras categorías populares"
                      : "Probá con otro rango de precio o quitá alguno de los filtros aplicados"}
                  </p>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-secondary text-on-secondary px-6 py-3 rounded-full font-bold font-body text-sm tactile-press transition-all shadow-button hover:bg-secondary/90 inline-flex items-center gap-2"
                    >
                      <MdFilterListOff className="w-4 h-4" />
                      Limpiar filtros
                    </button>
                  )}

                  {!searchQuery && !activeCategory && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {popularSearches.slice(0, 4).map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchChange(term)}
                          className="px-3.5 py-2 bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary text-sm font-body font-semibold rounded-full transition-all duration-200"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filtros drawer (mobile) ───────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsFilterOpen(false)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filtros del catálogo"
        inert={!isFilterOpen}
        className={`fixed top-0 left-0 z-50 h-full w-[min(85vw,340px)] bg-surface-bright/98 backdrop-blur-2xl shadow-elevation flex flex-col lg:hidden ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-end px-6 py-4 border-b border-outline-variant/20">
          <button
            ref={filterCloseRef}
            onClick={() => setIsFilterOpen(false)}
            className="p-2 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 focus-ring"
            aria-label="Cerrar filtros"
          >
            <MdClose className="text-[22px] text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          <FilterPanel {...filterPanelProps} namePrefix="drawer" />
        </div>

        <div className="px-6 py-5 border-t border-outline-variant/20 bg-surface-container-low/50">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-secondary text-on-secondary px-5 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-secondary/90 transition-all active:scale-[0.97] tactile-press focus-ring"
          >
            Ver {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "producto" : "productos"}
          </button>
        </div>
      </aside>
    </main>
  );
}
