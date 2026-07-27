"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  searchProducts,
  searchCategories,
  popularSearches,
  RECENT_SEARCHES_KEY,
  MAX_RECENT_SEARCHES,
  type Product,
} from "@/data/products";

/* ── Types ────────────────────────────────────────────── */

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: "product" | "category";
  product?: Product;
  category?: { name: string; count: number; icon: string };
}

/* ── Helpers ──────────────────────────────────────────── */

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  const recent = getRecentSearches().filter((r) => r !== query);
  recent.unshift(query);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT_SEARCHES))
  );
}

function removeRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  const recent = getRecentSearches().filter((r) => r !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
}

/** Highlight matching text segments */
function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <>{text}</>;

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;

  let idx = lower.indexOf(q, lastIndex);
  while (idx !== -1) {
    if (idx > lastIndex) {
      parts.push({ text: text.slice(lastIndex, idx), highlight: false });
    }
    parts.push({ text: text.slice(idx, idx + q.length), highlight: true });
    lastIndex = idx + q.length;
    idx = lower.indexOf(q, lastIndex);
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return (
    <>
      {parts.map((p, i) =>
        p.highlight ? (
          <mark key={i} className="bg-secondary-container/60 text-secondary rounded-sm px-0.5">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

/* ── Main Component ───────────────────────────────────── */

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [categoryResults, setCategoryResults] = useState<
    { name: string; count: number; icon: string }[]
  >([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  /* ── Flatten all navigable items for keyboard ────────── */

  const allItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];
    categoryResults.forEach((c) => items.push({ type: "category", category: c }));
    productResults.forEach((p) => items.push({ type: "product", product: p }));
    return items;
  }, [productResults, categoryResults]);

  const totalItems = allItems.length;
  const hasQuery = query.trim().length > 0;
  const hasResults = totalItems > 0;

  /* ── Open / Close ────────────────────────────────────── */

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setQuery("");
      setProductResults([]);
      setCategoryResults([]);
      setActiveIndex(-1);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ── Debounced search ────────────────────────────────── */

  const doSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setProductResults([]);
      setCategoryResults([]);
      setActiveIndex(-1);
      return;
    }
    setProductResults(searchProducts(trimmed));
    setCategoryResults(searchCategories(trimmed));
    setActiveIndex(-1);
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => doSearch(value), 150);
    },
    [doSearch]
  );

  /* ── Navigation ──────────────────────────────────────── */

  const navigateTo = useCallback(
    (path: string) => {
      onClose();
      router.push(path);
    },
    [onClose, router]
  );

  const selectItem = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalItems) return;
      const item = allItems[index];
      if (item.type === "product" && item.product) {
        saveRecentSearch(query);
        navigateTo(`/catalogo?producto=${item.product.slug}`);
      } else if (item.type === "category" && item.category) {
        saveRecentSearch(query);
        navigateTo(`/catalogo?categoria=${item.category.name}`);
      }
    },
    [allItems, totalItems, query, navigateTo]
  );

  const submitQuery = useCallback(() => {
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    navigateTo(`/catalogo?q=${encodeURIComponent(query.trim())}`);
  }, [query, navigateTo]);

  /* ── Keyboard ────────────────────────────────────────── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % totalItems);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0) {
            selectItem(activeIndex);
          } else {
            submitQuery();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [activeIndex, totalItems, selectItem, submitQuery, onClose]
  );

  /* ── Scroll active item into view ────────────────────── */

  useEffect(() => {
    if (activeIndex < 0) return;
    const el = listRef.current?.querySelector(`[data-result-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* ── Recent search actions ───────────────────────────── */

  const handleRemoveRecent = useCallback((e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }, []);

  const handleRecentClick = useCallback((term: string) => {
    setQuery(term);
    doSearch(term);
    inputRef.current?.focus();
  }, [doSearch]);

  /* ── Don't render if not open ────────────────────────── */

  if (!isOpen) return null;

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" role="dialog" aria-modal="true" aria-label="Buscar productos">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-md animate-[search-fade-in_0.25s_ease-out]"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative flex flex-col w-full max-h-full animate-[search-slide-down_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Search input area */}
        <div className="w-full bg-surface-bright/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-elevation">
          <div className="section-container py-4 sm:py-5">
            <div className="max-w-3xl mx-auto flex items-center gap-3 sm:gap-4">
              {/* Search icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5 sm:w-6 sm:h-6 text-on-surface-variant/50 flex-shrink-0">
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16l4.5 4.5" />
              </svg>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar amigurumis, categorías..."
                className="flex-1 bg-transparent font-body text-lg sm:text-xl text-on-surface placeholder:text-on-surface-variant/40 outline-none min-w-0"
                autoComplete="off"
                spellCheck={false}
              />

              {/* Clear */}
              {hasQuery && (
                <button
                  onClick={() => {
                    setQuery("");
                    setProductResults([]);
                    setCategoryResults([]);
                    setActiveIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 hover:bg-surface-container rounded-full transition-colors duration-200 flex-shrink-0"
                  aria-label="Limpiar búsqueda"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-on-surface-variant">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold text-on-surface-variant/60 hover:text-on-surface-variant bg-surface-container/60 hover:bg-surface-container rounded-full transition-colors duration-200 flex-shrink-0"
              >
                ESC
              </button>

              <button
                onClick={onClose}
                className="sm:hidden p-2 hover:bg-surface-container rounded-full transition-colors duration-200 flex-shrink-0"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-on-surface-variant">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results area */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overscroll-contain bg-surface-bright/90 backdrop-blur-xl"
        >
          <div className="section-container py-4 sm:py-6">
            <div className="max-w-3xl mx-auto">

              {/* ── Empty state: no query ──────────────────── */}
              {!hasQuery && (
                <div className="space-y-8">
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h3 className="text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant/60 mb-3 px-1">
                        Búsquedas recientes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleRecentClick(term)}
                            className="group flex items-center gap-1.5 px-3.5 py-2 bg-surface-container/70 hover:bg-secondary-container/40 text-on-surface-variant hover:text-secondary text-sm font-body font-medium rounded-full transition-all duration-200"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {term}
                            <span
                              onClick={(e) => handleRemoveRecent(e, term)}
                              className="ml-0.5 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-secondary-container/60 transition-all duration-150"
                              aria-label={`Eliminar "${term}" de recientes`}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular searches */}
                  <div>
                    <h3 className="text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant/60 mb-3 px-1">
                      Búsquedas populares
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRecentClick(term)}
                          className="px-3.5 py-2 bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary text-sm font-body font-semibold rounded-full transition-all duration-200 hover:shadow-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick tips */}
                  <div className="pt-2 border-t border-outline-variant/15">
                    <p className="text-xs text-on-surface-variant/40 font-body text-center">
                      Escribe para buscar entre todos nuestros amigurumis
                    </p>
                  </div>
                </div>
              )}

              {/* ── Results ────────────────────────────────── */}
              {hasQuery && hasResults && (
                <div className="space-y-6">
                  {/* Categories */}
                  {categoryResults.length > 0 && (
                    <div>
                      <h3 className="text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant/60 mb-2 px-1">
                        Categorías
                      </h3>
                      <div className="space-y-1">
                        {categoryResults.map((cat) => {
                          const itemIndex = allItems.findIndex(
                            (r) => r.type === "category" && r.category?.name === cat.name
                          );
                          return (
                            <button
                              key={cat.name}
                              data-result-index={itemIndex}
                              onClick={() => {
                                saveRecentSearch(query);
                                navigateTo(`/catalogo?categoria=${cat.name}`);
                              }}
                              onMouseEnter={() => setActiveIndex(itemIndex)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${
                                activeIndex === itemIndex
                                  ? "bg-secondary-container/40 text-secondary"
                                  : "hover:bg-surface-container/60 text-on-surface-variant"
                              }`}
                            >
                              <span className="text-lg">{cat.icon}</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-body text-sm font-semibold block truncate">
                                  <HighlightedText text={cat.name} query={query} />
                                </span>
                              </div>
                              <span className="text-xs text-on-surface-variant/50 font-body flex-shrink-0">
                                {cat.count} modelos
                              </span>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 opacity-30 flex-shrink-0">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {productResults.length > 0 && (
                    <div>
                      <h3 className="text-xs font-label font-semibold uppercase tracking-widest text-on-surface-variant/60 mb-2 px-1">
                        Productos
                      </h3>
                      <div className="space-y-1">
                        {productResults.map((product) => {
                          const itemIndex = allItems.findIndex(
                            (r) => r.type === "product" && r.product?.id === product.id
                          );
                          return (
                            <button
                              key={product.id}
                              data-result-index={itemIndex}
                              onClick={() => {
                                saveRecentSearch(query);
                                navigateTo(`/catalogo?producto=${product.slug}`);
                              }}
                              onMouseEnter={() => setActiveIndex(itemIndex)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${
                                activeIndex === itemIndex
                                  ? "bg-secondary-container/40"
                                  : "hover:bg-surface-container/60"
                              }`}
                            >
                              {/* Product image */}
                              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>

                              {/* Product info */}
                              <div className="flex-1 min-w-0">
                                <span className="font-body text-sm font-semibold text-on-surface block truncate">
                                  <HighlightedText text={product.name} query={query} />
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-on-surface-variant/60 font-body">
                                    {product.category}
                                  </span>
                                  <span className="text-[10px] text-on-surface-variant/30">•</span>
                                  <span className="flex items-center gap-0.5 text-xs text-on-surface-variant/60 font-body">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#e6a817]">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    {product.rating}
                                  </span>
                                </div>
                              </div>

                              {/* Price */}
                              <span className="font-headline text-sm font-bold text-primary flex-shrink-0">
                                ${product.price.toFixed(2)}
                              </span>

                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 opacity-30 flex-shrink-0">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── No results ─────────────────────────────── */}
              {hasQuery && !hasResults && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 mb-5 rounded-full bg-surface-container flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-10 h-10 text-on-surface-variant/30">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M16 16l4.5 4.5" />
                      <path d="M8 11h6" />
                    </svg>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
                    Sin resultados para &ldquo;{query}&rdquo;
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant/60 max-w-xs mb-6">
                    Intenta con otra búsqueda o explora nuestras categorías
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="px-3.5 py-2 bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary text-sm font-body font-semibold rounded-full transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
