import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { NeedlePair, YarnThread } from "@/components/ui/CraftBackground";
import { MdPalette, MdDraw, MdFavorite, MdCardGiftcard } from "react-icons/md";

const steps = [
  {
    number: "01",
    title: "Diseño & Patrón",
    description: "Seleccionamos la paleta de colores armónica y creamos el patrón único.",
    icon: <MdPalette />,
    bgClass: "bg-secondary text-on-secondary",
  },
  {
    number: "02",
    title: "Puntada a Puntada",
    description: "Tejemos cada pieza artesanalmente con ganchillos de madera fina.",
    icon: <MdDraw />,
    bgClass: "bg-primary text-on-primary",
  },
  {
    number: "03",
    title: "Forma & Ternura",
    description: "Rellenamos con vellón hipoalergénico supersuave que mantiene su forma.",
    icon: <MdFavorite />,
    bgClass: "bg-tertiary text-on-tertiary",
  },
  {
    number: "04",
    title: "Empaque Eco-Love",
    description: "Empaquetamos con papel reciclado, nota personalizada y esencia suave.",
    icon: <MdCardGiftcard />,
    bgClass: "bg-secondary-container text-on-secondary-container",
  },
];

export default function ProcessSteps() {
  return (
    <SectionWrapper id="proceso">
      <div className="relative">
        {/* Craft decorations */}
        <NeedlePair
          className="absolute -top-2 right-12 craft-sway -z-10 hidden lg:block"
          opacity={0.1}
        />
        <YarnThread
          d="M 0 80 Q 400 50, 800 80 T 1200 80"
          color="#f6bab2"
          strokeWidth={1.5}
          opacity={0.1}
          className="absolute bottom-4 left-0 w-full h-24 craft-drift -z-10"
        />

        <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Amor en Cada Punto
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface">
            Nuestra Magia Artesana
          </h2>
          <p className="text-on-surface-variant font-body text-body-md mt-2">
            Conoce el proceso hecho a mano detrás de cada uno de nuestros muñecos amigurumi.
          </p>
        </div>
      </ScrollReveal>

      {/* Grid view for Desktop and Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, index) => (
          <ScrollReveal key={step.title} delay={Math.min(index + 1, 4)}>
            <div className="group bg-surface-container-lowest rounded-3xl p-6 shadow-card hover:shadow-elevation border border-primary-container/20 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 h-full relative">
              {/* Step Badge */}
              <span className="absolute top-4 right-4 text-xs font-bold font-headline text-on-surface-variant/40 bg-surface-container px-2.5 py-1 rounded-full">
                Paso {step.number}
              </span>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-button group-hover:scale-110 transition-transform duration-300 ${step.bgClass}`}
              >
                <span className="text-[32px] flex items-center justify-center">{step.icon}</span>
              </div>

              <h3 className="font-headline text-headline-sm text-on-surface font-bold mb-2">
                {step.title}
              </h3>
              <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                {step.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
      </div>
    </SectionWrapper>
  );
}
