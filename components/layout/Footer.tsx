"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  MdAlternateEmail,
  MdFavorite,
  MdLocationOn,
  MdAccessTime,
  MdKeyboardArrowUp,
  MdAutoAwesome,
  MdLocalShipping,
  MdChat,
} from "react-icons/md";

const AnimatedYarnThreads = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20 sm:opacity-30 hidden sm:block">
    <svg
      viewBox="0 0 1440 320"
      className="absolute top-0 left-0 w-full h-full object-cover"
      preserveAspectRatio="none"
    >
      <path
        d="M0,160 Q 360,130, 720,160 T 1440,160"
        fill="none"
        stroke="rgba(32, 103, 118, 0.15)"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-[soft-float_8s_ease-in-out_infinite]"
      />
      <path
        d="M0,180 Q 360,200, 720,180 T 1440,180"
        fill="none"
        stroke="rgba(196, 122, 108, 0.18)"
        strokeWidth="1.5"
        strokeDasharray="8 8"
        className="animate-[soft-float_10s_ease-in-out_infinite_reverse]"
      />
    </svg>
  </div>
);

const YarnDivider = () => (
  <div className="relative w-full h-14 overflow-hidden pointer-events-none -mb-1 z-10">
    <svg
      viewBox="0 0 1200 48"
      fill="none"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <path
        d="M0 24 Q 150 6, 300 24 T 600 24 T 900 24 T 1200 24"
        stroke="rgba(32, 103, 118, 0.3)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M0 32 Q 200 14, 400 32 T 800 32 T 1200 32"
        stroke="rgba(196, 122, 108, 0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
      />
    </svg>
  </div>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full relative mt-16 sm:mt-24">
      <YarnDivider />

      <div className="relative bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-high text-on-surface overflow-hidden">
        {/* Knit texture overlay */}
        <div className="absolute inset-0 knit-texture pointer-events-none" />

        {/* Dynamic Animated SVG Yarn Threads */}
        <AnimatedYarnThreads />

        {/* Decorative ambient blurs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Footer Container (Monolithic, no individual cards) */}
        <div className="relative z-10 section-container pt-14 pb-8 sm:pt-20 sm:pb-12">
          <ScrollReveal>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
              
              {/* Columna 1: Marca & Misión (4 cols) */}
              <div className="lg:col-span-4 space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <img
                    alt="Yamgurumi Logo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw"
                    className="h-11 w-auto rounded-full ring-2 ring-secondary/30"
                    width={180}
                    height={48}
                  />
                  <div>
                    <span className="font-headline font-bold text-xl text-on-surface block leading-tight">
                      Yamgurumi Studio
                    </span>
                    <span className="text-xs text-secondary font-bold flex items-center gap-1">
                      <MdAutoAwesome className="text-xs" />
                      <span>Artesanía Tejida con Amor</span>
                    </span>
                  </div>
                </div>

                <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm">
                  Cada amigurumi es creado punto a punto por artesanas salvadoreñas con materiales 100% hipoalergénicos. Un regalo duradero cargado de cariño y detalles hechos a mano.
                </p>

                {/* Social Pills */}
                <div className="pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-2.5">
                    Síguenos en Redes
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      {
                        icon: (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        ),
                        label: "Facebook",
                        href: "#",
                      },
                      {
                        icon: <MdAlternateEmail />,
                        label: "Email",
                        href: "mailto:hola@yamgurumi.com",
                      },
                      {
                        icon: (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        ),
                        label: "WhatsApp",
                        href: "https://wa.me/50377311064",
                      },
                      {
                        icon: (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          </svg>
                        ),
                        label: "TikTok",
                        href: "#",
                      },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        aria-label={item.label}
                        className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest text-secondary rounded-full border border-primary-container/20 hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna 2: Explorar Catálogo (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider border-b border-primary-container/20 pb-2">
                  Explorar
                </h4>
                <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
                  {[
                    { label: "Catálogo Completo", href: "/catalog" },
                    { label: "Nuestra Historia", href: "/our-history" },
                    { label: "Colección Destacada", href: "/catalog?tag=best-seller" },
                    { label: "Novedades Tejidas", href: "/catalog?sort=newest" },
                    { label: "Encargos Especiales", href: "/contact?subject=custom" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:text-secondary transition-colors duration-200 block py-0.5"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna 3: Información & Envíos (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <h4 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider border-b border-primary-container/20 pb-2">
                  Logística & Ayuda
                </h4>
                <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
                  {[
                    { label: "Envíos en El Salvador 🇸🇻", href: "#" },
                    { label: "Política de Garantía & Devolución", href: "#" },
                    { label: "Cuidados del Amigurumi", href: "#" },
                    { label: "Ventas al Mayor & Regalos", href: "#" },
                    { label: "Preguntas Frecuentes", href: "#" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:text-secondary transition-colors duration-200 block py-0.5"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna 4: Estudio Taller (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <h4 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider border-b border-primary-container/20 pb-2 flex items-center justify-between">
                  <span>Estudio Taller</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Taller abierto" />
                </h4>
                
                <div className="space-y-3 text-xs text-on-surface-variant font-medium">
                  <p className="flex items-start gap-2">
                    <MdLocationOn className="text-secondary text-base shrink-0 mt-0.5" />
                    <span>San Salvador, El Salvador 🇸🇻</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MdAccessTime className="text-secondary text-base shrink-0 mt-0.5" />
                    <span>Lun - Vie: 10:00 - 19:00 hrs</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MdLocalShipping className="text-secondary text-base shrink-0 mt-0.5" />
                    <span>Envíos seguros a todo el país</span>
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/50377311064"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-white font-bold text-xs shadow-button hover:bg-secondary/90 transition-all tactile-press cursor-pointer"
                  >
                    <MdChat className="text-sm" />
                    <span>Consulta por WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </ScrollReveal>

          {/* Large Brand Watermark Typographic Banner */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-primary-container/15 overflow-hidden text-center pointer-events-none select-none">
            <span className="font-headline font-extrabold text-[9vw] lg:text-[10vw] text-on-surface/5 leading-none tracking-tighter uppercase block whitespace-nowrap">
              Yamgurumi Studio
            </span>
          </div>
        </div>

        {/* Crisp Professional Bottom Bar */}
        <div className="relative z-10 border-t border-primary-container/20 bg-surface-container-high/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="font-body text-xs text-on-surface-variant font-medium">
              &copy; {new Date().getFullYear()} Yamgurumi Studio · Hecho a mano en El Salvador 🇸🇻. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/carlos-benitez-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold hover:text-secondary transition-colors group cursor-pointer"
              >
                <svg className="w-4 h-4 fill-secondary transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span className="group-hover:underline flex items-center gap-1">
                  <span>Developed with</span>
                  <MdFavorite className="text-tertiary text-xs animate-pulse inline-block" />
                  <span>by Carlos Benítez</span>
                </span>
              </a>

              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-full bg-surface-container-lowest text-secondary hover:bg-secondary hover:text-white border border-primary-container/30 transition-all tactile-press active:scale-95 cursor-pointer shadow-sm"
                title="Volver arriba"
              >
                <MdKeyboardArrowUp className="text-lg" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
