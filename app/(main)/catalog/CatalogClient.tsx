'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/ui/ProductCard";
import FilterPanel from "@/components/catalog/FilterPanel";
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
  MdAutoAwesome,
  MdLocalShipping,
  MdNavigateBefore,
  MdNavigateNext,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const AnimatedYarnThreads = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-25">
    <svg
      viewBox="0 0 1440 320"
      className="absolute top-0 left-0 w-full h-full object-cover"
      preserveAspectRatio="none"
    >
      <path
        d="M0,160 Q 360,120, 720,160 T 1440,160"
        fill="none"
        stroke="rgba(32, 103, 118, 0.2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-[soft-float_8s_ease-in-out_infinite]"
      />
      <path
        d="M0,190 Q 360,210, 720,190 T 1440,190"
        fill="none"
        stroke="rgba(196, 122, 108, 0.22)"
        strokeWidth="2"
        strokeDasharray="8 8"
        className="animate-[soft-float_10s_ease-in-out_infinite_reverse]"
      />
    </svg>
  </div>
);

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

const categoryIcon: Record<string, string> = {
  Muñecos: "🧸",
  Decoración: "🏡",
  Accesorios: "✨",
  Llaveros: "🔑",
  Navideño: "🎄",
  Infantil: "👶",
  "Plantas & Flores": "🌸",
  "Anime & Fanart": "⚡",
};

