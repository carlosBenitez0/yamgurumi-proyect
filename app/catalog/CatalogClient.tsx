'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ui/ProductCard";
import { YarnBall, CrochetHook } from "@/components/ui/CraftBackground";
import {
  products as allProducts,
  categories,
  searchProducts,
  popularSearches,
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
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── State from URL ──────────────────────────────────── */

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = (searchParams.get("sort") as SortOption) || "default";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortOption, setSortOption] = useState<SortOption>(urlSort);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  /* ── Sync state → URL ────────────────────────────────── */

  const syncUrl = useCallback(
    (params: { q?: string; category?: string; sort?: string }) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, val]) => {
        if (val) sp.set(key, val);
        else sp.delete(key);
      });
      const qs = sp.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, pathname, router]
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

    // Sort
    result = sortProducts(result, sortOption);

    return result;
  }, [activeCategory, searchQuery, sortOption]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;
  const remaining = filteredProducts.length - visibleCount;
  const hasActiveFilters = !!activeCategory || !!searchQuery.trim() || sortOption !== "default";

  /* ── Handlers ─────────────────────────────────────────── */

  const handleCategoryChange = useCallback(
    (cat: string) => {
      const next = cat === activeCategory ? "" : cat;
      setActiveCategory(next);
      setVisibleCount(INITIAL_VISIBLE);
      syncUrl({ category: next || undefined });
    },
    [activeCategory, syncUrl]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setVisibleCount(INITIAL_VISIBLE);
      syncUrl({ q: value.trim() || undefined });
    },
    [syncUrl]
  );

  const handleSortChange = useCallback(
    (opt: SortOption) => {
      setSortOption(opt);
      setShowSortDropdown(false);
      syncUrl({ sort: opt === "default" ? undefined : opt });
    },
    [syncUrl]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("");
    setSortOption("default");
    setVisibleCount(INITIAL_VISIBLE);
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
        syncUrl({ q: v.trim() || undefined });
      }, 200);
    },
    [syncUrl]
  );

  /* ── Close sort dropdown on outside click ─────────────── */

  useEffect(() => {
    if (!showSortDropdown) return;
    const handler = () => setShowSortDropdown(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showSortDropdown]);

  /* ── Cleanup ──────────────────────────────────────────── */

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /* ── Render ───────────────────────────────────────────── */

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
                <p className="text-on-surface-variant font-body text-body-md mt-1.5">
                  <span className="font-semibold text-on-surface">{filteredProducts.length}</span>{" "}
                  {filteredProducts.length === 1
                    ? "producto tejido a mano"
                    : "productos tejidos a mano con amor"}
                  {activeCategory && ` en ${activeCategory}`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Filters bar ───────────────────────────────── */}
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
                aria-label="Buscar productos"
              >
                <MdSearch className="text-on-surface-variant/50 ml-5 flex-shrink-0 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={onSearchInput}
                  placeholder="Buscar amigurumis, categorías..."
                  className="flex-1 bg-transparent font-body text-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none py-3.5 min-w-0"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Buscar"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      syncUrl({ q: undefined });
                      searchInputRef.current?.focus();
                    }}
                    className="p-2 mr-2 hover:bg-surface-container rounded-full transition-colors flex-shrink-0"
                    aria-label="Limpiar búsqueda"
                  >
                    <MdClose className="w-4 h-4 text-on-surface-variant/60" />
                  </button>
                )}
                {/* Escape key handler */}
                {isSearchFocused && (
                  <button
                    tabIndex={-1}
                    style={{ display: "none" }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSearchFocused(false);
                        searchInputRef.current?.blur();
                      }
                    }}
                  />
                )}
              </div>

              {/* Popular searches (only when focused + no query) */}
              {isSearchFocused && !searchQuery && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 z-20 bg-surface-container-lowest rounded-2xl shadow-elevation border border-outline-variant/20 p-4 animate-[search-slide-down_0.2s_cubic-bezier(0.16,1,0.3,1)]"
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

            {/* Category pills + sort */}
            <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
              {/* Categories - scrollable */}
              <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 w-full sm:w-auto sm:mx-0 sm:px-0">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                    !activeCategory
                      ? "bg-secondary text-on-secondary shadow-button"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/40 border border-outline-variant/20"
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0 flex items-center gap-1.5 ${
                      activeCategory === cat.name
                        ? "bg-secondary text-on-secondary shadow-button"
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/40 border border-outline-variant/20"
                    }`}
                  >
                    <span className="text-[14px]">{categoryIcon[cat.name] || "🧵"}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <div
                className="relative flex-shrink-0 w-full sm:w-auto"
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
                  className={`w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    sortOption !== "default"
                      ? "bg-secondary-container/40 text-secondary border-secondary/30"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-secondary-container/40"
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={showSortDropdown}
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
                    className="absolute top-full right-0 mt-1 z-20 w-[220px] bg-surface-container-lowest rounded-2xl shadow-elevation border border-outline-variant/20 py-2 animate-[search-slide-down_0.15s_cubic-bezier(0.16,1,0.3,1)]"
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

            {/* Active filters summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span className="text-on-surface-variant text-xs font-body">Filtros activos:</span>
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
                        syncUrl({ q: undefined });
                      }}
                      className="ml-0.5 hover:bg-tertiary-container/60 rounded-full p-1.5"
                      aria-label="Quitar búsqueda"
                    >
                      <MdClose className="w-3 h-3" />
                    </button>
                  </span>
                )}
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
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-on-surface-variant hover:text-on-surface-variant hover:bg-surface-container/60 text-xs font-body transition-colors"
                >
                  <MdFilterListOff className="w-3.5 h-3.5" />
                  Limpiar todo
                </button>
              </div>
            )}
          </div>

          {/* ── Product Grid ──────────────────────────────── */}
          {displayedProducts.length > 0 ? (
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:justify-center"
              >
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
            /* ── Empty state ──────────────────────────────── */
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
                  : "No hay productos en esta categoría"}
              </h2>
              <p className="font-body text-body-md text-on-surface-variant max-w-md mb-8">
                {searchQuery
                  ? "Intentá con otra palabra o explorá nuestras categorías populares"
                  : "Pronto tendremos nuevos diseños disponibles. Mientras tanto, explorá otras categorías"}
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
    </main>
  );
}
