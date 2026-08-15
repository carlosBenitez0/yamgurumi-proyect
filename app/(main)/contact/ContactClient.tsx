"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

/* ── La vuelta del mensaje ────────────────────────────────
 * Tres puntos (nombre, motivo, mensaje) y el hilo se estira
 * directo al chat del taller. Cada punto se enciende cuando
 * su campo está completo: el progreso codifica lo que falta.
 */

const SUBJECTS: Record<string, string> = {
  custom: "Encargo personalizado",
  piece: "Pregunta por una pieza",
  shipping: "Envío y entrega",
  other: "Otra cosa",
};

const inputClasses =
  "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-3.5 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all";

interface ContactForm {
  name: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: ContactForm = { name: "", subject: "", message: "" };

/* ── Un punto del hilo ──────────────────────────────────── */

function StitchDot({ lit }: { lit: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-surface-container-lowest transition-colors ${
        lit
          ? "border-secondary bg-secondary"
          : "border-outline-variant bg-surface-container-lowest"
      }`}
    >
      {lit && <span className="h-2 w-2 rounded-full bg-white" />}
    </span>
  );
}

/* ── Página ────────────────────────────────────────────── */

export default function ContactClient() {
  const searchParams = useSearchParams();

  // El motivo puede llegar preseleccionado por URL (?subject=custom),
  // por ejemplo desde "Pedir un encargo" del catálogo.
  const [form, setForm] = useState<ContactForm>(() => {
    const subject = searchParams.get("subject");
    return subject && subject in SUBJECTS ? { ...EMPTY_FORM, subject } : EMPTY_FORM;
  });
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "subject" | "message", string>>
  >({});
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const stitches = [
    !!form.name.trim(),
    !!form.subject,
    !!form.message.trim(),
  ];
  const litCount = stitches.filter(Boolean).length;
  const remaining = 3 - litCount;

  const waLink = useMemo(() => {
    const text = [
      "*Mensaje para Yamgurumi*",
      "",
      `*Motivo:* ${SUBJECTS[form.subject] ?? ""}`,
      `*Nombre:* ${form.name.trim()}`,
      "",
      form.message.trim(),
      "",
      "—Enviado desde el sitio web de Yamgurumi",
    ]
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
    return `https://wa.me/50377311064?text=${encodeURIComponent(text)}`;
  }, [form]);

  const setField = (
    key: keyof ContactForm,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key !== "message" || value.trim()) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSend = () => {
    const nextErrors: typeof errors = {};
    if (!form.name.trim())
      nextErrors.name = "Escribe tu nombre para que el taller sepa con quién hablar.";
    if (!form.subject)
      nextErrors.subject = "Elegí el motivo para que el taller sepa cómo ayudarte.";
    if (!form.message.trim())
      nextErrors.message = "Escribe tu mensaje: cada palabra cuenta en el taller.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const target = nextErrors.name
        ? nameRef.current
        : nextErrors.subject
          ? subjectRef.current
          : messageRef.current;
      if (target) {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
      }
      return;
    }

    window.open(waLink, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const statusText =
    remaining > 0
      ? `Faltan ${remaining} ${remaining === 1 ? "punto" : "puntos"} para armar tu mensaje.`
      : "Tu mensaje está listo: el hilo va directo al chat del taller.";

  const hasPreview = form.name.trim() || form.message.trim();

  return (
    <section
      aria-label="Armar un mensaje al taller"
      className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-6 sm:p-8 shadow-card"
    >
      <h2 className="font-headline text-headline-sm sm:text-headline-md font-bold text-primary">
        Armá tu mensaje
      </h2>
      <p className="text-body-sm text-on-surface-variant font-body mt-1.5">
        Tres puntos completos y el hilo se estira hasta el chat del taller.
      </p>

      {/* ── El hilo y sus puntos ─────────────────────── */}
      <div className="mt-7">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-3 right-3 top-[10.5px] h-[3px] rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-outline-variant) 1.6px, transparent 1.8px)",
              backgroundSize: "7px 14px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          />
          <ul className="relative flex justify-between max-w-[280px]">
            <li className="flex flex-col items-center gap-1.5">
              <StitchDot lit={stitches[0]} />
              <span className="font-label text-label-md uppercase tracking-widest text-on-surface-variant font-bold">
                Nombre
              </span>
            </li>
            <li className="flex flex-col items-center gap-1.5">
              <StitchDot lit={stitches[1]} />
              <span className="font-label text-label-md uppercase tracking-widest text-on-surface-variant font-bold">
                Motivo
              </span>
            </li>
            <li className="flex flex-col items-center gap-1.5">
              <StitchDot lit={stitches[2]} />
              <span className="font-label text-label-md uppercase tracking-widest text-on-surface-variant font-bold">
                Mensaje
              </span>
            </li>
          </ul>
        </div>
        <p
          aria-live="polite"
          className="text-body-sm text-on-surface-variant/90 font-body mt-3"
        >
          {statusText}
        </p>
      </div>

