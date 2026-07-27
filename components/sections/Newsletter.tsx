'use client'

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { YarnThread, StitchDots } from "@/components/ui/CraftBackground";
import { MdCheckCircle } from "react-icons/md";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <SectionWrapper className="mb-12 sm:mb-20 relative">
      {/* Craft decorations */}
      <StitchDots className="-top-4 left-8 craft-drift opacity-50 hidden md:block" />
      <YarnThread
        d="M 0 40 Q 300 10, 600 40 T 1200 40"
        color="#acedfe"
        strokeWidth={1.5}
        dashArray="6 6"
        opacity={0.1}
        className="absolute top-0 left-0 w-full h-16 craft-sway -z-10"
      />

      <ScrollReveal>
        <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-high rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-elevation border border-primary-container/30 text-center flex flex-col items-center">
          
          {/* Decorative background blur elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest bg-secondary-container/50 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Comunidad Yamgurumi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-surface mb-3">
              Únete a Nuestra Familia de Crochet
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant font-body leading-relaxed mb-8">
              Recibe un <strong className="text-primary font-semibold">10% de descuento</strong> en tu primer pedido, acceso anticipado a nuevas colecciones y patrones gratuitos mensuales.
            </p>

            {status === "success" ? (
              <div className="bg-secondary-container/60 border border-secondary/30 rounded-2xl px-6 py-4 inline-flex items-center gap-3 animate-fade-in shadow-sm">
                <MdCheckCircle className="text-secondary text-[28px]" />
                <span className="font-body text-body-md text-on-surface font-semibold">
                  ¡Gracias por unirte! Te hemos enviado tu cupón al correo.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex flex-col sm:flex-row gap-3 items-center justify-center"
              >
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-3.5 w-full sm:flex-1 focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md transition-all outline-none font-body text-on-surface placeholder:text-on-surface-variant/50 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-secondary text-on-secondary font-bold px-7 py-3.5 rounded-full hover:bg-secondary/90 tactile-press transition-all disabled:opacity-50 font-body text-body-md whitespace-nowrap shadow-button w-full sm:w-auto"
                  style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Suscribirme"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
