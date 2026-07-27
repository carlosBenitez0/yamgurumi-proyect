interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-12">
      {subtitle && (
        <p className="font-label text-label-md uppercase tracking-widest text-secondary">
          {subtitle}
        </p>
      )}
      <h2 className="font-headline text-headline-md md:text-headline-lg text-primary">
        {title}
      </h2>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="font-body text-body-sm text-on-surface-variant hover:text-secondary transition-colors mt-2 inline-flex items-center gap-1"
        >
          {actionLabel}
          <span aria-hidden="true" className="text-lg leading-none">→</span>
        </a>
      )}
    </div>
  );
}
