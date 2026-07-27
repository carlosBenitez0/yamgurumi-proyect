import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { MdHome, MdStorefront } from "react-icons/md";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-hidden min-h-screen relative bg-surface flex flex-col justify-between">
        {/* Ambient Background Globs */}
        <div className="absolute top-1/4 left-1/4 w-[25rem] h-[25rem] bg-primary-container/40 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary-container/30 rounded-full blur-[140px] -z-10 animate-[pulse_6s_ease-in-out_infinite]" />

        {/* 404 Content Section */}
        <SectionWrapper
          noPadding
          className="relative pt-32 sm:pt-40 pb-20 z-10 flex-grow flex flex-col justify-center"
          innerClassName="flex flex-col items-center justify-center text-center w-full"
        >
          {/* Text and Actions */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="relative mb-4 lg:mb-8">
              <span className="font-headline text-[130px] sm:text-[180px] lg:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-secondary via-primary to-tertiary select-none leading-none drop-shadow-sm">
                404
              </span>
              {/* Glassmorphism accent behind the text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/10 backdrop-blur-[2px] rounded-full -z-10 blur-xl opacity-50" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface mb-6 leading-tight">
              ¡Oh no! El hilo se ha roto...
            </h1>

            <p className="text-lg sm:text-xl text-on-surface-variant font-body mb-8 leading-relaxed max-w-lg">
              Parece que has llegado a un rincón del taller donde no hay ningún
              amigurumi. No te preocupes, ¡nuestras agujas mágicas están listas
              para guiarte de regreso!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" style={{ marginTop: "48px" }}>
              <Link
                href="/"
                className="group relative inline-flex items-center justify-center gap-3 bg-secondary font-bold rounded-full hover:bg-secondary/90 active:scale-95 transition-all shadow-elevation overflow-hidden"
                style={{ padding: "16px 32px", color: "#fdf3df" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <MdHome className="text-[24px]" />
                <span className="text-lg">Volver al Inicio</span>
              </Link>
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-3 border-2 border-outline-variant text-on-surface-variant font-bold rounded-full hover:bg-surface-container hover:text-on-surface active:scale-95 transition-all text-lg"
                style={{ padding: "16px 32px" }}
              >
                <MdStorefront className="text-[24px]" />
                <span>Ver Catálogo</span>
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
