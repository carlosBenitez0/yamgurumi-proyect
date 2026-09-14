"use client";

import {
  MdFavorite,
  MdLocalOffer,
  MdAutoAwesome,
  MdPerson,
  MdHistory,
  MdCardGiftcard,
} from "react-icons/md";

/* ── Datos de las ventajas de tener cuenta ─────────────── */

const BENEFITS = [
  {
    id: "favoritos",
    icon: MdFavorite,
    title: "Guarda tu wishlist",
    desc: "Tus piezas favoritas",
    accent: "text-tertiary",
    chip: "bg-tertiary/10 group-hover:bg-tertiary group-hover:text-white",
  },
  {
    id: "cupones",
    icon: MdLocalOffer,
    title: "Cupones exclusivos",
    desc: "Ofertas de temporada",
    accent: "text-secondary",
    chip: "bg-secondary/10 group-hover:bg-secondary group-hover:text-white",
    badge: "VIP",
  },
  {
    id: "patrones",
    icon: MdAutoAwesome,
    title: "Patrones gratis",
    desc: "Descargas y guías",
    accent: "text-primary",
    chip: "bg-primary/10 group-hover:bg-primary group-hover:text-white",
  },
  {
    id: "perfil",
    icon: MdPerson,
    title: "Controla tu perfil",
    desc: "Direcciones y más",
    accent: "text-tertiary",
    chip: "bg-tertiary/10 group-hover:bg-tertiary group-hover:text-white",
  },
  {
    id: "historial",
    icon: MdHistory,
    title: "Historial de pedidos",
    desc: "Sigue tus envíos",
    accent: "text-secondary",
    chip: "bg-secondary/10 group-hover:bg-secondary group-hover:text-white",
  },
  {
    id: "descuento",
    icon: MdCardGiftcard,
    title: "Regalo de bienvenida",
    desc: "10% dto. en tu primer pedido",
    accent: "text-amber-600",
    chip: "bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-white",
    badge: "-10%",
    highlight: true,
  },
];

/* ── Componente ────────────────────────────────────────── */

export default function AuthBenefits() {
  return (
    <div className="w-full font-body">
      <div className="mb-4 text-center lg:text-left">
        <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface leading-tight tracking-tight">
          Tejer tu cuenta vale la pena
        </h3>
        <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
          Disfruta de ventajas exclusivas y sorpresas al unirte a nuestra comunidad craft.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {BENEFITS.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`group relative flex items-center text-left gap-3 rounded-2xl border p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card animate-fadeIn ${
                b.highlight 
                  ? 'border-amber-400/35 bg-gradient-to-br from-amber-500/10 via-surface-container-lowest to-surface-container-lowest hover:border-amber-400/60' 
                  : 'border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-sm hover:border-secondary/30 hover:bg-surface-container-lowest'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${b.chip} ${b.accent}`}
              >
                <Icon className="text-xl transition-colors" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-on-surface leading-tight group-hover:text-secondary transition-colors">
                    {b.title}
                  </span>
                  {b.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-secondary/15 text-secondary border border-secondary/20 shrink-0">
                      {b.badge}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-on-surface-variant/70 leading-tight mt-1">
                  {b.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
