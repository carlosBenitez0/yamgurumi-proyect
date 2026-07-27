interface SectionWrapperProps {
  children: React.ReactNode;
  /** Clases adicionales para el section exterior */
  className?: string;
  /** ID para anclaje de navegación */
  id?: string;
  /** Si es true, no aplica el padding vertical estándar */
  noPadding?: boolean;
  /** Si es true, la sección NO tendrá contenedor max-w-7xl (contenido full-width) */
  fullWidth?: boolean;
  /** Clases para el contenedor interior */
  innerClassName?: string;
}

/**
 * Wrapper unificado para todas las secciones de la página.
 *
 * Estrategia de centrado:
 * - El <section> exterior usa la clase `section-container` que aplica
 *   `padding-inline: max(1rem, calc((100% - 80rem) / 2 + 1rem))`
 *   Esto CENTRA el contenido sin depender de `margin: auto`.
 * - El <div> interior solo define el ancho máximo (max-w-7xl).
 * - En pantallas grandes el padding crece para mantener el contenido centrado a 80rem.
 * - En pantallas chicas el padding mínimo es 1rem/1.5rem/2rem.
 * - Los backgrounds en el section ocupan todo el viewport (el padding es interno).
 */
export default function SectionWrapper({
  children,
  className = "",
  id,
  noPadding = false,
  fullWidth = false,
  innerClassName = "",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`w-full section-container ${
        !noPadding ? "py-16 sm:py-20 md:py-24" : ""
      } ${className}`}
    >
      <div
        className={
          fullWidth
            ? `w-full ${innerClassName}`
            : `max-w-7xl w-full ${innerClassName}`
        }
      >
        {children}
      </div>
    </section>
  );
}
