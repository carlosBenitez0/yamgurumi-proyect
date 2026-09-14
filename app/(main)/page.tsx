import Hero3D from "@/components/Hero3D";
import CategoryGrid from "@/components/sections/CategoryGrid";
import BestSellers from "@/components/sections/BestSellers";
import Transformaciones from "@/components/sections/Transformaciones";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Newsletter from "@/components/sections/Newsletter";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { YarnThread, CrochetHook } from "@/components/ui/CraftBackground";

import { MdVerified, MdSpa, MdEco, MdLocalShipping, MdChat, MdArrowForward } from "react-icons/md";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/src/lib/whatsappTemplates";
import { getWhatsAppTemplatesMap } from "@/src/lib/whatsappTemplatesServer";

const trustBadges = [
  { icon: <MdSpa />, label: "100% Hecho a Mano" },
  { icon: <MdEco />, label: "Hilos Orgánicos" },
  { icon: <MdLocalShipping />, label: "Envíos Rápidos" },
];

export default async function Home() {
  const whatsappTemplates = await getWhatsAppTemplatesMap();
  const heroText = whatsappTemplates.wa_tpl_hero_custom || '¡Hola Yamgurumi! 🧵 Quiero hacer un encargo especial a medida. Me gustaría que me ayuden a crear mi amigurumi personalizado.';
  const heroWhatsAppUrl = buildWhatsAppUrl('50377311064', heroText);

  return (
    <>
      <main className="w-full overflow-x-hidden min-h-screen">
        {/* === HERO SECTION === */}
        <SectionWrapper
          id="inicio"
          noPadding
          className="relative pt-24 sm:pt-28"
          innerClassName="min-h-[calc(100vh-7rem)] flex flex-col justify-center"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[600px] h-72 sm:h-96 md:h-[600px] bg-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Craft decorations */}
          <YarnThread
            d="M -50 60 Q 200 20, 400 60 T 800 40 T 1200 60"
            color="#e3c2b4"
            strokeWidth={2}
            opacity={0.2}
            className="absolute top-[15%] left-0 w-full h-32 craft-drift -z-10"
          />
          <YarnThread
            d="M -50 100 Q 300 70, 500 100 T 900 80 T 1250 100"
            color="#acedfe"
            strokeWidth={1.5}
            dashArray="8 8"
            opacity={0.2}
            className="absolute top-[25%] left-0 w-full h-32 craft-drift -z-10"
          />
          <CrochetHook
            className="bottom-[18%] left-[5%] craft-drift -z-10 hidden lg:block"
            opacity={0.12}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (Text & CTA) - 7 cols on lg */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              {/* Badge Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="badge-pill bg-secondary-container text-secondary border border-secondary/30 px-3.5 py-1 text-xs font-bold font-label uppercase tracking-widest flex items-center gap-1.5 shadow-xs">
                  <MdVerified className="text-sm text-secondary" />
                  Amigurumis 100% Hechos a Mano
                </span>
                <span className="badge-pill bg-tertiary/15 text-tertiary border border-tertiary/30 px-3 py-1 text-xs font-bold font-label uppercase tracking-widest flex items-center gap-1">
                  🇸🇻 El Salvador
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-headline font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
                <span className="text-on-surface block">Hecho a mano,</span>
                <span className="text-secondary block">tejido con amor</span>
              </h1>

              {/* Subtitle / Description */}
              <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Descubre nuestra colección de amigurumis artesanales, diseñados con hilos de primera calidad y rellenos de pura ternura para acompañar tus mejores momentos.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
                <Link
                  href="/catalog"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-secondary text-white font-body font-bold text-base rounded-full shadow-button hover:bg-secondary/90 hover:shadow-elevation hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explorar Catálogo</span>
                  <MdArrowForward className="text-xl" />
                </Link>
                <a
                  href={heroWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border border-whatsapp/30 bg-whatsapp px-8 py-4 font-body text-base font-bold text-white cta-glow-pulse will-change-transform transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-whatsapp-hover active:translate-y-0 active:scale-[0.97] focus-ring"
                  aria-label="Encargo especial - Contactar por WhatsApp"
                >
                  {/* Barrido de brillo periódico */}
                  <span
                    aria-hidden="true"
                    className="cta-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                  <span className="flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[10deg] group-hover:scale-110">
                    <MdChat className="h-5 w-5 animate-pulse-whatsapp" />
                  </span>
                  <span className="relative">Encargo especial</span>
                  <MdArrowForward
                    aria-hidden="true"
                    className="-ml-1 w-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-0 group-hover:w-5 group-hover:opacity-100"
                  />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="badge-pill bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 shadow-sm py-1.5 px-3.5 flex items-center gap-1.5"
                  >
                    <span className="text-secondary flex items-center justify-center">
                      {badge.icon}
                    </span>
                    <span className="font-body font-semibold">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Canvas Column */}
            <div className="lg:col-span-5 relative h-[400px] sm:h-[500px] lg:h-[600px] w-full flex items-center justify-center order-2">
              {/* Contenedor expandido para permitir desbordamiento visual sin romper el grid */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] sm:w-[115%] sm:h-[115%] lg:w-[120%] lg:h-[120%]">
                <Hero3D />
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Sections */}
        <div className="section-divider mx-auto max-w-5xl" />
        <CategoryGrid />
        <BestSellers />
        <Transformaciones />
        <ProcessSteps />
        <Newsletter />
      </main>
    </>
  );
}
