type PhishCheckLogoMarkProps = {
  className?: string;
  /** When true, the mark is hidden from assistive tech (use beside a visible product title). */
  decorative?: boolean;
  /** Soft circular frame with brand-tinted gradient (header use; keep false for raw SVG e.g. icons). */
  framed?: boolean;
};

/** Minimal shield + check mark for PhishCheck (inline SVG, scales cleanly). */
export function PhishCheckLogoMark({
  className = "h-6 w-6 text-ph-primary",
  decorative = true,
  framed = false,
}: PhishCheckLogoMarkProps) {
  const mark = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-hidden={decorative}
      aria-label={decorative ? undefined : "PhishCheck"}
      role={decorative ? "presentation" : "img"}
    >
      <path
        fill="currentColor"
        d="M12 2.5 5.5 5.1V11C5.5 15.45 8.35 19.05 12 20.35 15.65 19.05 18.5 15.45 18.5 11V5.1L12 2.5z"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.6 12l2.4 2.3L15.6 9"
      />
    </svg>
  );

  if (!framed) {
    return mark;
  }

  return (
    <span className="inline-flex shrink-0 rounded-full bg-gradient-to-br from-ph-accent-soft via-ph-accent-soft to-ph-panel-muted p-1.5 ring-1 ring-ph-accent-border shadow-sm transition-[background-color,box-shadow] duration-200 sm:p-2">
      {mark}
    </span>
  );
}
