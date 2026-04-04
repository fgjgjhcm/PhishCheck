import {
  stayProtectedSectionMeta,
  STAY_PROTECTED_ITEMS,
} from "@/config/stay-protected-recommendations";
import type { RiskLevel } from "@/lib/phishcheck-types";
import { trackRecommendationClick } from "@/lib/track-recommendation-click";

type StayProtectedSectionProps = {
  riskLevel: RiskLevel;
};

export function StayProtectedSection({ riskLevel }: StayProtectedSectionProps) {
  const meta = stayProtectedSectionMeta(riskLevel);
  if (!meta) {
    return null;
  }

  const { title, subtitle } = meta;

  return (
    <aside
      className="mt-6 border-t border-ph-border pt-6 transition-[border-color] duration-200"
      aria-labelledby="stay-protected-heading"
    >
      <h2
        id="stay-protected-heading"
        className="text-base font-semibold leading-snug tracking-tight text-ph-text sm:text-[1.0625rem]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ph-muted">
        {subtitle}
      </p>

      <ul className="mt-4 grid list-none gap-3 p-0">
        {STAY_PROTECTED_ITEMS.map((item) => {
          const emphasized = Boolean(item.emphasized);
          return (
            <li key={item.id}>
              <div
                className={`rounded-xl px-4 py-3.5 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 ${
                  emphasized
                    ? "border border-ph-accent-border bg-ph-accent-soft/50 ring-1 ring-ph-primary/15 hover:bg-ph-accent-soft/80"
                    : "border border-ph-border bg-ph-card/90 hover:border-ph-border-subtle hover:bg-ph-card"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold tracking-tight text-ph-text">
                    {item.category}
                  </p>
                  {emphasized ? (
                    <span className="inline-flex rounded-full bg-ph-card/90 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.05em] text-ph-muted ring-1 ring-ph-border transition-colors duration-200">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ph-muted">
                  {item.rationale}
                </p>
                <p className="mt-3">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                        return;
                      }
                      e.preventDefault();
                      void trackRecommendationClick({
                        toolId: item.id,
                        toolName: item.category,
                        riskLevel,
                        href: item.href,
                      });
                    }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ph-link)] underline decoration-[var(--ph-link)]/30 underline-offset-2 transition hover:text-[var(--ph-link-hover)] hover:decoration-[var(--ph-link-hover)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)] rounded-sm"
                  >
                    {item.ctaLabel}
                    <span aria-hidden className="text-xs font-normal opacity-70">
                      ↗
                    </span>
                  </a>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[0.6875rem] leading-relaxed text-ph-muted/80">
        We only recommend widely trusted security tools. No sponsored placements.
      </p>
    </aside>
  );
}