export default function CatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const categoryRowRef = useRef<HTMLDivElement>(null);

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = (searchParams.get("sort") as SortOption) || "default";
  const urlMin = searchParams.get("min") || "";
  const urlMax = searchParams.get("max") || "";
  const urlSizes = (searchParams.get("size") || "").split(",").filter(Boolean);
  const urlTags = (searchParams.get("tags") || "").split(",").filter(Boolean);
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlPerPage = Number(searchParams.get("perPage")) || 24;

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortOption, setSortOption] = useState<SortOption>(urlSort);
  const [priceMin, setPriceMin] = useState(urlMin);
  const [priceMax, setPriceMax] = useState(urlMax);
  const [activeSizes, setActiveSizes] = useState(urlSizes);
  const [activeTags, setActiveTags] = useState(urlTags);
  const [itemsPerPage, setItemsPerPage] = useState(urlPerPage);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  type UrlParams = {
    q?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    size?: string;
    tags?: string;
    page?: string;
    perPage?: string;
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

  const pushUrl = useCallback(
    (params: UrlParams) => {
      router.push(buildUrl(params), { scroll: false });
    },
    [buildUrl, router]
  );

  const replaceUrl = useCallback(
    (params: UrlParams) => {
      router.replace(buildUrl(params), { scroll: false });
    },
    [buildUrl, router]
  );

  const scrollCategoryRow = useCallback((direction: "left" | "right") => {
    if (!categoryRowRef.current) return;
    const amount = categoryRowRef.current.clientWidth * 0.6;
    categoryRowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      result = searchProducts(searchQuery.trim());
      if (activeCategory) {
        result = result.filter((p) => p.category === activeCategory);
      }
    }

    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    if (min > 0 || Number.isFinite(max)) {
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    if (activeSizes.length > 0) {
      result = result.filter((p) => activeSizes.includes(sizeSlugByLabel[p.size]));
    }

    if (activeTags.length > 0) {
      const labels = activeTags.map((t) => tagLabelBySlug[t]);
      result = result.filter((p) => labels.some((l) => p.tags.includes(l)));
    }

    result = sortProducts(result, sortOption);

    return result;
  }, [activeCategory, searchQuery, sortOption, priceMin, priceMax, activeSizes, activeTags]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const displayedProducts = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, safePage, itemsPerPage]);

  const hasActiveFilters =
    !!activeCategory ||
    !!searchQuery.trim() ||
    sortOption !== "default" ||
    !!priceMin ||
    !!priceMax ||
    activeSizes.length > 0 ||
    activeTags.length > 0;

  const filterCount =
    (activeCategory ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (sortOption !== "default" ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0) +
    (activeSizes.length ? 1 : 0) +
    (activeTags.length ? 1 : 0);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const target = Math.max(1, Math.min(newPage, totalPages));
      setCurrentPage(target);
      pushUrl({ page: target === 1 ? undefined : String(target) });
      gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [pushUrl, totalPages]
  );

  const handleItemsPerPageChange = useCallback(
    (count: number) => {
      setItemsPerPage(count);
      setCurrentPage(1);
      pushUrl({ perPage: count === 24 ? undefined : String(count), page: undefined });
    },
    [pushUrl]
  );

  const handleCategoryChange = useCallback(
    (cat: string) => {
      const next = cat === activeCategory ? "" : cat;
      setActiveCategory(next);
      setCurrentPage(1);
      pushUrl({ category: next || undefined, page: undefined });
    },
    [activeCategory, pushUrl]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
      replaceUrl({ q: value.trim() || undefined, page: undefined });
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

  const handleSizesChange = useCallback(
    (sizes: string[]) => {
      setActiveSizes(sizes);
      setCurrentPage(1);
      pushUrl({ size: sizes.length ? sizes.join(",") : undefined, page: undefined });
    },
    [pushUrl]
  );

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      setActiveTags(tags);
      setCurrentPage(1);
      pushUrl({ tags: tags.length ? tags.join(",") : undefined, page: undefined });
    },
    [pushUrl]
  );

  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitPrice = useCallback(
    (min?: string, max?: string) => {
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
      priceDebounceRef.current = setTimeout(() => {
        setCurrentPage(1);
        replaceUrl({ min, max, page: undefined });
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
    setCurrentPage(1);
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    router.replace(pathname, { scroll: false });
    searchInputRef.current?.focus();
  }, [pathname, router]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearchQuery(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setCurrentPage(1);
        replaceUrl({ q: v.trim() || undefined, page: undefined });
      }, 200);
    },
    [replaceUrl]
  );

  useEffect(() => {
    if (!showSortDropdown) return;
    const handler = () => setShowSortDropdown(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showSortDropdown]);

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

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    };
  }, []);

  const prevFilterKey = useRef("");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    const sort = (searchParams.get("sort") as SortOption) || "default";
    const min = searchParams.get("min") || "";
    const max = searchParams.get("max") || "";
    const sizes = (searchParams.get("size") || "").split(",").filter(Boolean);
    const tags = (searchParams.get("tags") || "").split(",").filter(Boolean);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 24;

    const key = [q, cat, sort, min, max, sizes.join(","), tags.join(",")].join("|");
    if (key !== prevFilterKey.current) {
      setCurrentPage(page);
      prevFilterKey.current = key;
    }

    setSearchQuery(q);
    setActiveCategory(cat);
    setSortOption(sort);
    setPriceMin(min);
    setPriceMax(max);
    setActiveSizes(sizes);
    setActiveTags(tags);
    setCurrentPage(page);
    setItemsPerPage(perPage);
  }, [searchParams]);

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
          
          {/* ── Rich Crafted Catalog Hero Banner ───────────────────── */}
          <div className="relative bg-gradient-to-b from-surface-container-high/90 via-surface-container to-surface-container-high rounded-3xl p-6 sm:p-10 border border-primary-container/25 overflow-hidden shadow-card mb-8 sm:mb-10">
            <AnimatedYarnThreads />

            <div className="absolute top-1/2 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-container/60 border border-secondary/30 text-secondary text-xs font-bold shadow-sm">
                  <MdAutoAwesome className="text-xs" />
                  <span>Catálogo Completo Yamgurumi Studio</span>
                </span>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">
                  Colección Tejida con Amor
                </h1>

                <p className="text-on-surface-variant font-body text-body-md leading-relaxed">
                  Cada amigurumi es confeccionado a mano punto a punto con hilos 100% de algodón orgánico e hipoalergénico. Encuentra tu muñeco o accesorio perfecto.
                </p>

                <div className="flex flex-wrap gap-3 pt-1 text-xs font-bold text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 border border-primary-container/20 shadow-sm">
                    🧶 100% Algodón Hipoalergénico
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 border border-primary-container/20 shadow-sm">
                    <MdLocalShipping className="text-secondary" />
                    Envíos a todo El Salvador 🇸🇻
                  </span>
                </div>
              </div>

              <div className="shrink-0 bg-surface-container-lowest/90 backdrop-blur-md p-5 rounded-2xl border border-primary-container/20 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="font-headline font-extrabold text-3xl text-secondary">
                  {filteredProducts.length}
                </span>
                <span className="text-xs font-bold text-on-surface-variant mt-0.5">
                  {filteredProducts.length === 1 ? "Amigurumi Listo" : "Amigurumis Listos"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Quick Category Filter Pills Carousel ───────────────────── */}
          <div className="relative mb-6 group/catrow">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => scrollCategoryRow("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-container-lowest text-secondary shadow-md border border-primary-container/25 hidden sm:flex items-center justify-center hover:bg-secondary hover:text-white transition-all tactile-press active:scale-90 cursor-pointer"
              title="Categorías anteriores"
              aria-label="Desplazar categorías a la izquierda"
            >
              <MdChevronLeft className="text-xl" />
            </button>

            {/* Scrollable Container with Smooth Scroll */}
            <div
              ref={categoryRowRef}
              className="overflow-x-auto scrollbar-hide py-1.5 px-0.5 scroll-smooth flex items-center gap-2.5"
            >
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 tactile-press cursor-pointer shrink-0 ${
                  !activeCategory
                    ? "bg-secondary text-white shadow-button ring-2 ring-secondary/20"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/20 border border-primary-container/25"
                }`}
              >
                <span>🧶 Todos ({allProducts.length})</span>
              </button>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 tactile-press cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-secondary text-white shadow-button ring-2 ring-secondary/20"
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-secondary-container/20 border border-primary-container/25"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-primary-container/20 text-on-surface-variant"}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => scrollCategoryRow("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-container-lowest text-secondary shadow-md border border-primary-container/25 hidden sm:flex items-center justify-center hover:bg-secondary hover:text-white transition-all tactile-press active:scale-90 cursor-pointer"
              title="Más categorías"
              aria-label="Desplazar categorías a la derecha"
            >
              <MdChevronRight className="text-xl" />
            </button>
          </div>

          {/* ── Layout: sidebar + contenido ───────────────── */}
          <div className="lg:flex lg:items-start lg:gap-8">
            <aside
              aria-label="Filtros del catálogo"
              className="hidden lg:block lg:w-[272px] xl:w-[288px] lg:flex-shrink-0"
            >
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:overscroll-contain rounded-3xl border border-primary-container/25 bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest to-surface-container-low/50 p-6 shadow-card">
                <FilterPanel {...filterPanelProps} namePrefix="sidebar" />
              </div>
            </aside>

            {/* Columna de contenido */}
            <div className="flex-1 min-w-0" ref={gridTopRef}>
              {/* ── Filters & Search Toolbar ──────────────── */}
              <div className="space-y-4 mb-8">
                <div
                  className="relative"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setIsSearchFocused(false);
                  }}
                >
                  <div
                    className={`flex items-center gap-3 w-full bg-surface-container-lowest rounded-2xl border transition-all duration-200 shadow-sm ${
                      isSearchFocused
                        ? "border-secondary ring-2 ring-secondary/20"
                        : "border-primary-container/25 hover:border-secondary/40"
                    }`}
                    role="combobox"
                    aria-expanded={isSearchFocused && !searchQuery}
                    aria-haspopup="listbox"
                    aria-controls="popular-searches-listbox"
                    aria-label="Buscar productos"
                  >
                    <MdSearch className="text-secondary ml-5 flex-shrink-0 w-5 h-5" />
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
                      placeholder="Buscar amigurumis por nombre, personaje o categoría..."
                      className="flex-1 bg-transparent font-body text-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none py-3.5 min-w-0"
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Buscar"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          pushUrl({ q: undefined, page: undefined });
                          searchInputRef.current?.focus();
                        }}
                        className="p-2 mr-2 hover:bg-surface-container rounded-full transition-colors flex-shrink-0"
                        aria-label="Limpiar búsqueda"
                      >
                        <MdClose className="w-4 h-4 text-on-surface-variant/60" />
                      </button>
                    )}
                  </div>

                  {isSearchFocused && !searchQuery && (
                    <div
                      id="popular-searches-listbox"
                      className="absolute top-full left-0 right-0 mt-1 z-30 bg-surface-container-lowest rounded-2xl shadow-elevation border border-primary-container/25 p-4 animate-[search-slide-down_0.2s_cubic-bezier(0.16,1,0.3,1)]"
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
                            className="px-3.5 py-2 bg-secondary-container/30 hover:bg-secondary text-secondary hover:text-white text-sm font-body font-semibold rounded-full transition-all duration-200 cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap text-sm min-w-0 flex-1">
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="lg:hidden flex-shrink-0 relative inline-flex items-center gap-2 px-4 min-h-[40px] rounded-full text-xs font-bold transition-all duration-200 border border-primary-container/30 bg-surface-container-lowest text-on-surface hover:bg-secondary-container/40 shadow-sm cursor-pointer"
                      aria-label={`Abrir filtros${filterCount > 0 ? `, ${filterCount} filtros activos` : ""}`}
                    >
                      <MdOutlineFilterList className="w-4 h-4 text-secondary" />
                      <span>Filtros</span>
                      {filterCount > 0 && (
                        <span className="ml-0.5 w-4 h-4 bg-tertiary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {filterCount}
                        </span>
                      )}
                    </button>

                    {hasActiveFilters && (
                      <span className="text-on-surface-variant text-xs font-body font-bold">
                        Filtros activos:
                      </span>
                    )}
                    {activeCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container/50 text-secondary border border-secondary/30 text-xs font-semibold">
                        {categoryIcon[activeCategory] && (
                          <span className="text-[12px]">{categoryIcon[activeCategory]}</span>
                        )}
                        {activeCategory}
                        <button
                          onClick={() => handleCategoryChange("")}
                          className="ml-0.5 hover:bg-secondary/20 rounded-full p-1 cursor-pointer"
                          aria-label={`Quitar filtro ${activeCategory}`}
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-container/50 text-tertiary border border-tertiary/30 text-xs font-semibold">
                        “{searchQuery}”
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            pushUrl({ q: undefined, page: undefined });
                          }}
                          className="ml-0.5 hover:bg-tertiary/20 rounded-full p-1 cursor-pointer"
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
                            pushUrl({ min: undefined, max: undefined, page: undefined });
                          }}
                          className="ml-0.5 hover:bg-primary-container/60 rounded-full p-1 cursor-pointer"
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
                          className="ml-0.5 hover:bg-secondary-container/60 rounded-full p-1 cursor-pointer"
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
                          className="ml-0.5 hover:bg-tertiary-container/60 rounded-full p-1 cursor-pointer"
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
                          className="ml-0.5 hover:bg-primary-container/60 rounded-full p-1 cursor-pointer"
                          aria-label="Quitar ordenamiento"
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-on-surface-variant hover:text-tertiary text-xs font-bold transition-colors cursor-pointer"
                      >
                        <MdFilterListOff className="w-3.5 h-3.5" />
                        Limpiar todo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Selector de items por página (Segmented Control uniforme) */}
                    <div className="inline-flex items-center p-1 rounded-full bg-surface-container-lowest border border-primary-container/25 shadow-sm">
                      <span className="px-2.5 py-1 text-on-surface-variant/70 text-xs font-headline font-bold hidden sm:inline">
                        Mostrar:
                      </span>
                      {[24, 48, 96].map((count) => (
                        <button
                          key={count}
                          onClick={() => handleItemsPerPageChange(count)}
                          className={`px-3 py-1 rounded-full text-xs font-headline font-bold transition-all duration-200 cursor-pointer ${
                            itemsPerPage === count
                              ? "bg-secondary text-white shadow-button"
                              : "text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>

                    {/* Dropdown de ordenamiento */}
                    <div
                      className="relative flex-shrink-0 z-30"
                      onKeyDown={(e) => {
                        if (e.key === "Escape" && showSortDropdown) {
                          setShowSortDropdown(false);
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
                        className={`flex items-center gap-2 px-4 min-h-[40px] rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer shadow-sm ${
                          sortOption !== "default"
                            ? "bg-secondary text-white border-secondary"
                            : "bg-surface-container-lowest text-on-surface border-primary-container/25 hover:border-secondary/40"
                        }`}
                        aria-haspopup="listbox"
                        aria-expanded={showSortDropdown}
                        aria-controls="sort-options-listbox"
                        aria-label="Ordenar productos"
                      >
                        <MdOutlineFilterList className="w-4 h-4" />
                        <span className="text-left">
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
                          className="absolute top-full right-0 mt-1 z-30 w-[220px] bg-surface-container-lowest rounded-2xl shadow-elevation border border-primary-container/25 py-2 animate-[search-slide-down_0.15s_cubic-bezier(0.16,1,0.3,1)]"
                          role="listbox"
                          aria-label="Opciones de orden"
                        >
                          {sortOptions.map((opt) => (
                            <button
                              key={opt.value}
                              role="option"
                              aria-selected={sortOption === opt.value}
                              onClick={() => handleSortChange(opt.value)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-body font-semibold transition-colors duration-150 cursor-pointer ${
                                sortOption === opt.value
                                  ? "bg-secondary-container/50 text-secondary"
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
              </div>

              {/* ── Product Grid ──────────────────────────── */}
              {displayedProducts.length > 0 ? (
                <>
                  <h2 className="sr-only">Productos del catálogo</h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] lg:justify-center">
                    {displayedProducts.map((product, i) => (
                      <ScrollReveal key={product.id} delay={Math.min((i % 6) + 1, 6)}>
                        <ProductCard
                          product={product}
                          isFavorite={!!favorites[product.id]}
                          onToggleFavorite={toggleFavorite}
                        />
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* ── Numbered Pagination Controls ─────────────────────── */}
                  {totalPages > 1 && (
                    <div className="mt-12 pt-8 border-t border-primary-container/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-on-surface-variant font-semibold text-center sm:text-left">
                        Mostrando <strong className="text-on-surface">{(safePage - 1) * itemsPerPage + 1}</strong> — <strong className="text-on-surface">{Math.min(safePage * itemsPerPage, filteredProducts.length)}</strong> de <strong className="text-secondary font-bold">{filteredProducts.length}</strong> amigurumis
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <button
                          onClick={() => handlePageChange(safePage - 1)}
                          disabled={safePage === 1}
                          className="p-2.5 rounded-full bg-surface-container-lowest border border-primary-container/25 text-on-surface hover:text-secondary disabled:opacity-40 disabled:pointer-events-none transition-all tactile-press active:scale-95 shadow-sm cursor-pointer"
                          aria-label="Página anterior"
                        >
                          <MdNavigateBefore className="text-xl" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          const isCurrent = pageNum === safePage;
                          
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= safePage - 1 && pageNum <= safePage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 tactile-press cursor-pointer ${
                                  isCurrent
                                    ? "bg-secondary text-white shadow-button ring-2 ring-secondary/30 scale-105"
                                    : "bg-surface-container-lowest text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 border border-primary-container/20"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }

                          if (
                            (pageNum === 2 && safePage > 3) ||
                            (pageNum === totalPages - 1 && safePage < totalPages - 2)
                          ) {
                            return (
                              <span key={pageNum} className="px-1 text-on-surface-variant/50 text-xs">
                                •••
                              </span>
                            );
                          }

                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(safePage + 1)}
                          disabled={safePage === totalPages}
                          className="p-2.5 rounded-full bg-surface-container-lowest border border-primary-container/25 text-on-surface hover:text-secondary disabled:opacity-40 disabled:pointer-events-none transition-all tactile-press active:scale-95 shadow-sm cursor-pointer"
                          aria-label="Página siguiente"
                        >
                          <MdNavigateNext className="text-xl" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ── Empty state ──────────────────────────── */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-3xl border border-primary-container/25 p-8 shadow-sm">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center text-5xl border-2 border-dashed border-secondary/40 shadow-inner craft-float">
                      🧶
                    </div>
                  </div>

                  <h2 className="font-headline text-xl font-bold text-on-surface mb-2">
                    {searchQuery
                      ? `Sin resultados para "${searchQuery}"`
                      : "No hay productos con estos filtros"}
                  </h2>
                  <p className="font-body text-body-sm text-on-surface-variant max-w-md mb-8">
                    {searchQuery
                      ? "Intentá con otra palabra o explorá nuestras categorías destacadas"
                      : "Probá con otro rango de precio o quitá alguno de los filtros aplicados"}
                  </p>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-secondary text-white px-6 py-3 rounded-full font-bold font-body text-sm tactile-press transition-all shadow-button hover:bg-secondary/90 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <MdFilterListOff className="w-4 h-4" />
                      <span>Limpiar filtros</span>
                    </button>
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-container/20">
          <span className="font-headline font-bold text-on-surface text-base">Filtros Yamgurumi</span>
          <button
            ref={filterCloseRef}
            onClick={() => setIsFilterOpen(false)}
            className="p-2 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Cerrar filtros"
          >
            <MdClose className="text-[22px] text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          <FilterPanel {...filterPanelProps} namePrefix="drawer" />
        </div>

        <div className="px-6 py-5 border-t border-primary-container/20 bg-surface-container-low/50">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-secondary text-white px-5 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-secondary/90 transition-all active:scale-[0.97] tactile-press cursor-pointer"
          >
            Ver {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "producto" : "productos"}
          </button>
        </div>
      </aside>
    </main>
  );
}
