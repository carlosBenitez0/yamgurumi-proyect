"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import {
  MdShoppingBag,
  MdFavorite,
  MdPerson,
  MdLogout,
  MdStorefront,
  MdLocationOn,
  MdConfirmationNumber,
  MdCheckCircle,
  MdLocalShipping,
  MdContentCopy,
  MdAutoAwesome,
  MdEmail,
  MdCalendarToday,
  MdVerified,
  MdEdit,
  MdClose,
  MdAddLocation,
  MdChat,
  MdContentCut,
  MdCameraAlt,
  MdAddShoppingCart,
  MdDeleteOutline,
  MdStar,
  MdStarBorder,
  MdShield,
  MdBadge,
} from "react-icons/md";
import { updateProfileAction } from "@/src/actions/user/update-profile";
import { saveAddressAction } from "@/src/actions/user/save-address";
import { deleteAddressAction } from "@/src/actions/user/delete-address";
import { setDefaultAddressAction } from "@/src/actions/user/set-default-address";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/products";
import { useFavoritesStore } from "@/src/store/useFavoritesStore";
import { useCartStore } from "@/lib/cart-store";
import { updateAvatarAction } from "@/src/actions/user/update-avatar";

export interface SerializedOrder {
  id: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  zone: string;
  whatsappUrl: string;
}

export interface SerializedAddress {
  id: string;
  name: string;
  phone: string;
  zone: string;
  notes: string | null;
  isDefault: boolean;
}

export interface SerializedDiscountCode {
  code: string;
  percent: number;
  usedCount: number;
  usageLimit: number;
  expiresAt: string | null;
}

export interface MiTallerClientProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
    role: "CUSTOMER" | "ADMIN";
    formattedDate: string;
    orders: SerializedOrder[];
    addresses: SerializedAddress[];
    discountCodes: SerializedDiscountCode[];
    favorites?: string[];
  };
  logoutAction: () => Promise<void>;
}

