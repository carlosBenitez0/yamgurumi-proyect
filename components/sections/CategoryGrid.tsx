import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StitchDots, YarnThread } from "@/components/ui/CraftBackground";
import { MdPets, MdAutoAwesome, MdChair, MdFavorite, MdArrowForward } from "react-icons/md";

const categories = [
  {
    name: "Animales & Mascotas",
    subtitle: "34 modelos",
    icon: <MdPets />,
    colSpan: "lg:col-span-2 lg:row-span-2",
    bgClass: "bg-primary-container",
    labelColor: "text-white",
    gradientFrom: "from-primary/80 via-primary/40",
    pClass: "p-6 sm:p-8",
    headlineClass: "text-2xl sm:text-3xl font-headline font-bold",
    imageUrl:
      "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Personajes Mágicos",
    subtitle: "22 modelos",
    icon: <MdAutoAwesome />,
    colSpan: "lg:col-span-2 lg:row-span-1",
    bgClass: "bg-secondary-container",
    labelColor: "text-white",
    gradientFrom: "from-secondary/80 via-secondary/40",
    pClass: "p-5 sm:p-6",
    headlineClass: "text-xl sm:text-2xl font-headline font-bold",
    imageUrl:
      "https://images.unsplash.com/photo-1744371760034-fb60ebd2b198?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Decoración & Hogar",
    subtitle: "18 piezas",
    icon: <MdChair />,
    colSpan: "lg:col-span-1 lg:row-span-1",
    bgClass: "bg-surface-variant",
    labelColor: "text-white",
    gradientFrom: "from-on-surface-variant/80 via-on-surface-variant/40",
    pClass: "p-5",
    headlineClass: "text-lg font-headline font-bold",
    imageUrl:
      "https://images.unsplash.com/photo-1682456138620-6076ac071b51?fm=jpg&q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Encargos Especiales",
    subtitle: "Personalizado",
    icon: <MdFavorite />,
    colSpan: "lg:col-span-1 lg:row-span-1",
    bgClass: "bg-tertiary-container",
    labelColor: "text-white",
    gradientFrom: "from-tertiary/80 via-tertiary/40",
    pClass: "p-5",
    headlineClass: "text-lg font-headline font-bold",
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

      {/* Bento Grid: 1-col in mobile, 2-col in tablet, 4-col in desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-[220px] sm:auto-rows-[240px]">
        {categories.map((cat, i) => (
          <ScrollReveal key={cat.name} delay={Math.min(i + 1, 4)}>
            <a
              href="#tienda"
              className={`${cat.colSpan} group relative overflow-hidden rounded-3xl ${cat.bgClass} shadow-card hover:shadow-elevation transition-all duration-300 active:scale-[0.99] border border-primary-container/20 block cursor-pointer h-full`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${cat.imageUrl}')` }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.gradientFrom} to-transparent flex flex-col justify-end ${cat.pClass} transition-opacity duration-300`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[20px] text-white/90 flex items-center justify-center">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {cat.subtitle}
                  </span>
                </div>
                <h3 className={`${cat.headlineClass} ${cat.labelColor} drop-shadow-md flex items-center justify-between`}>
                  <span>{cat.name}</span>
                  <MdArrowForward className="text-[24px] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
      </div>
    </SectionWrapper>
  );
}
