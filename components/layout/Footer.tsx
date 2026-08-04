import ScrollReveal from "@/components/ui/ScrollReveal";
import { MdAlternateEmail, MdFavorite } from "react-icons/md";

const YarnDivider = () => (
  <div className="relative w-full h-12 overflow-hidden pointer-events-none">
    <svg
      viewBox="0 0 1200 48"
      fill="none"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <path
        d="M0 24 Q 150 8, 300 24 T 600 24 T 900 24 T 1200 24"
        stroke="#e3c2b4"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M0 30 Q 200 14, 400 30 T 800 30 T 1200 30"
        stroke="#acedfe"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        opacity="0.4"
      />
    </svg>
  </div>
);

export default function Footer() {
  return (
    <footer className="w-full relative mt-16 sm:mt-24">
      <YarnDivider />

      <div className="relative bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-high overflow-hidden">
        {/* Knit texture overlay */}
        <div className="absolute inset-0 knit-texture pointer-events-none" />

        {/* Decorative ambient blurs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 section-container py-14 sm:py-18">
          <ScrollReveal>
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {/* Brand Column */}
              <div className="flex flex-col gap-5 text-center md:text-left items-center md:items-start">
                <img
                  alt="Yamgurumi Logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw"
                  className="h-10 sm:h-12 w-auto"
                  style={{ borderRadius: "9999px" }}
                  width={180}
                  height={48}
                />
                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed max-w-sm">
                  Artesanía tejida que cuenta historias. Cada punto es un deseo,
                  cada muñeco es un amigo diseñado para acompañar tus mejores
                  momentos.
                </p>
                <div className="flex gap-3 mt-1">
                  {[
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      ),
                      label: "Facebook",
                      href: "#",
                    },
                    {
                      icon: <MdAlternateEmail />,
                      label: "Email",
                      href: "mailto:hola@yamgurumi.com",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      ),
                      label: "WhatsApp",
                      href: "https://wa.me/50377311064",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      ),
                      label: "TikTok",
                      href: "#",
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="w-11 h-11 flex items-center justify-center bg-surface-container-lowest/80 rounded-full text-secondary hover:bg-secondary hover:text-on-secondary tactile-press transition-all shadow-sm border border-primary-container/15"
                    >
                      <span className="text-[20px] flex items-center justify-center">
                        {item.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Column */}
              <div className="flex flex-col gap-3 text-center md:text-left items-center md:items-start">
                <h4 className="font-bold text-on-surface mb-2 font-headline text-headline-sm">
                  Enlaces Útiles
                </h4>
                 {[
                   { label: "Política de Privacidad", href: "#" },
                   { label: "Envíos y Entregas", href: "#" },
                   { label: "Ventas al Mayor", href: "#" },
                   { label: "Preguntas Frecuentes", href: "#" },
                   { label: "Contacto", href: "/contact" },
                   { label: "Encargos personalizados", href: "/contact?subject=custom" },
                 ].map((link) => (
                   <a
                     key={link.label}
                     href={link.href}
                     className="text-on-surface-variant/80 hover:text-secondary font-body text-body-sm py-1 transition-all duration-[400ms] hover:translate-x-1"
                     style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                   >
                     {link.label}
                   </a>
                 ))}
              </div>

              {/* Visit Column */}
              <div className="flex flex-col gap-3 text-center md:text-left items-center md:items-start">
                <h4 className="font-bold text-on-surface mb-2 font-headline text-headline-sm">
                  Estudio Yamgurumi
                </h4>
                <div className="text-on-surface-variant font-body text-body-sm space-y-1">
                  <p>Calle de la Ternura, 123</p>
                  <p>Estudio de Crochet &quot;El Ovillo&quot;</p>
                  <p>San Salvador, El Salvador</p>
                </div>
                <p className="text-on-surface-variant font-body text-body-sm mt-1">
                  <span className="font-semibold text-on-surface">
                    Horario:
                  </span>{" "}
                  Lun-Vie 10:00 - 19:00
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary-container/30 rounded-full border border-primary-container/40">
                  <MdFavorite className="text-tertiary text-[14px]" />
                  <span className="font-body text-body-sm text-on-primary-container font-medium">
                    Hecho con amor en El Salvador
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-outline-variant/20 section-container">
          <div className="max-w-7xl w-full py-5 flex items-center justify-center text-center">
            <p className="font-body text-body-sm text-on-surface-variant">
              &copy; {new Date().getFullYear()} Yamgurumi Studio. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