export default function MiTallerClient({ user, logoutAction }: MiTallerClientProps) {
  const [activeTab, setActiveTab] = useState<"pedidos" | "favoritos" | "beneficios" | "direcciones" | "perfil">("pedidos");

  // Conectar con Store de Favoritos & Carrito
  const storeFavoriteProducts = useFavoritesStore((s) => s.favoriteProducts);
  const fetchFavorites = useFavoritesStore((s) => s.fetchFavorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SerializedAddress | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDeleteAddress = (addressId: string) => {
    startTransition(async () => {
      const res = await deleteAddressAction(addressId);
      if (res.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({ type: "success", text: "¡Dirección eliminada correctamente! 🗑️" });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    startTransition(async () => {
      const res = await setDefaultAddressAction(addressId);
      if (res.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({ type: "success", text: "¡Dirección principal actualizada! 👑" });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    });
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Referencias para animaciones GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const yarnSvgRef = useRef<SVGSVGElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const userInfoRef = useRef<HTMLDivElement>(null);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const tabsBarRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  const [isSwitchingTab, setIsSwitchingTab] = useState(false);

  // Animación de entrada inicial maestra con GSAP (Ultra rápida, fluida y procedimental)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Entrada de la Tarjeta Hero Principal
      if (heroCardRef.current) {
        tl.fromTo(
          heroCardRef.current,
          { opacity: 0, y: 25, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, clearProps: "all" }
        );
      }

      // 2. Trazo de hilo artesanal en el SVG
      if (yarnSvgRef.current) {
        const paths = yarnSvgRef.current.querySelectorAll("path");
        paths.forEach((path) => {
          try {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            tl.to(
              path,
              { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" },
              "-=0.25"
            );
          } catch (e) {
            // Fallback
          }
        });
      }

      // 3. Avatar Elastic Pop
      if (avatarRef.current) {
        tl.fromTo(
          avatarRef.current,
          { scale: 0, opacity: 0, rotate: -12 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.35, ease: "back.out(1.8)", clearProps: "all" },
          "-=0.35"
        );
      }

      // 4. Datos del usuario y barra de nivel
      if (userInfoRef.current) {
        tl.fromTo(
          userInfoRef.current.children,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.25, stagger: 0.03, clearProps: "all" },
          "-=0.25"
        );
      }

      // 5. Botones de acción del Hero (Editar Datos, Ir al Catálogo, Salir)
      if (heroActionsRef.current) {
        tl.fromTo(
          heroActionsRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.03, clearProps: "all" },
          "-=0.2"
        );
      }

      // 6. Olas en las 4 métricas del Dashboard (Mis Pedidos, Colección, Club, Dirección)
      if (metricsRef.current) {
        tl.fromTo(
          metricsRef.current.children,
          { opacity: 0, y: 15, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(1.3)", clearProps: "all" },
          "-=0.15"
        );
      }

      // 7. Barra de Navegación por Pestañas (Pill Tabs bar + botones + íconos + badges)
      if (tabsBarRef.current) {
        tl.fromTo(
          tabsBarRef.current.children,
          { opacity: 0, y: 12, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.03, ease: "back.out(1.2)", clearProps: "all" },
          "-=0.15"
        );
      }

      // 8. Contenido Principal de la Pestaña Activa
      if (tabContentRef.current) {
        tl.fromTo(
          tabContentRef.current,
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out", clearProps: "all" },
          "-=0.1"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Función controladora para cambiar de pestaña con transición de salida y entrada (Exit & Entrance GSAP)
  const handleTabChange = (nextTab: typeof activeTab) => {
    if (nextTab === activeTab || isSwitchingTab) return;
    setIsSwitchingTab(true);

    if (tabContentRef.current) {
      // 1. Animación de Salida (Exit)
      gsap.to(tabContentRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.98,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          setActiveTab(nextTab);
        },
      });
    } else {
      setActiveTab(nextTab);
    }
  };

  // Animación de Entrada al cambiar de pestaña en GSAP (Sin doble animación ni parpadeos)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (!tabContentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tabContentRef.current,
        { opacity: 0, y: 14, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => setIsSwitchingTab(false),
        }
      );
      return () => ctx.revert();
    }, tabContentRef);
  }, [activeTab]);

  // Hover suave con GSAP (0.25s de elevación fluida en 60 FPS sin saltos instantáneos)
  const handleCardMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: -5, duration: 0.25, ease: "power2.out", overwrite: "auto" });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
  };

  const [isPending, startTransition] = useTransition();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploadingAvatar(true);
    startTransition(async () => {
      const res = await updateAvatarAction(formData);
      setIsUploadingAvatar(false);
      if (res.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({ type: "success", text: "¡Foto de perfil actualizada con éxito! 📸✨" });
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const statusMap: Record<SerializedOrder["status"], { label: string; step: number; color: string; bg: string }> = {
    PENDING: { label: "En Telar 🧵", step: 2, color: "text-amber-800", bg: "bg-amber-100 border-amber-300" },
    CONFIRMED: { label: "Confirmado ✨", step: 1, color: "text-blue-800", bg: "bg-blue-100 border-blue-300" },
    SHIPPED: { label: "En Camino 📦", step: 3, color: "text-purple-800", bg: "bg-purple-100 border-purple-300" },
    DELIVERED: { label: "Entregado 💖", step: 4, color: "text-emerald-800", bg: "bg-emerald-100 border-emerald-300" },
    CANCELLED: { label: "Cancelado", step: 0, color: "text-rose-800", bg: "bg-rose-100 border-rose-300" },
  };

  // Nivel del artesano basado en actividad
  const orderCount = user.orders.length;
  const userTier = orderCount >= 5 
    ? { title: "Maestro Amigurumi 👑", next: "¡Nivel Máximo!", percent: 100 }
    : orderCount >= 2 
      ? { title: "Tejedor Creativo 🧶", next: "3 pedidos para Maestro", percent: (orderCount / 5) * 100 }
      : { title: "Aprendiz de Telar ⭐", next: "1 pedido para Tejedor Creativo", percent: 25 };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProfileAction(formData);
      if (res?.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({ type: "success", text: "¡Nombre actualizado con éxito! ✨" });
        setIsEditProfileOpen(false);
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    });
  };

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveAddressAction(formData);
      if (res?.error) {
        setFeedbackMsg({ type: "error", text: res.error });
      } else {
        setFeedbackMsg({ type: "success", text: "¡Dirección guardada correctamente! 📍" });
        setIsAddressModalOpen(false);
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-body relative overflow-x-hidden">
      
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div className="fixed top-20 right-4 z-50 animate-[hero-fade-up_0.3s_ease] max-w-sm">
          <div className={`px-5 py-3.5 rounded-2xl shadow-elevation border flex items-center gap-3 backdrop-blur-md ${
            feedbackMsg.type === "success" 
              ? "bg-secondary/95 text-white border-secondary-container" 
              : "bg-error text-white border-error-container"
          }`}>
            <MdAutoAwesome className="text-xl shrink-0" />
            <span className="text-sm font-bold">{feedbackMsg.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ── Encabezado Principal Artesanal (Hero Card) ─────── */}
        <div ref={heroCardRef} className="relative bg-surface-container-lowest p-6 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 overflow-hidden group">
          
          {/* Animated Yarn Threads SVG Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <svg ref={yarnSvgRef} width="100%" height="100%" preserveAspectRatio="none">
              <path
                d="M -20 30 Q 150 90, 350 30 T 750 30 T 1150 30"
                fill="transparent"
                stroke="#e3c2b4"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="yarn-path"
              />
              <path
                d="M -20 70 Q 250 10, 550 70 T 1050 70"
                fill="transparent"
                stroke="#206776"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="opacity-40"
              />
            </svg>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
            
            {/* Avatar / Foto de perfil con halo & badge */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div 
                ref={avatarRef}
                className="relative group/avatar cursor-pointer" 
                onClick={() => avatarInputRef.current?.click()}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-surface-container to-primary-container/40 border-2 border-dashed border-secondary/40 rounded-full flex items-center justify-center text-secondary shadow-inner relative overflow-hidden transition-transform duration-300 group-hover/avatar:scale-105">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Foto de perfil"}
                      fill
                      sizes="(min-width: 640px) 112px, 96px"
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="font-headline font-bold text-3xl sm:text-4xl text-secondary">
                      {user.name ? user.name.charAt(0).toUpperCase() : "Y"}
                    </span>
                  )}
                  {/* Overlay con ícono de cámara al pasar el cursor */}
                  <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px] opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity duration-300 rounded-full">
                    <MdCameraAlt className="text-xl" />
                    <span className="text-[10px] mt-0.5">Cambiar</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    avatarInputRef.current?.click();
                  }}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 p-2 bg-secondary text-white rounded-full shadow-md hover:bg-secondary/90 transition-all tactile-press cursor-pointer disabled:opacity-50"
                  title="Cambiar foto de perfil"
                >
                  <MdCameraAlt className="text-sm" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div ref={userInfoRef} className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
                    {user.name || "Artesano Yamgurumi"}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary-container/60 text-on-secondary-container border border-secondary/20 shadow-sm">
                    <MdVerified className="text-secondary text-sm" />
                    {user.role === "ADMIN" ? "Administrador 👑" : userTier.title}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-body-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5">
                    <MdEmail className="text-primary text-base" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                    <MdCalendarToday className="text-secondary text-sm" />
                    Desde {user.formattedDate}
                  </span>
                </div>

                {/* Progress bar de nivel */}
                <div className="w-full max-w-xs pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-on-surface-variant mb-1">
                    <span>Nivel Artesanal</span>
                    <span>{userTier.next}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-primary-container/20">
                    <div 
                      className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${userTier.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones del encabezado */}
            <div ref={heroActionsRef} className="flex flex-wrap items-center justify-center gap-3 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-primary-container/30 text-on-surface font-bold text-sm transition-all tactile-press active:scale-95 shadow-sm"
              >
                <MdEdit className="text-base text-secondary" />
                <span>Editar Datos</span>
              </button>

              <Link 
                href="/catalog" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-sm shadow-button hover:bg-secondary/90 transition-all tactile-press active:scale-95"
              >
                <MdStorefront className="text-lg" />
                <span>Ir al Catálogo</span>
              </Link>

              <form action={logoutAction}>
                <button 
                  type="submit" 
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-error/10 text-error border border-error/20 font-bold text-sm hover:bg-error hover:text-white transition-all duration-300 tactile-press active:scale-95 shadow-sm"
                >
                  <MdLogout className="text-lg" />
                  <span>Salir</span>
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* ── Dashboard Grid / Métricas de Actividad ────────── */}
        <div ref={metricsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { id: "pedidos", label: "Mis Pedidos", icon: MdShoppingBag, value: user.orders.length, sub: "Historial de compras", color: "secondary" },
            { id: "favoritos", label: "Colección", icon: MdFavorite, value: storeFavoriteProducts.length ? `${storeFavoriteProducts.length} Favoritos` : "0 Favoritos", sub: "Guardados para después", color: "tertiary" },
            { id: "beneficios", label: "Club Yamgurumi", icon: MdConfirmationNumber, value: user.discountCodes.length ? `${user.discountCodes.length} Cupones` : "VIP", sub: "Beneficios exclusivos", color: "primary" },
            { id: "direcciones", label: "Dirección Envío", icon: MdLocationOn, value: user.addresses.length ? "Registrada" : "Sin registrar", sub: "Zonas de entrega", color: "secondary" },
          ].map((card) => {
            const Icon = card.icon;
            const isActive = activeTab === card.id;
            return (
              <div 
                key={card.id}
                onClick={() => handleTabChange(card.id as any)}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                className={`p-5 rounded-3xl border transition-colors duration-300 cursor-pointer tactile-press ${
                  isActive
                    ? "bg-surface-container-lowest border-secondary shadow-card ring-2 ring-secondary/20"
                    : "bg-surface-container-lowest/90 border-primary-container/20 hover:border-secondary/30 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${
                    isActive ? "bg-secondary text-white" : "bg-secondary-container/40 text-secondary"
                  }`}>
                    <Icon />
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant border border-primary-container/20">
                    {card.value}
                  </span>
                </div>
                <p className="font-headline text-base font-bold text-on-surface">{card.label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{card.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Navegación de Pestañas (Clean Minimalist Tab Pills) ────────── */}
        <div
          ref={tabsBarRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 border-b border-primary-container/20"
        >
          {[
            { id: "pedidos", label: "Mis Pedidos", icon: MdShoppingBag, badge: user.orders.length },
            { id: "favoritos", label: "Favoritos", icon: MdFavorite, badge: storeFavoriteProducts.length || undefined },
            { id: "beneficios", label: "Club & Cupones", icon: MdConfirmationNumber, badge: user.discountCodes.length || undefined },
            { id: "direcciones", label: "Dirección de Envío", icon: MdLocationOn },
            { id: "perfil", label: "Datos de Cuenta", icon: MdPerson },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 tactile-press cursor-pointer ${
                  isActive
                    ? "bg-secondary text-white shadow-button"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 border border-primary-container/20"
                }`}
              >
                <Icon className="text-base sm:text-lg" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-secondary/15 text-secondary"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Contenido Principal de las Pestañas ───────────── */}
        <div ref={tabContentRef} className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-card border border-primary-container/20 transition-all duration-500 min-h-[380px]">
          
          {/* TAB 1: MIS PEDIDOS Y TIMELINE DE ELABORACIÓN */}
          {activeTab === "pedidos" && (
            <div className="space-y-8 animate-[hero-fade-up_0.4s_cubic-bezier(0.16,1,0.3,1)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-primary-container/20 pb-4 gap-2">
                <div>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">Historial de Encargos</h2>
                  <p className="text-body-sm text-on-surface-variant">Monitorea cada etapa del tejido a mano de tus amigurumis.</p>
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline bg-secondary-container/30 px-3.5 py-1.5 rounded-full"
                >
                  <MdStorefront />
                  <span>Nuevo pedido</span>
                </Link>
              </div>

              {user.orders.length > 0 ? (
                <div className="space-y-6">
                  {user.orders.map((order) => {
                    const st = statusMap[order.status] || statusMap.PENDING;
                    return (
                      <div 
                        key={order.id}
                        className="p-6 rounded-3xl border border-primary-container/20 bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-all duration-300 space-y-6 shadow-sm"
                      >
                        {/* Cabecera del pedido */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary-container/20 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-extrabold text-secondary">
                                Encargo #{order.id.slice(-6).toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color}`}>
                                {st.label}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-1">
                              Zona: <strong>{order.zone}</strong> · Registrado el {new Date(order.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-on-surface-variant block">Monto Total</span>
                            <span className="font-headline font-extrabold text-xl text-secondary">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Craft Timeline visual 4 etapas */}
                        <div className="py-2">
                          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-1.5">
                            <MdContentCut className="text-secondary text-sm" />
                            <span>Proceso de Elaboración Artesanal</span>
                          </p>
                          
                          <div className="grid grid-cols-4 gap-2 text-center relative">
                            {/* Línea conectora */}
                            <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-surface-container-high -z-0">
                              <div 
                                className="h-full bg-secondary transition-all duration-700"
                                style={{ width: st.step === 4 ? "100%" : st.step === 3 ? "66%" : st.step === 2 ? "33%" : "0%" }}
                              />
                            </div>

                            {[
                              { num: 1, title: "Recibido", icon: "📝" },
                              { num: 2, title: "Tejiendo", icon: "🧵" },
                              { num: 3, title: "Empacado", icon: "📦" },
                              { num: 4, title: "Entregado", icon: "💖" },
                            ].map((step) => {
                              const isDone = st.step >= step.num;
                              const isCurrent = st.step === step.num;
                              return (
                                <div key={step.num} className="relative z-10 flex flex-col items-center space-y-1.5">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    isCurrent 
                                      ? "bg-secondary text-white ring-4 ring-secondary/20 scale-110 shadow-md" 
                                      : isDone 
                                        ? "bg-secondary-container text-secondary" 
                                        : "bg-surface-container-high text-on-surface-variant/50"
                                  }`}>
                                    {step.icon}
                                  </div>
                                  <span className={`text-[11px] font-bold ${isCurrent ? "text-secondary" : "text-on-surface-variant"}`}>
                                    {step.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Botón WhatsApp de Consulta de Avances */}
                        <div className="flex justify-end pt-2">
                          <a
                            href={`https://wa.me/50377311064?text=${encodeURIComponent(
                              `¡Hola Yamgurumi! Quisiera consultar el estado y los avances de mi encargo #${order.id.slice(-6).toUpperCase()}. ¿Cómo va la elaboración de mi amigurumi?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#075e54] hover:bg-[#054f47] text-white text-xs font-bold transition-all tactile-press shadow-sm"
                          >
                            <MdChat className="text-base" />
                            <span>Consultar Avances en WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state con animación craft-float */
                <div className="py-12 text-center space-y-5 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-secondary-container/30 text-secondary rounded-full flex items-center justify-center text-5xl mx-auto border-2 border-dashed border-secondary/40 shadow-inner craft-float">
                    🧶
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline text-xl font-bold text-on-surface">Tu telar aún está disponible</h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      Explora nuestras colecciones hechas a mano y realiza tu primer pedido personalizado.
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-secondary text-white font-bold text-sm shadow-button hover:bg-secondary/90 transition-all tactile-press active:scale-95"
                  >
                    <MdStorefront className="text-xl" />
                    <span>Explorar Catálogo Yamgurumi</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAVORITOS (Refactorizado con Diseño Vibrante Craft e Identidad Yamgurumi) */}
          {activeTab === "favoritos" && (
            <div className="space-y-8">
              {/* Encabezado de Sección con Identidad de Marca */}
              <div className="border-b border-primary-container/20 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2.5">
                    <MdFavorite className="text-tertiary text-2xl animate-bounce" />
                    <span>Tu Galería de Tesoros Favoritos</span>
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Tus amigurumis guardados con amor para solicitar cuando gustes.
                  </p>
                </div>
                {storeFavoriteProducts.length > 0 && (
                  <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/25 shrink-0 shadow-sm">
                    {storeFavoriteProducts.length} {storeFavoriteProducts.length === 1 ? "Pieza Guardada" : "Piezas Guardadas"}
                  </span>
                )}
              </div>

              {storeFavoriteProducts.length > 0 ? (
                <div className="space-y-6">
                  {/* Vista Móvil: Modo Lista Vibrante Compacta (sm:hidden) */}
                  <div className="space-y-4 sm:hidden">
                    {storeFavoriteProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3.5 p-3.5 rounded-3xl bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest to-surface-container-low/60 border border-primary-container/25 shadow-sm relative group hover:shadow-card transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/10 rounded-full blur-xl pointer-events-none" />

                        <Link href={`/producto/${product.slug}`} className="relative w-22 h-22 rounded-2xl overflow-hidden shrink-0 bg-surface-container shadow-inner border border-primary-container/20">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="88px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        <div className="flex-1 min-w-0 pr-1 space-y-1">
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-md">
                            {product.category}
                          </span>
                          <Link href={`/producto/${product.slug}`} className="block">
                            <h4 className="font-headline font-bold text-sm text-on-surface truncate hover:text-secondary transition-colors">
                              {product.name}
                            </h4>
                          </Link>
                          <p className="font-headline font-extrabold text-base text-secondary">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0 z-10">
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-tertiary/15 text-tertiary hover:bg-tertiary hover:text-white transition-all tactile-press active:scale-90 cursor-pointer shadow-sm"
                            title="Quitar de favoritos"
                          >
                            <MdFavorite className="text-lg" />
                          </button>

                          <button
                            onClick={() => addItem(product)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary text-white shadow-button hover:bg-secondary/90 transition-all tactile-press active:scale-90 cursor-pointer"
                            title="Agregar al carrito"
                          >
                            <MdAddShoppingCart className="text-lg" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vista Desktop & Tablet: Grilla de Tarjetas Artesanales Vibrantes (hidden sm:grid) */}
                  <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {storeFavoriteProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-gradient-to-b from-surface-container-lowest to-surface-container-low/50 rounded-3xl border border-primary-container/25 p-5 shadow-card hover:shadow-elevation hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
                      >
                        {/* Glow ambiental de fondo */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                        <div>
                          {/* Contenedor de Imagen con Insignia Tejido a Mano */}
                          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-container mb-4 shadow-inner border border-primary-container/20">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            />
                            
                            {/* Insignia Artesanal en Imagen */}
                            <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full border border-primary-container/20 shadow-sm text-[10px] font-bold text-on-surface flex items-center gap-1">
                              <span>🧶</span>
                              <span>Hecho a Mano</span>
                            </div>

                            {/* Botón Flotante Quitar Favorito */}
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-tertiary shadow-md flex items-center justify-center hover:bg-tertiary hover:text-white transition-all tactile-press active:scale-90 cursor-pointer"
                              title="Quitar de favoritos"
                            >
                              <MdFavorite className="text-xl" />
                            </button>
                          </div>

                          {/* Info del Producto */}
                          <div className="space-y-1.5">
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-secondary bg-secondary-container/30 px-2.5 py-0.5 rounded-full">
                              {product.category}
                            </span>

                            <Link href={`/producto/${product.slug}`} className="block">
                              <h3 className="font-headline font-bold text-base text-on-surface line-clamp-1 hover:text-secondary transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="text-xs text-on-surface-variant line-clamp-1">
                              {product.materials}
                            </p>
                          </div>
                        </div>

                        {/* Pie de Tarjeta: Precio + CTA Carrito */}
                        <div className="mt-4 pt-3 border-t border-primary-container/15 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-extrabold text-on-surface-variant block uppercase tracking-wider">
                              Precio Especial
                            </span>
                            <span className="font-headline font-extrabold text-xl text-secondary">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => addItem(product)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shadow-button hover:bg-secondary/90 transition-all tactile-press active:scale-95 cursor-pointer"
                          >
                            <MdAddShoppingCart className="text-base" />
                            <span>Agregar</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty state cálido y encantador */
                <div className="py-14 text-center space-y-5 max-w-md mx-auto bg-surface-container-lowest p-8 rounded-3xl border border-primary-container/20 shadow-sm">
                  <div className="w-24 h-24 bg-tertiary-container/30 text-tertiary rounded-full flex items-center justify-center text-5xl mx-auto border-2 border-dashed border-tertiary/40 shadow-inner craft-float">
                    💖
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline text-xl font-bold text-on-surface">Sin piezas favoritas aún</h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      Navega por nuestro catálogo de gatitos, ositos y creaciones especiales para armar tu lista de deseos.
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-tertiary text-white font-bold text-sm shadow-button hover:bg-tertiary/90 transition-all tactile-press active:scale-95"
                  >
                    <MdFavorite className="text-xl" />
                    <span>Explorar Amigurumis</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CLUB YAMGURUMI Y CUPONES */}
          {activeTab === "beneficios" && (
            <div className="space-y-8 animate-[hero-fade-up_0.4s_cubic-bezier(0.16,1,0.3,1)]">
              <div className="border-b border-primary-container/20 pb-4">
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">Club Yamgurumi & Privilegios</h2>
                <p className="text-body-sm text-on-surface-variant">Descuentos exclusivos y beneficios como artesano de nuestra comunidad.</p>
              </div>

              {/* Tarjeta VIP del Miembro con brillo interactivo */}
              <div className="relative bg-gradient-to-br from-surface-container-high via-surface-bright to-primary-container/30 p-6 sm:p-8 rounded-3xl border border-secondary/30 overflow-hidden shadow-elevation group">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl group-hover:rotate-12 transition-transform duration-700">
                  🧶
                </div>
                <div className="space-y-4 max-w-xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-secondary text-white shadow-sm">
                    <MdAutoAwesome />
                    <span>Insignia de Miembro VIP</span>
                  </div>
                  <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
                    ¡Pase de Miembro de Honor!
                  </h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Al formar parte del Club Yamgurumi obtienes atención prioritaria para encargos personalizados por WhatsApp, descuentos en lanzamientos de temporada y sorpresas en cada empaque.
                  </p>
                </div>
              </div>

              {/* Lista de cupones interactivos */}
              <div className="space-y-4">
                <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                  <MdConfirmationNumber className="text-secondary" />
                  <span>Tus Cupones Disponibles</span>
                </h3>

                {user.discountCodes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.discountCodes.map((discount) => {
                      const isUsed = discount.usedCount >= discount.usageLimit;
                      return (
                        <div 
                          key={discount.code} 
                          className={`p-5 rounded-3xl border-2 border-dashed flex items-center justify-between gap-4 shadow-sm transition-all ${
                            isUsed 
                              ? "border-outline-variant/30 bg-surface-container-low/50 opacity-70"
                              : "border-secondary/40 bg-surface-container-lowest hover:border-secondary"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-xl font-extrabold tracking-wider ${
                                isUsed ? "line-through text-on-surface-variant/60" : "text-secondary"
                              }`}>
                                {discount.code}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                isUsed ? "bg-surface-container-high text-on-surface-variant/60" : "bg-tertiary-container text-on-tertiary-container"
                              }`}>
                                -{discount.percent}%
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant">
                              {isUsed 
                                ? "✨ Cupón canjeado con éxito" 
                                : discount.usageLimit > 1 
                                  ? `Usado ${discount.usedCount} de ${discount.usageLimit} veces` 
                                  : "Válido para tu primer pedido (1 solo uso)"}
                            </p>
                          </div>

                          {isUsed ? (
                            <span className="px-3.5 py-2 rounded-full bg-surface-container-high text-on-surface-variant/70 text-xs font-bold border border-outline-variant/20">
                              Canjeado 🛍️
                            </span>
                          ) : (
                            <button
                              onClick={() => copyToClipboard(discount.code)}
                              className="px-4 py-2.5 rounded-full bg-secondary text-white hover:bg-secondary/90 text-xs font-bold transition-all tactile-press flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                            >
                              <MdContentCopy />
                              <span>{copiedCode === discount.code ? "¡Copiado! 🎉" : "Copiar"}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl border border-dashed border-primary-container/40 bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      <div className="w-12 h-12 rounded-2xl bg-secondary-container/50 text-secondary flex items-center justify-center text-2xl shrink-0">
                        🎁
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">¿Deseas obtener tu primer cupón?</p>
                        <p className="text-xs text-on-surface-variant">Suscríbete a nuestro boletín en la página principal para recibir promociones exclusivas.</p>
                      </div>
                    </div>
                    <Link
                      href="/"
                      className="px-5 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shrink-0 hover:bg-secondary/90 transition-all tactile-press shadow-sm"
                    >
                      Ver Novedades
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DIRECCIONES (Refactorizado con Impeccable Craft & Layout de 2 Columnas) */}
          {activeTab === "direcciones" && (
            <div className="space-y-8">
              {/* Encabezado de Sección */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-primary-container/20 pb-4 gap-3">
                <div>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                    <MdLocalShipping className="text-secondary" />
                    <span>Direcciones de Entrega & Logística</span>
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Gestiona tus puntos de recepción para envíos a domicilio en El Salvador y entregas prioritarias.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/40 border border-secondary/20 text-secondary text-xs font-bold shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <span>Envíos en El Salvador 🇸🇻</span>
                </div>
              </div>

              {/* Grid Principal de 2 Columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Columna Izquierda: Tarjetas de Información de Envíos & Garantía */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Tarjeta de Garantía Artesanal de Envíos */}
                  <div className="bg-surface-container-lowest p-6 rounded-3xl border border-primary-container/20 shadow-card space-y-4 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                    
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 text-secondary flex items-center justify-center text-2xl">
                      📦
                    </div>

                    <h3 className="font-headline font-bold text-base text-on-surface">
                      Garantía Tejida con Amor
                    </h3>
                    
                    <ul className="space-y-3 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2">
                        <MdCheckCircle className="text-secondary text-base shrink-0 mt-0.5" />
                        <span><strong>Empaque Anti-aplastamiento:</strong> Caja rígida protectora para tu amigurumi.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdCheckCircle className="text-secondary text-base shrink-0 mt-0.5" />
                        <span><strong>Tiempos de Entrega:</strong> 24-48h en San Salvador y A.M., 2-4 días en Departamentos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdCheckCircle className="text-secondary text-base shrink-0 mt-0.5" />
                        <span><strong>Tracking por WhatsApp:</strong> Notificaciones directas al enviar tu paquete.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Resumen de Estado de Direcciones */}
                  <div className="bg-surface-container-lowest p-6 rounded-3xl border border-primary-container/20 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Puntos Registrados
                      </span>
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary">
                        {user.addresses.length} {user.addresses.length === 1 ? "Dirección" : "Direcciones"}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant/90 leading-relaxed pt-1">
                      La dirección marcada como <strong>Principal</strong> se seleccionará automáticamente en tu próximo pedido rápido por WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Columna Derecha: Tarjetas de Direcciones & Acciones */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline text-lg font-bold text-on-surface">
                      Tus Lugares de Entrega
                    </h3>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shadow-button hover:bg-secondary/90 transition-all tactile-press cursor-pointer shrink-0 active:scale-95"
                    >
                      <MdAddLocation className="text-base" />
                      <span>Agregar Nueva Dirección</span>
                    </button>
                  </div>

                  {user.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {user.addresses.map((addr) => {
                        const isPrimary = addr.isDefault;
                        return (
                          <div
                            key={addr.id}
                            className={`p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between space-y-4 shadow-sm hover:shadow-card ${
                              isPrimary
                                ? "bg-surface-container-lowest border-secondary shadow-card ring-2 ring-secondary/20"
                                : "bg-surface-container-lowest/90 border-primary-container/20 hover:border-secondary/30"
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between gap-2 border-b border-primary-container/15 pb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg ${
                                    isPrimary ? "bg-secondary text-white" : "bg-secondary-container/40 text-secondary"
                                  }`}>
                                    <MdLocationOn />
                                  </div>
                                  <div>
                                    <span className="font-headline font-bold text-base text-on-surface block leading-tight">
                                      {addr.name}
                                    </span>
                                    <span className="text-xs text-on-surface-variant">
                                      📞 {addr.phone}
                                    </span>
                                  </div>
                                </div>

                                <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                                  isPrimary
                                    ? "bg-secondary text-white border-secondary shadow-sm"
                                    : "bg-surface-container-high text-on-surface-variant border-primary-container/20"
                                }`}>
                                  {isPrimary ? (
                                    <>
                                      <MdStar className="text-amber-300 text-xs" />
                                      <span>Principal</span>
                                    </>
                                  ) : (
                                    <>
                                      <MdStarBorder className="text-on-surface-variant/70 text-xs" />
                                      <span>Secundaria</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              <div className="space-y-1.5 text-xs text-on-surface-variant pt-1">
                                <p className="flex items-start gap-1.5">
                                  <span className="font-bold text-on-surface shrink-0">📍 Zona / Dirección:</span>
                                  <span className="text-on-surface font-semibold">{addr.zone}</span>
                                </p>
                                {addr.notes && (
                                  <div className="p-3 rounded-2xl bg-surface-container-low/60 border border-primary-container/15 text-[11px] italic text-on-surface-variant/90 mt-2">
                                    "{addr.notes}"
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Botones de acción inferiores */}
                            <div className="flex items-center justify-between gap-2 pt-3 border-t border-primary-container/15">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAddress(addr);
                                    setIsAddressModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:text-secondary hover:bg-secondary-container/30 transition-all cursor-pointer"
                                >
                                  <MdEdit className="text-sm" />
                                  <span>Editar</span>
                                </button>

                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-secondary hover:bg-secondary/10 border border-secondary/20 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    <MdStarBorder className="text-sm text-secondary" />
                                    <span>Hacer Principal</span>
                                  </button>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                disabled={isPending}
                                className="p-2 rounded-full text-error/80 hover:text-error hover:bg-error/10 transition-all cursor-pointer disabled:opacity-50"
                                title="Eliminar dirección"
                              >
                                <MdDeleteOutline className="text-lg" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-4 max-w-md mx-auto bg-surface-container-lowest p-8 rounded-3xl border border-primary-container/20 shadow-sm">
                      <div className="w-20 h-20 bg-secondary-container/30 text-secondary rounded-full flex items-center justify-center text-4xl mx-auto border-2 border-dashed border-secondary/30">
                        <MdLocationOn />
                      </div>
                      <h3 className="font-headline text-lg font-bold text-on-surface">Sin direcciones registradas</h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Registra tus direcciones para agilizar la entrega de tus próximos amigurumis.
                      </p>
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setIsAddressModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white font-bold text-sm shadow-button hover:bg-secondary/90 transition-all tactile-press cursor-pointer"
                      >
                        <MdAddLocation className="text-lg" />
                        <span>Registrar Mi Primera Dirección</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: DATOS DE LA CUENTA (Refactorizado con Impeccable Craft) */}
          {activeTab === "perfil" && (
            <div className="space-y-8">
              {/* Encabezado de la Sección */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-primary-container/20 pb-4 gap-3">
                <div>
                  <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                    <MdPerson className="text-secondary" />
                    <span>Configuración de Cuenta & Perfil</span>
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Administra tus datos personales, foto de perfil y preferencias de seguridad en Yamgurumi.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cuenta Verificada</span>
                </div>
              </div>

              {/* Grid Principal de 2 Columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Columna Izquierda: Tarjeta Hero del Perfil & Avatar Customizer */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-surface-container-lowest p-6 rounded-3xl border border-primary-container/20 shadow-card flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                    
                    {/* Avatar Interactiva */}
                    <div
                      className="relative cursor-pointer group/avatar mb-4"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <div className="w-28 h-28 bg-gradient-to-br from-surface-container to-primary-container/40 border-2 border-dashed border-secondary/40 rounded-full flex items-center justify-center text-secondary shadow-inner relative overflow-hidden transition-transform duration-300 group-hover/avatar:scale-105">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "Foto"}
                            fill
                            sizes="112px"
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="font-headline font-bold text-4xl text-secondary">
                            {user.name ? user.name.charAt(0).toUpperCase() : "Y"}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px] opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity duration-300 rounded-full">
                          <MdCameraAlt className="text-2xl mb-0.5" />
                          <span className="text-[10px]">Cambiar</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          avatarInputRef.current?.click();
                        }}
                        disabled={isUploadingAvatar}
                        className="absolute bottom-0 right-0 p-2.5 bg-secondary text-white rounded-full shadow-md hover:bg-secondary/90 transition-all tactile-press active:scale-95 cursor-pointer disabled:opacity-50"
                        title="Cambiar foto de perfil"
                      >
                        <MdCameraAlt className="text-base" />
                      </button>
                    </div>

                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      {user.name || "Artesano Yamgurumi"}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                      {user.email}
                    </p>

                    <div className="mt-4 pt-4 border-t border-primary-container/15 w-full flex items-center justify-between text-xs text-on-surface-variant">
                      <span>Nivel Artesanal:</span>
                      <span className="font-bold text-secondary">{userTier.title}</span>
                    </div>
                  </div>

                  {/* Tarjeta de Seguridad & Cifrado */}
                  <div className="bg-surface-container-lowest p-6 rounded-3xl border border-primary-container/20 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-secondary-container/40 text-secondary flex items-center justify-center text-xl shrink-0">
                        <MdShield />
                      </div>
                      <div>
                        <h4 className="font-headline font-bold text-sm text-on-surface">Seguridad de la Cuenta</h4>
                        <p className="text-[11px] text-on-surface-variant">Protegido con JWT & SSL</p>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant/90 leading-relaxed pt-1">
                      Tus datos personales y de envío están protegidos con cifrado de grado bancario.
                    </p>
                  </div>
                </div>

                {/* Columna Derecha: Formulario Profesional Interactivo */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-primary-container/20 shadow-card space-y-6">
                    <div className="flex items-center justify-between border-b border-primary-container/15 pb-4">
                      <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                        <MdBadge className="text-secondary text-xl" />
                        <span>Datos del Registro</span>
                      </h3>
                      <span className="text-xs font-bold text-on-surface-variant/80">
                        ID: <code className="bg-surface-container-high px-2 py-0.5 rounded-md text-[11px]">{user.id.slice(-8)}</code>
                      </span>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                      {/* Campo 1: Nombre con botón de guardado interactivo */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Nombre del Artesano / Nombre Visible
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            name="name"
                            defaultValue={user.name || ""}
                            required
                            placeholder="Ej. Ana María Pérez"
                            className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm font-bold focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                          />
                          <button
                            type="submit"
                            disabled={isPending}
                            className="absolute right-2 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-all tactile-press active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <MdCheckCircle className="text-sm" />
                            <span>{isPending ? "Guardando..." : "Guardar"}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-on-surface-variant/80">
                          Este nombre aparecerá en la bienvenida de tu taller y en tus pedidos.
                        </p>
                      </div>

                      {/* Campo 2: Correo Electrónico (Protegido) */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Correo Electrónico
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="email"
                            readOnly
                            value={user.email}
                            className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/25 text-on-surface-variant font-body text-sm font-semibold cursor-not-allowed"
                          />
                          <span className="absolute right-3 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <MdVerified className="text-sm text-emerald-600" />
                            <span>Verificado</span>
                          </span>
                        </div>
                      </div>

                      {/* Grid de 2 sub-columnas: Rol y Antigüedad */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-primary-container/15 space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                            Membresía & Rol
                          </span>
                          <p className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                            <MdAutoAwesome className="text-secondary text-base" />
                            <span>{user.role === "ADMIN" ? "Administrador 👑" : "Cliente VIP Artesanal"}</span>
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-primary-container/15 space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                            Antigüedad en la Comunidad
                          </span>
                          <p className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                            <MdCalendarToday className="text-secondary text-base" />
                            <span>{user.formattedDate}</span>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── MODAL 1: EDITAR NOMBRE DE PERFIL ───────────────── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-[search-fade-in_0.2s_ease]">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-elevation border border-primary-container/30 space-y-6 relative animate-[search-slide-down_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between border-b border-primary-container/20 pb-4">
              <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
                <MdEdit className="text-secondary" />
                <span>Editar Nombre</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-all"
              >
                <MdClose className="text-xl text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Nombre Completo / Nombre de Artesano
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name || ""}
                  required
                  placeholder="Ej. Ana María Pérez"
                  className="w-full px-4 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shadow-button hover:bg-secondary/90 transition-all tactile-press disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: GUARDAR DIRECCIÓN DE ENVÍO ────────────── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-[search-fade-in_0.2s_ease]">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-elevation border border-primary-container/30 space-y-6 relative animate-[search-slide-down_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between border-b border-primary-container/20 pb-4">
              <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
                <MdAddLocation className="text-secondary" />
                <span>{editingAddress ? "Editar Dirección de Entrega" : "Agregar Nueva Dirección"}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setEditingAddress(null);
                }}
                className="p-2 hover:bg-surface-container-low rounded-full transition-all"
              >
                <MdClose className="text-xl text-on-surface-variant" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                handleAddressSubmit(e);
                setEditingAddress(null);
              }} 
              className="space-y-4"
            >
              <input type="hidden" name="addressId" value={editingAddress?.id || ""} />

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Nombre de quien recibe
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingAddress?.name || user.name || ""}
                  required
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Teléfono de contacto (WhatsApp)
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingAddress?.phone || ""}
                  required
                  placeholder="Ej. 55554444"
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Zona / Municipio / Dirección Exacta
                </label>
                <input
                  type="text"
                  name="zone"
                  defaultValue={editingAddress?.zone || ""}
                  required
                  placeholder="Ej. Col. Escalón, San Salvador"
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Indicaciones adicionales (Opcional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingAddress?.notes || ""}
                  placeholder="Ej. Casa color crema, timbre blanco"
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm focus:ring-2 focus:ring-secondary outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    setEditingAddress(null);
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shadow-button hover:bg-secondary/90 transition-all tactile-press disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Dirección"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
