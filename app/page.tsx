import Navbar from "@/components/layout/Navbar";
import Hero3D from "@/components/Hero3D";
import CategoryGrid from "@/components/sections/CategoryGrid";
import BestSellers from "@/components/sections/BestSellers";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { YarnThread, CrochetHook } from "@/components/ui/CraftBackground";

import { MdVerified, MdSpa, MdEco, MdLocalShipping } from "react-icons/md";
import Link from "next/link";

const trustBadges = [
  { icon: <MdSpa />, label: "100% Hecho a Mano" },
  { icon: <MdEco />, label: "Hilos Orgánicos" },
  { icon: <MdLocalShipping />, label: "Envíos Rápidos" },
];

export default function Home() {
  return (
    <>
      <Navbar />
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
            opacity={0.15}
            className="absolute top-[25%] left-0 w-full h-32 craft-sway -z-10"
          />
          <CrochetHook
            className="bottom-[18%] left-[5%] craft-drift -z-10 hidden lg:block"
            opacity={0.12}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
            {/* Text Content - Always first on mobile */}
            <div className="lg:col-span-7 z-10 text-center lg:text-left order-1 flex flex-col items-center lg:items-start hero-stagger">
              <div className="inline-flex items-center gap-2 px-6 py-1.5 rounded-full bg-secondary-container/60 text-secondary text-xs font-bold uppercase tracking-wider mb-5 shadow-sm border border-secondary/20">
                <MdVerified className="text-sm" />
                <span>Arte en Crochet &amp; Amigurumis</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold leading-[1.1] text-on-surface mb-4 sm:mb-5">
                Hecho a mano,
                <br />
                <span className="text-secondary">tejido con amor</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant font-body mb-8 sm:mb-10 max-w-lg leading-relaxed">
                Descubre nuestra colección de amigurumis artesanales, diseñados
                con hilos de primera calidad y rellenos de pura ternura para
                acompañar tus mejores momentos.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center lg:justify-start mb-6">
                <Link
                  href="#tienda"
                  className="bg-secondary text-white px-8 py-4 font-bold rounded-full hover:bg-secondary/90 active:scale-95 transition-all text-center text-base inline-flex justify-center items-center tactile-press"
                >
                  Ver Colección
                </Link>
                <Link
                  href="#categorias"
                  className="border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 active:scale-95 transition-all text-center text-base px-10 py-3.5 inline-flex justify-center items-center tactile-press"
                >
                  Encargo Especial
                </Link>
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
        <ProcessSteps />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
