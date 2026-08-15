import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  YarnBall,
  StitchDots,
  ThreadSpool,
  CrochetHook,
} from "@/components/ui/CraftBackground";

export const metadata: Metadata = {
  title: "Nuestra Historia — Yamgurumi | Amigurumis Tejidos a Mano",
  description:
    "El recorrido por el taller de Yamgurumi: la mesa de los materiales, el patrón, la aguja en la mano y el canasto. Amigurumis tejidos a mano en El Salvador.",
};

const WHATSAPP_URL = `https://wa.me/50377311064?text=${encodeURIComponent(
  "Hola Yamgurumi! Quiero conocer más sobre sus amigurumis.",
)}`;

/* ── Estación del recorrido ──────────────────────────────
 * Una parada del paseo por el taller. El número es parte
 * del camino: indica el orden de la visita, no decora.
 */

interface StationProps {
  number: number;
  title: string;
  children: ReactNode;
  note?: ReactNode;
  delay?: number;
}

function Station({ number, title, children, note, delay = 0 }: StationProps) {
  return (
    <li>
      <ScrollReveal delay={delay}>
        <div className="flex gap-5 lg:gap-8">
          <span
            aria-hidden="true"
            className="relative z-10 mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-secondary/40 bg-surface-bright font-headline text-headline-sm font-bold text-secondary shadow-button"
          >
            {String(number).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1 pb-1">
            <h3 className="font-headline text-headline-md leading-snug text-primary">
              {title}
            </h3>
            <div className="mt-3 max-w-[62ch] space-y-3 font-body text-body-md leading-relaxed text-on-surface-variant">
              {children}
            </div>
            {note && <div className="mt-5">{note}</div>}
          </div>
        </div>
      </ScrollReveal>
    </li>
  );
}

/* ── Nota cosida (stitch-tag) ──────────────────────────── */

function StitchedNote({ children }: { children: ReactNode }) {
  return (
    <p className="stitch-tag max-w-[52ch] px-4 py-3 font-body text-body-sm leading-relaxed text-on-surface-variant">
      {children}
    </p>
  );
}

/* ── Página ────────────────────────────────────────────── */

export default function OurHistoryPage() {
  return (
    <>
      {/* Marcador auditable del contrato: sobrevive el build (los comentarios JSX no). */}
      <div data-yarn-seed="6f649cb9" hidden aria-hidden="true" />
      {/* seed:6f649cb9 · direction:el-recorrido-por-el-taller · world:Yarn Garden (pinned)
          THESIS: la historia del taller se cuenta caminando: un hilo guía une las
          estaciones de la mesa al canasto. Rechaza la línea de tiempo genérica y el
          hero de métricas.
          OWN-WORLD: hilo punteado vertical, estaciones con marcador circular, la
          reliquia de la Pieza Nº 0001, stitch-tag y badge-pill sobre la paleta del taller.
          STORY: quien visita camina por el taller, entiende cómo se teje cada pieza y
          sale con ganas de llevarse una.
          FIRST VIEWPORT: la puerta del taller con la promesa del recorrido; CTA a la
          historia de origen y al catálogo.
          FORM: candidate 4 del seed de superficie (key 6f649cb9), recorrido espacial
          por estaciones.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md */}
      <main className="relative min-h-screen overflow-hidden bg-background pb-16 pt-24 sm:pt-28">
      {/* ===== Hero: la puerta del taller ===== */}
      <section className="relative">
        <div className="section-container">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <ScrollReveal>
                <div>
                  <span className="badge-pill px-3.5 py-1.5 font-label text-label-md uppercase tracking-widest text-secondary">
                    Nuestra historia · El Salvador
                  </span>
                  <h1 className="mt-6 font-headline text-headline-lg leading-[1.15] tracking-tight text-primary md:text-headline-xl">
                    El taller donde cada amigurumi{" "}
                    <span className="text-secondary">empieza con un nudo.</span>
                  </h1>
                  <p className="mt-5 max-w-[56ch] font-body text-body-lg leading-relaxed text-on-surface-variant">
                    Esta es la parte de la historia que casi no se cuenta: la
                    mesa, las horas y el hilo — y la primera vuelta donde todo
                    empezó. Bienvenidos al taller de Yamgurumi.
                  </p>
                  <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                    <a
                      href="#origen"
                      className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 font-label text-label-md font-bold uppercase tracking-widest text-on-secondary shadow-button transition-all hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed active:scale-[0.97] focus-ring tactile-press"
                    >
                      Leer nuestra historia
                    </a>
                    <Link
                      href="/catalog"
                      className="inline-flex items-center justify-center rounded-full border-2 border-primary/25 px-8 py-3.5 font-label text-label-md font-bold uppercase tracking-widest text-primary transition-all hover:border-secondary/60 hover:text-secondary focus-ring"
                    >
                      Ver el catálogo
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* La puerta del taller */}
              <ScrollReveal delay={1}>
                <div className="relative rounded-2xl border border-primary/10 bg-surface-container-lowest p-6 shadow-card sm:p-8">
                  <YarnBall
                    size={84}
                    className="-right-6 -top-8"
                    color="#e3c2b4"
                    opacity={0.4}
                  />
                  <StitchDots
                    className="right-4 top-4"
                    color="#206776"
                    opacity={0.2}
                  />
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    <span className="font-label text-label-md font-semibold uppercase tracking-widest text-secondary">
                      El taller
                    </span>
                  </div>

                  {/* POR DEFINIR: foto real del taller / de la artesana (reemplazar panel) */}
                  <div className="relative mt-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-secondary-container/25">
                    <YarnBall size={88} color="#206776" opacity={0.22} />
                    <ThreadSpool
                      className="absolute left-6 top-1/2 -translate-y-1/2"
                      color="#206776"
                      opacity={0.3}
                    />
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-secondary/25 bg-surface-container-lowest/95 px-3.5 py-1.5 font-label text-label-md font-semibold text-secondary">
                      La mesa y la aguja
                    </span>
                  </div>

                  <p className="mt-6 max-w-[46ch] font-body text-body-sm leading-relaxed text-on-surface-variant">
                    Algodón 100% orgánico, relleno hipoalergénico y un solo par
                    de manos por pieza. Nada sale del taller sin pasar por este
                    control de amor.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="section-container mt-16 sm:mt-20">
          <div className="stitch-divider mx-auto max-w-7xl" />
        </div>
      </section>

      {/* ===== El origen: la primera vuelta ===== */}
      <section id="origen" className="scroll-mt-28 pt-16 sm:pt-20">
        <div className="section-container">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <ScrollReveal>
                <div>
                  <h2 className="font-headline text-headline-lg leading-snug text-primary">
                    La primera vuelta:{" "}
                    <span className="text-secondary">
                      cómo empezó Yamgurumi
                    </span>
                  </h2>
                  <div className="mt-5 max-w-[62ch] space-y-4 font-body text-body-md leading-relaxed text-on-surface-variant">
                    {/* POR DEFINIR: historia real de la fundadora — nombre,
                    lugar y cómo empezó a tejer */}
                    <p>
                      Yamgurumi empezó como empiezan casi todas las cosas del
                      taller: con una pieza que no estaba pensada para
                      venderse. Una aguja, un ovillo y la idea de tejer algo
                      que hiciera sonreír a alguien.
                    </p>
                    <p>
                      El primer amigurumi salió de la mesa sin plan, con más
                      cariño que técnica. Se regaló; después se hizo otro, y
                      los pedidos empezaron a llegar por el chat antes que por
                      cualquier página.{" "}
                      {/* POR DEFINIR: qué fue el primer amigurumi, año y
                      anécdota */}
                    </p>
                    <p>
                      Así nació la tienda: no desde un catálogo, sino desde la
                      mesa del taller y la promesa de que nada se repite. Cada
                      Yamgurumi se sigue tejiendo igual que el primero — una
                      sola vez, a mano, para alguien.
                    </p>
                  </div>
                  {/* La voz de la fundadora */}
                  <blockquote className="mt-7 rounded-2xl bg-secondary-container/25 p-6">
                    <p className="font-headline text-headline-sm leading-relaxed text-primary">
                      “No planeé una tienda. Tejí una pieza, después otra, y
                      una noche entendí que quería que cada amigurumi llegara a
                      una casa como si hubiera sido hecho para esa casa.”
                    </p>
                    <footer className="mt-3 font-label text-label-md font-semibold uppercase tracking-widest text-secondary">
                      {/* POR DEFINIR: nombre real de la fundadora */}
                      — La fundadora de Yamgurumi
                    </footer>
                  </blockquote>
                </div>
              </ScrollReveal>

              {/* La reliquia: el primer amigurumi */}
              <ScrollReveal delay={1}>
                <div className="relative rounded-2xl border border-primary/10 bg-surface-container-lowest p-6 shadow-card sm:p-8">
                  <YarnBall
                    size={72}
                    className="-right-6 -top-7"
                    color="#e3c2b4"
                    opacity={0.4}
                  />
                  <StitchDots
                    className="bottom-4 right-4"
                    color="#206776"
                    opacity={0.16}
                  />
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-tertiary" />
                    <span className="font-label text-label-md font-semibold uppercase tracking-widest text-tertiary">
                      Pieza Nº 0001
                    </span>
                  </div>
                  {/* POR DEFINIR: foto del primer amigurumi (reemplazar panel) */}
                  <div className="relative mt-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-primary-container/25">
                    <YarnBall size={96} color="#e3c2b4" opacity={0.55} />
                    <CrochetHook
                      className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      color="#206776"
                      opacity={0.4}
                    />
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/25 bg-surface-container-lowest/95 px-3.5 py-1.5 font-label text-label-md font-semibold text-primary">
                      El primer Yamgurumi
                    </span>
                  </div>
                  <p className="mt-6 max-w-[48ch] font-body text-body-sm leading-relaxed text-on-surface-variant">
                    Con ese primer punto no nació una tienda todavía: nació la
                    idea.{" "}
                    {/* POR DEFINIR: año y lugar de la primera pieza */}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="section-container mt-16 sm:mt-20">
          <div className="stitch-divider mx-auto max-w-7xl" />
        </div>
      </section>

      {/* ===== El recorrido: hilo guía del taller ===== */}
      <section id="recorrido" className="scroll-mt-28 pt-16 sm:pt-20">
        <div className="section-container">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-headline text-headline-lg leading-snug text-primary">
                  Un paseo por el taller
                </h2>
                <p className="mt-4 font-body text-body-lg leading-relaxed text-on-surface-variant">
                  Cuatro estaciones, un solo hilo. Así se hace cada Yamgurumi,
                  del principio al canasto.
                </p>
              </div>
            </ScrollReveal>

            {/* El hilo que une las estaciones */}
            <div className="relative mx-auto mt-14 max-w-3xl">
              <div
                aria-hidden="true"
                className="absolute -translate-x-1/2 left-[22px] top-8 bottom-8 w-[3px] rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--color-primary-fixed-dim) 1.6px, transparent 1.8px)",
                  backgroundSize: "6px 14px",
                  backgroundRepeat: "repeat-y",
                  backgroundPosition: "center",
                  opacity: 0.8,
                }}
              />
              <ol className="relative flex flex-col gap-12 lg:gap-16">
                <Station number={1} title="La mesa de los materiales">
                  <p>
                    El taller arranca en una mesa con cajones llenos de hilo.
                    Acá se elige el algodón, se pesa el relleno y se aparta el
                    color exacto que va a llevar cada pieza.
                  </p>
                  {/* POR DEFINIR: quién es la artesana y cómo llegó al taller */}
                  <p>
                    Es la estación más tranquila y la más importante: lo que se
                    decide en la mesa se nota en cada punto.
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-2" aria-label="Materiales del taller">
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      Algodón 100% orgánico
                    </li>
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      Relleno hipoalergénico
                    </li>
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      Hecho a mano en El Salvador
                    </li>
                  </ul>
                </Station>

                <Station number={2} title="El patrón" delay={1}>
                  <p>
                    Antes de la aguja, el papel. Cada amigurumi nace en un
                    boceto: el tamaño, la proporción y la vuelta exacta en la
                    que todo empieza a tomar forma.
                  </p>
                  {/* POR DEFINIR: anécdota del primer patrón (ej. cómo nació la forma de un personaje) */}
                  <StitchedNote>
                    Ningún Yamgurumi se repite: cada pieza se teje una sola
                    vez, para la persona que la va a recibir.
                  </StitchedNote>
                </Station>

                <Station number={3} title="La aguja en la mano" delay={1}>
                  <p>
                    Tejer un amigurumi es cuestión de paciencia: vueltas
                    cortas, aumentos escondidos y el relleno justo. La aguja se
                    mueve despacio porque cada punto va a quedar a la vista.
                  </p>
                  {/* POR DEFINIR: verificar tiempo real y tamaños disponibles */}
                  <p>
                    Una pieza chica puede llevar una tarde entera; una grande,
                    varios días. El hilo no se apura.
                  </p>
                </Station>

                <Station number={4} title="El canasto" delay={2}>
                  <p>
                    Cuando el amigurumi está listo, hace su último descanso en
                    el canasto antes de salir del taller. De ahí pasa a una
                    bolsa, y de la bolsa al chat: coordinamos la entrega por
                    WhatsApp.
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-2" aria-label="Zonas de entrega">
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      San Salvador
                    </li>
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      Antiguo Cuscatlán
                    </li>
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      Santa Tecla
                    </li>
                    <li className="rounded-full bg-secondary-container/50 px-3.5 py-1.5 font-label text-label-md font-semibold text-on-secondary-container">
                      Zona norte
                    </li>
                  </ul>
                </Station>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ===== La ventana: lo que sale del taller ===== */}
      <section className="pt-20 sm:pt-24">
        <div className="section-container">
          <div className="stitch-divider mx-auto max-w-7xl" />
          <div className="mx-auto max-w-7xl">
            <ScrollReveal delay={1}>
              <figure className="mx-auto mt-16 max-w-2xl text-center sm:mt-20">
                <span
                  aria-hidden="true"
                  className="font-headline text-6xl leading-none text-tertiary/35"
                >
                  “
                </span>
                <blockquote className="mt-1">
                  <p className="font-headline text-headline-md leading-snug text-primary md:text-headline-lg">
                    {/* POR DEFINIR: testimonio real de una clienta */}
                    No es un peluche: es como recibir un pedacito del taller.
                    Se nota cada punto.
                  </p>
                </blockquote>
                <figcaption className="mt-6 font-label text-label-md font-semibold uppercase tracking-widest text-secondary">
                  — Quien recibe un Yamgurumi
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== La invitación: salir del taller ===== */}
      <section className="pt-20 sm:pt-24">
        <div className="section-container">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-surface-container-lowest px-6 py-14 shadow-card sm:px-12 sm:py-20">
                <YarnBall
                  size={110}
                  className="-bottom-10 -left-8"
                  color="#e3c2b4"
                  opacity={0.35}
                />
                <StitchDots
                  className="right-5 top-5"
                  color="#206776"
                  opacity={0.2}
                />
                <div className="relative mx-auto max-w-2xl text-center">
                  <h2 className="font-headline text-headline-lg leading-tight text-primary md:text-headline-xl">
                    Salí del taller con algo hecho a mano
                  </h2>
                  <p className="mx-auto mt-4 max-w-[52ch] font-body text-body-lg leading-relaxed text-on-surface-variant">
                    El catálogo es la bolsa del taller: todo lo que hay listo
                    hoy, esperándote.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                    <Link
                      href="/catalog"
                      className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 font-label text-label-md font-bold uppercase tracking-widest text-on-secondary shadow-button transition-all hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed active:scale-[0.97] focus-ring tactile-press"
                    >
                      Ver el catálogo
                    </Link>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-whatsapp px-8 py-3.5 font-label text-label-md font-bold uppercase tracking-widest text-white shadow-button transition-all hover:bg-whatsapp-hover active:scale-[0.97] focus-ring tactile-press"
                    >
                      <WhatsAppIcon aria-hidden="true" className="h-5 w-5" />
                      Hablar por WhatsApp
                    </a>
                  </div>
                  <p className="mt-9 font-body text-body-sm text-on-surface-variant/80">
                    Hecho a mano, tejido con amor · El Salvador
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
