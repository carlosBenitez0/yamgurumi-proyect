import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";
import { YarnBall } from "@/components/ui/CraftBackground";

export const metadata: Metadata = {
  title: "Catálogo — Yamgurumi | Amigurumis Tejidos a Mano",
  description:
    "Explorá nuestro catálogo completo de amigurumis tejidos a mano en El Salvador. Muñecos, decoración, llaveros, accesorios y más. Hecho con amor, 100% algodón orgánico.",
  openGraph: {
    title: "Catálogo Yamgurumi — Todos los Amigurumis",
    description:
      "Amigurumis artesanales tejidos a mano con materiales hipoalergénicos. Envíos en El Salvador.",
  },
};

/* ── Loading fallback ───────────────────────────────────── */

function CatalogFallback() {
  return (
    <main className="min-h-screen bg-background pt-28 sm:pt-32 pb-16 sm:pb-24">
      <div className="section-container">
        <div className="max-w-7xl w-full">
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <YarnBall size={32} className="craft-spin-slow mb-6" color="#acedfe" opacity={0.3} />
            <p className="font-body text-on-surface-variant/60 text-sm">Cargando catálogo...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogClient />
    </Suspense>
  );
}
