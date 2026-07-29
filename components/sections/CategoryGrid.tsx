import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StitchDots, YarnThread } from "@/components/ui/CraftBackground";
import { MdPets, MdAutoAwesome, MdChair, MdFavorite, MdStorefront, MdChevronRight } from "react-icons/md";
import Link from "next/link";

const categories = [
  {
    name: "Animales & Mascotas",
    subtitle: "6 modelos",
    icon: <MdPets />,
    bgClass: "bg-primary-container",
    labelColor: "text-white",
    gradientFrom: "from-primary/80 via-primary/40",
    imageUrl:
      "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Personajes Mágicos",
    subtitle: "22 modelos",
    icon: <MdAutoAwesome />,
    bgClass: "bg-secondary-container",
    labelColor: "text-white",
    gradientFrom: "from-secondary/80 via-secondary/40",
    imageUrl:
      "https://images.unsplash.com/photo-1744371760034-fb60ebd2b198?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Decoración & Hogar",
    subtitle: "18 piezas",
    icon: <MdChair />,
    bgClass: "bg-surface-variant",
    labelColor: "text-white",
    gradientFrom: "from-on-surface-variant/80 via-on-surface-variant/40",
    imageUrl:
      "https://images.unsplash.com/photo-1682456138620-6076ac071b51?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Encargos Especiales",
    subtitle: "Personalizado",
    icon: <MdFavorite />,
    bgClass: "bg-tertiary-container",
    labelColor: "text-white",
    gradientFrom: "from-tertiary/80 via-tertiary/40",
    imageUrl:
      "https://images.unsplash.com/photo-1753370241739-1d53df4fe604?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
];

export default function CategoryGrid() {
  return (
    <SectionWrapper id="categorias">
      <div className="relative">
        {/* Craft decorations */}
        <StitchDots className="top-4 right-8 craft-drift opacity-60 hidden md:block" />
        <YarnThread
          d="M 0 50 Q 300 20, 600 50 T 1200 50"
          color="#acedfe"
          strokeWidth={1.5}
          dashArray="6 6"
          opacity={0.12}
          className="absolute bottom-0 left-0 w-full h-20 craft-sway -z-10"
        />

        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Colecciones Exclusivas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface">
              Explora por Estilo y Temática
            </h2>
            <p className="text-on-surface-variant font-body text-body-md mt-2">
              Cada categoría está llena de ternura y confeccionada con hilo 100% hipoalergénico.
            </p>
          </div>
        </ScrollReveal>

        {/* Simple grid: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={Math.min(i + 1, 4)}>
              <Link
                href={`/categoria/Muñecos`}
                className="group relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-card hover:shadow-elevation transition-all duration-300 active:scale-[0.98] border border-primary-container/20 block aspect-[4/5] sm:aspect-square"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url('${cat.imageUrl}')` }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.gradientFrom} to-transparent flex flex-col justify-end p-4 sm:p-5`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[18px] text-white/90 flex-shrink-0">
                      {cat.icon}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                      {cat.subtitle}
                    </span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-headline font-bold ${cat.labelColor} drop-shadow-md`}>
                    <span className="truncate block">{cat.name}</span>
                  </h3>
                </div>
              </Link>
            </ScrollReveal>
          ))}

          {/* "Ver más" card */}
          <ScrollReveal delay={5}>
            <Link
              href="/catalogo"
              className="block h-full group/card"
            >
              <div className="h-full bg-surface-container-lowest/60 rounded-3xl border-2 border-dashed border-primary-container/30 flex flex-col items-center justify-center gap-2 p-4 transition-all duration-300 hover:border-secondary/40 hover:bg-surface-container-lowest/90 hover:shadow-card aspect-[4/5] sm:aspect-square">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                  <MdStorefront className="text-[24px] text-secondary" />
                </div>
                <span className="font-headline text-sm font-bold text-on-surface text-center leading-tight">
                  Ver más<br />categorías
                </span>
                <span className="text-[11px] font-body font-semibold text-secondary group-hover/card:translate-x-1 transition-transform duration-300 flex items-center gap-1 mt-1">
                  Explorar <MdChevronRight className="text-[14px]" />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
