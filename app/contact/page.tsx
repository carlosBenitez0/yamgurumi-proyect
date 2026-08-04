import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { StitchDots } from "@/components/ui/CraftBackground";
import { DELIVERY_ZONES, SHIPPING } from "@/lib/cart-whatsapp";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contacto — Yamgurumi | Amigurumis Tejidos a Mano",
  description:
    "Escribile al taller de Yamgurumi: tu mensaje llega directo al chat de WhatsApp. Encargos personalizados, preguntas por piezas y entregas en El Salvador.",
};

const WHATSAPP_URL = `https://wa.me/50377311064?text=${encodeURIComponent(
  "Hola Yamgurumi! Quiero consultar por una pieza.",
)}`;

/* ── Tarjeta del panel derecho ──────────────────────────── */

interface RailCardProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

function RailCard({ title, children, delay = 0 }: RailCardProps) {
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card">
        <h2 className="font-headline text-headline-sm font-bold text-primary">
          {title}
        </h2>
        <div className="mt-3 font-body text-body-sm leading-relaxed text-on-surface-variant">
          {children}
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ── Página ────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <>
      {/* Marcador auditable del contrato: sobrevive el build (los comentarios JSX no). */}
      <div data-yarn-seed="da05fb4f" hidden aria-hidden="true" />
      {/* direction:el-hilo-que-se-estira · seed:da05fb4f · world:Yarn Garden (pinned)
          THESIS: contactar al taller es tejer un mensaje: tres puntos (nombre, motivo,
          mensaje) y el hilo lo estira directo al chat de WhatsApp. Rechaza la tarjeta de
          contacto genérica que muere en un formulario sin respuesta.
          OWN-WORLD: la vuelta del mensaje como un hilo con tres puntos que se encienden
          al completarse, sobre la paleta del taller; badge-pill, stitch-tag y el glifo de
          WhatsApp como única marca exterior.
          STORY: quien visita entiende que su mensaje llega a una persona real, ve su
          mensaje armado antes de enviarlo y lo manda sin salir del taller.
          FIRST VIEWPORT: cabecera breve, la vuelta del mensaje a la izquierda, el chat
          directo y las zonas de entrega a la derecha.
          FORM: candidate 6 de la lista propia, asignado por el seed (key da05fb4f).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md */}
      <main className="min-h-screen pb-16 sm:pb-24">
        <div className="section-container pt-28 sm:pt-32">
          <div className="mx-auto max-w-7xl">
            {/* ── Cabecera ────────────────────────────────── */}
            <header className="max-w-2xl">
              <ScrollReveal>
                <span className="badge-pill px-3.5 py-1.5 font-label text-label-md uppercase tracking-widest text-secondary">
                  Contacto
                </span>
                <h1 className="font-headline text-headline-lg leading-[1.15] tracking-tight text-primary mt-4 md:text-headline-xl">
                  Hablemos por el taller
                </h1>
                <p className="text-body text-on-surface-variant font-body mt-4 leading-relaxed">
                  Tu mensaje llega directo al chat del taller, sin formularios
                  que se pierden en el camino. Contanos qué necesitás: una
                  pieza, un encargo, una entrega — y el hilo hace el resto.
                  ¿Tenés una imagen que querés convertir en amigurumi?
                  Mandá la foto por WhatsApp y la transformamos juntos.
                </p>
              </ScrollReveal>
            </header>

            {/* ── La vuelta del mensaje + el resto del taller ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-10 mt-8 sm:mt-10 items-start">
              <Suspense fallback={null}>
                <ContactClient />
              </Suspense>

              <aside
                aria-label="Otras formas de llegar al taller"
                className="flex flex-col gap-6 self-start w-full"
              >
                {/* El chat del taller */}
                <RailCard title="El chat del taller" delay={60}>
                  <p>
                    No hay bots ni filas: escribís y te responde la persona que
                    teje. El taller responde casi siempre el mismo día.
                  </p>
                  {/* POR DEFINIR: tiempo real de respuesta */}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2.5 w-full bg-whatsapp text-white px-6 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-whatsapp-hover transition-all active:scale-[0.97] tactile-press focus-ring"
                  >
                    <WhatsAppIcon className="w-[18px] h-[18px] flex-shrink-0" />
                    Escribir directo
                  </a>
                  <p className="text-body-sm text-on-surface-variant/80 font-body mt-3 text-center">
                    +503 7731-1064
                  </p>
                </RailCard>

                {/* Dónde se entrega */}
                <RailCard title="Dónde se entrega" delay={120}>
                  <p>La entrega se coordina en el chat.</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {DELIVERY_ZONES.map((zone) => (
                      <li
                        key={zone}
                        className="rounded-full bg-primary-fixed-dim/25 px-3 py-1 text-label-md font-label font-bold text-on-surface-variant"
                      >
                        {zone}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-body-sm text-on-surface-variant/80">
                    {SHIPPING.note}
                  </p>
                </RailCard>

                {/* El correo del taller */}
                <RailCard title="El correo del taller" delay={180}>
                  <p>
                    Para lo que no necesita respuesta inmediata: catálogos,
                    alianzas o fotos de tus piezas.
                  </p>
                  <a
                    href="mailto:hola@yamgurumi.com"
                    className="mt-3 inline-block font-headline text-headline-sm font-semibold text-secondary hover:underline focus-ring rounded-full"
                  >
                    hola@yamgurumi.com
                  </a>
                  <p className="mt-3 text-body-sm text-on-surface-variant/80">
                    Lun a Vie, 10:00 a 19:00.
                  </p>
                  {/* POR DEFINIR: horario real del taller */}
                </RailCard>
              </aside>
            </div>

            {/* ── Preguntas que ya tienen respuesta ─────────── */}
            <section
              aria-labelledby="faq-heading"
              className="mt-16 sm:mt-20"
            >
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <StitchDots className="h-8 w-8 opacity-40" aria-hidden="true" />
                  <h2
                    id="faq-heading"
                    className="font-headline text-headline-md sm:text-headline-lg font-bold text-primary"
                  >
                    Preguntas que ya tienen respuesta
                  </h2>
                </div>
              </ScrollReveal>

              <dl className="grid md:grid-cols-2 gap-4 mt-6">
                <ScrollReveal delay={60}>
                  <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card">
                      <dt className="font-headline text-headline-sm font-bold text-primary">
                        ¿Hacés encargos personalizados?
                      </dt>
                      <dd className="mt-2 font-body text-body-sm leading-relaxed text-on-surface-variant">
                        Sí: elegís la pieza y el taller la teje para vos. Si tenés
                        una imagen — un personaje, una ilustración o un boceto —
                        mandala por WhatsApp y la transformamos en un amigurumi
                        único. Contanos en el mensaje qué tenés en mente y te pasa
                        el detalle.
                      </dd>
                    {/* POR DEFINIR: proceso y tiempos reales de un encargo */}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={120}>
                  <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card">
                    <dt className="font-headline text-headline-sm font-bold text-primary">
                      ¿Cuánto tarda la respuesta?
                    </dt>
                    <dd className="mt-2 font-body text-body-sm leading-relaxed text-on-surface-variant">
                      El taller es una persona, no un botón. Si estás de
                      apuro, escribí "es urgente" y va al frente de la fila.
                    </dd>
                    {/* POR DEFINIR: tiempo de respuesta real */}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={180}>
                  <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card">
                    <dt className="font-headline text-headline-sm font-bold text-primary">
                      ¿En qué zonas se entrega?
                    </dt>
                    <dd className="mt-2 font-body text-body-sm leading-relaxed text-on-surface-variant">
                      {DELIVERY_ZONES.join(", ")} y alrededores. Si tu zona no
                      está en la lista, escribinos igual: se coordina en el chat.
                    </dd>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={240}>
                  <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 shadow-card">
                    <dt className="font-headline text-headline-sm font-bold text-primary">
                      ¿Cómo se coordina el pago?
                    </dt>
                    <dd className="mt-2 font-body text-body-sm leading-relaxed text-on-surface-variant">
                      {SHIPPING.note} El taller te confirma precio y forma de
                      pago antes de tejer tu pieza.
                    </dd>
                  </div>
                </ScrollReveal>
              </dl>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