      {/* ── La vuelta del formulario ─────────────────── */}
      <div className="flex flex-col gap-4 mt-6">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
          >
            Nombre <span className="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            ref={nameRef}
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Tu nombre"
            className={`${inputClasses} ${errors.name ? "border-error focus:ring-error" : ""}`}
            autoComplete="name"
            required
            aria-required="true"
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              className="text-body-sm text-error font-body mt-1.5"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
          >
            Motivo <span className="text-error" aria-hidden="true">*</span>
          </label>
          <select
            id="contact-subject"
            ref={subjectRef}
            value={form.subject}
            onChange={(e) => setField("subject", e.target.value)}
            className={`${inputClasses} ${errors.subject ? "border-error focus:ring-error" : ""}`}
            required
            aria-required="true"
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          >
            <option value="" disabled>
              Elegí el motivo
            </option>
            {Object.entries(SUBJECTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p
              id="contact-subject-error"
              className="text-body-sm text-error font-body mt-1.5"
              role="alert"
            >
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label mb-1.5"
          >
            Mensaje <span className="text-error" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            ref={messageRef}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            placeholder="Contanos qué pieza te enamoró, qué querés encargar o en qué podemos ayudarte."
            rows={5}
            className={`${inputClasses} resize-y ${errors.message ? "border-error focus:ring-error" : ""}`}
            required
            aria-required="true"
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <p
              id="contact-message-error"
              className="text-body-sm text-error font-body mt-1.5"
              role="alert"
            >
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Así llega tu mensaje ─────────────────────── */}
      {hasPreview && (
        <div className="mt-6">
          <p className="text-label-md uppercase tracking-widest text-on-surface-variant font-bold font-label">
            Así llega tu mensaje al chat del taller
          </p>
          <div className="stitch-tag mt-3 max-w-full px-5 py-4 font-body text-body-sm leading-relaxed text-on-surface-variant">
            <p className="whitespace-pre-wrap">
              {`*Mensaje para Yamgurumi*\nMotivo: ${SUBJECTS[form.subject] ?? ""}\nNombre: ${form.name.trim()}`}
            </p>
            {form.message.trim() && (
              <p className="whitespace-pre-wrap mt-2">{form.message.trim()}</p>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleSend}
        className="w-full flex items-center justify-center gap-2.5 bg-whatsapp text-white px-6 py-3.5 rounded-full font-body text-sm font-bold shadow-button hover:bg-whatsapp-hover transition-all active:scale-[0.97] tactile-press focus-ring mt-6"
      >
        <WhatsAppIcon className="w-[18px] h-[18px] flex-shrink-0" />
        Estirar el hilo a WhatsApp
      </button>
      <p className="text-body-sm text-on-surface-variant/80 font-body mt-3 text-center leading-relaxed">
        Se abre WhatsApp con tu mensaje armado, listo para enviar. Sin
        formularios que se pierden en el camino.
      </p>

      {/* ── Confirmación de envío ─────────────────────── */}
      {sent && (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 bg-secondary-container/40 border border-secondary-container/60 rounded-2xl px-5 py-4"
        >
          <span className="text-secondary text-label-md font-bold uppercase tracking-widest font-label">
            Mensaje armado
          </span>
          <p className="text-body-sm text-on-surface-variant font-body text-center sm:text-left">
            Abrimos WhatsApp con tu mensaje. ¿No se abrió?{" "}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary font-bold hover:underline"
            >
              Ábrelo aquí
            </a>
            .
          </p>
        </div>
      )}
    </section>
  );
}
