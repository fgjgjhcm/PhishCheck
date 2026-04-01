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
      className="mt-6 border-t border-slate-200/90 pt-6"
      aria-labelledby="stay-protected-heading"
    >
      <h2
        id="stay-protected-heading"
        className="text-base font-semibold leading-snug tracking-tight text-slate-800 sm:text-[1.0625rem]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
        {subtitle}
      </p>

      <ul className="mt-4 grid list-none gap-3 p-0">
        {STAY_PROTECTED_ITEMS.map((item) => {
          const emphasized = Boolean(item.emphasized);
          return (
            <li key={item.id}>
              <div
                className={`rounded-xl px-4 py-3.5 shadow-sm shadow-slate-900/[0.025] transition duration-150 ${
                  emphasized
                    ? "border border-[#BFDBFE]/90 bg-[#EFF6FF]/45 ring-1 ring-[#2563EB]/12 hover:bg-[#EFF6FF]/65"
                    : "border border-slate-200/90 bg-white/90 hover:border-slate-300/90 hover:bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold tracking-tight text-slate-800">
                    {item.category}
                  </p>
                  {emphasized ? (
                    <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.05em] text-slate-600 ring-1 ring-slate-200/80">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.rationale}
                </p>
                <p className="mt-3">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      /* Let modified clicks use native new-tab behavior */
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
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/25 underline-offset-2 transition hover:text-[#1E40AF] hover:decoration-[#1E40AF]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:ring-offset-2 rounded-sm"
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

      <p className="mt-4 text-[0.6875rem] leading-relaxed text-slate-400">
        We only recommend widely trusted security tools. No sponsored placements.
      </p>
    </aside>
  );
}
