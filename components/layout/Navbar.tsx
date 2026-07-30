"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  MdMenu,
  MdClose,
} from "react-icons/md";
import SearchModal from "@/components/ui/SearchModal";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalog" },
  { label: "Nuestra Historia", href: "/historia" },
];

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw";

/* ── SVG icons ──────────────────────────────────────────── */

const SearchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

const CartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ── Component ──────────────────────────────────────────── */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartCount] = useState(2);

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  /* ── Scroll tracking ──────────────────────────────────── */

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active link indicator ─────────────────────────────── */

  const moveIndicator = useCallback(() => {
    const link = linkRefs.current[activeIndex];
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!link || !nav || !indicator) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    indicator.style.left = `${linkRect.left - navRect.left}px`;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.opacity = "1";
  }, [activeIndex]);

  useEffect(() => {
    moveIndicator();
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [moveIndicator]);

  /* ── Body lock ─────────────────────────────────────────── */

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  /* ── Keyboard shortcut: Ctrl/Cmd + K ──────────────────── */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <>
      {/* ── Desktop bar ────────────────────────────────────── */}
      <header
        className={`fixed left-0 right-0 z-50 flex justify-center w-full px-4 sm:px-6 md:px-8 transition-all duration-500 ${
          isScrolled ? "top-3 sm:top-4" : "top-5 sm:top-8"
        }`}
      >
        <div
          className={`relative flex justify-between items-center w-full max-w-7xl transition-all duration-700 rounded-full ${
            isScrolled
              ? "bg-surface-bright/70 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(114,89,78,0.15)] border border-white/60"
              : "bg-surface-bright/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(114,89,78,0.1)] border border-white/40"
          }`}
          style={{ padding: "8px 20px" }}
        >
          {/* ── Yarn threads bg ─────────────────────────────── */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-full pointer-events-none -z-10 transition-opacity duration-700 ${
              isScrolled ? "opacity-5" : "opacity-15"
            }`}
          >
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <path
                d="M -50 20 Q 200 80, 400 20 T 900 20 T 1400 20"
                fill="transparent"
                stroke="#e3c2b4"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <animate
                  attributeName="d"
                  dur="8s"
                  repeatCount="indefinite"
                  values="
                    M -50 20 Q 200 80, 400 20 T 900 20 T 1400 20;
                    M -50 50 Q 200 10, 400 50 T 900 50 T 1400 50;
                    M -50 20 Q 200 80, 400 20 T 900 20 T 1400 20
                  "
                />
              </path>
              <path
                d="M -50 60 Q 300 10, 600 60 T 1200 60 T 1800 60"
                fill="transparent"
                stroke="#a28e83"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="8 8"
              >
                <animate
                  attributeName="d"
                  dur="12s"
                  repeatCount="indefinite"
                  values="
                    M -50 60 Q 300 10, 600 60 T 1200 60 T 1800 60;
                    M -50 30 Q 300 80, 600 30 T 1200 30 T 1800 30;
                    M -50 60 Q 300 10, 600 60 T 1200 60 T 1800 60
                  "
                />
              </path>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10" />
          </div>

          {/* ── Logo ────────────────────────────────────────── */}
          <Link
            href="/"
            className="group relative hover:scale-105 active:scale-95 transition-transform duration-300 flex-shrink-0 flex items-center"
          >
            <img
              alt="Yamgurumi Official Logo"
              src={LOGO_URL}
              className="h-10 sm:h-12 w-auto object-contain"
              style={{ borderRadius: "9999px" }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* ── Desktop nav links ───────────────────────────── */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center justify-center gap-2 lg:gap-3 relative"
          >
            {/* Sliding active indicator */}
            <div
              ref={indicatorRef}
              className="absolute bg-white/50 shadow-sm border border-white/50 backdrop-blur-sm rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] -z-10 opacity-0"
              style={{ height: "38px", top: "50%", transform: "translateY(-50%)" }}
            />
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                onClick={() => setActiveIndex(i)}
                className={`relative inline-flex items-center justify-center font-body text-[14px] font-bold tracking-wide transition-colors duration-300 whitespace-nowrap px-5 py-2 rounded-full ${
                  i === activeIndex
                    ? "text-secondary"
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Icon buttons ────────────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-primary flex-shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex relative p-2.5 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 items-center justify-center focus-ring tactile-press"
              aria-label="Buscar"
            >
              <SearchIcon className="w-5 h-5 text-secondary" />
            </button>

            <button
              className="relative p-2.5 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center focus-ring tactile-press"
              aria-label="Carrito de compras"
            >
              <CartIcon className="w-5 h-5 text-secondary" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-tertiary text-on-tertiary text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(129,82,76,0.3)] animate-[cart-bounce_2s_ease-in-out_infinite]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="p-2.5 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 hidden sm:flex items-center justify-center focus-ring tactile-press"
              aria-label="Mi cuenta"
            >
              <UserIcon className="w-5 h-5 text-secondary" />
            </button>

            <button
              className="md:hidden p-2 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center focus-ring"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileOpen ? (
                <MdClose className="text-[22px] text-secondary" />
              ) : (
                <MdMenu className="text-[22px] text-secondary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile backdrop ────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[min(85vw,340px)] bg-surface-bright/98 backdrop-blur-2xl shadow-elevation flex flex-col md:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
          <span className="font-headline text-headline-sm text-primary font-bold">
            Menú
          </span>
          <button
            onClick={closeMobile}
            className="p-2 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 focus-ring"
            aria-label="Cerrar menú"
          >
            <MdClose className="text-[22px] text-on-surface-variant" />
          </button>
        </div>

        {/* Drawer links with staggered entrance */}
        <div className="flex flex-col gap-1 px-4 py-6 flex-1">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-body text-body-md px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                i === activeIndex
                  ? "text-secondary font-bold bg-secondary-container/40"
                  : "text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20"
              } ${
                isMobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{
                transitionDelay: isMobileOpen ? `${80 + i * 60}ms` : "0ms",
                transitionProperty: "opacity, transform, color, background-color",
                transitionDuration: "400ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onClick={closeMobile}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-6 border-t border-outline-variant/20 bg-surface-container-low/50">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-secondary transition-colors duration-300 rounded-xl hover:bg-secondary-container/20 focus-ring"
            style={{
              transitionDelay: isMobileOpen ? `${80 + navLinks.length * 60}ms` : "0ms",
              opacity: isMobileOpen ? 1 : 0,
              transform: isMobileOpen ? "translateX(0)" : "translateX(8px)",
              transitionProperty: "opacity, transform, color, background-color",
              transitionDuration: "400ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <UserIcon className="w-5 h-5 text-secondary" />
            <span className="font-body text-body-sm font-medium">
              Mi cuenta / Iniciar sesión
            </span>
          </a>
        </div>
      </aside>

      {/* ── Search Modal ──────────────────────────────────── */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
