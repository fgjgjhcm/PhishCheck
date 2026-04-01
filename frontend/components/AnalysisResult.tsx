import type { ReactNode } from "react";

import {
  buildResultSummary,
  riskHeadline,
  riskVisuals,
} from "@/lib/analysis-display";
import type { AnalyzeResponse } from "@/lib/phishcheck-types";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-slate-500">
      {children}
    </h3>
  );
}

function ChipList({
  items,
  mono,
  chipItemClass,
}: {
  items: string[];
  mono?: boolean;
  chipItemClass: string;
}) {
  return (
    <ul className="mt-2.5 flex list-none flex-wrap gap-2 p-0">
      {items.map((item, i) => (
        <li key={i}>
          <span
            className={`inline-flex max-w-full rounded-lg border px-2.5 py-1.5 text-[0.8125rem] leading-snug ${chipItemClass} ${
              mono
                ? "break-all font-mono text-[#0F172A]/90"
                : "text-[#0F172A]"
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ProseBlock({
  title,
  accentClass,
  children,
}: {
  title: string;
  accentClass: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm shadow-slate-900/[0.025] sm:p-5 ${accentClass}`}
    >
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
        {children}
      </div>
    </div>
  );
}

function ConfidenceBar({
  value,
  barClass,
  trackClass,
}: {
  value: number;
  barClass: string;
  trackClass: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white/90 px-3.5 py-3 shadow-sm shadow-slate-900/[0.03]">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-slate-500">
          Confidence
        </span>
        <span className="text-base font-semibold tabular-nums text-[#0F172A]">
          {pct}
          <span className="text-sm font-medium text-[#475569]">%</span>
        </span>
      </div>
      <div
        className={`h-2.5 w-full overflow-hidden rounded-full ${trackClass}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AnalysisResult({ result }: { result: AnalyzeResponse }) {
  const visuals = riskVisuals(result.risk_level);
  const headline = riskHeadline(result.risk_level);
  const summary = buildResultSummary(result);

  const hasIndicators = result.detected_indicators.length > 0;
  const hasLinks = result.suspicious_links.length > 0;
  const hasSender = result.sender_signals.length > 0;

  return (
    <article className="min-w-0 animate-result-reveal rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] motion-reduce:animate-none">
      <header
        className={`relative shrink-0 overflow-hidden rounded-t-2xl border-b-2 px-4 py-5 sm:px-5 sm:py-6 ${visuals.headerBorder} ${visuals.headerTint} ${visuals.headerGlow}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${visuals.headerAmbient}`}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/75 to-transparent" />
        <div className="relative space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${visuals.eyebrow}`}
            >
              Result
            </p>
            <span className="inline-flex items-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-blue-950/85">
              {result.analysis_method.replace("+", " + ")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${visuals.badge}`}
            >
              {headline}
            </span>
          </div>

          <p className="text-[0.9375rem] font-medium leading-snug text-slate-800 sm:text-base">
            {summary}
          </p>

          <div className="max-w-md pt-1">
            <ConfidenceBar
              value={result.confidence_score}
              barClass={visuals.bar}
              trackClass={visuals.barTrack}
            />
          </div>
        </div>
      </header>

      <div>
        <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 lg:grid-cols-2">
          {result.red_flags.length > 0 ? (
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
              <SectionTitle>Red flags</SectionTitle>
              <ChipList
                items={result.red_flags}
                chipItemClass={visuals.chipItem}
              />
            </section>
          ) : (
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm lg:col-span-2">
              <SectionTitle>Red flags</SectionTitle>
              <p className="mt-2 text-sm text-slate-500">
                No red flags were listed for this message.
              </p>
            </section>
          )}

          {hasIndicators ? (
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
              <SectionTitle>Detected indicators</SectionTitle>
              <ChipList
                items={result.detected_indicators}
                chipItemClass={visuals.chipItem}
              />
            </section>
          ) : null}

          {hasLinks ? (
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
              <SectionTitle>Suspicious links</SectionTitle>
              <ChipList
                items={result.suspicious_links}
                mono
                chipItemClass={visuals.chipItem}
              />
            </section>
          ) : null}

          {hasSender ? (
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm shadow-slate-900/[0.02] lg:col-span-2">
              <SectionTitle>Sender signals</SectionTitle>
              <ChipList
                items={result.sender_signals}
                mono
                chipItemClass={visuals.chipItem}
              />
            </section>
          ) : null}
        </div>

        <div className="grid gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC]/80 p-4 sm:gap-4 sm:p-5 lg:grid-cols-2">
          <ProseBlock title="Explanation" accentClass={visuals.proseAccent}>
            <p className="whitespace-pre-wrap text-slate-800">
              {result.explanation}
            </p>
          </ProseBlock>
          <ProseBlock title="Recommendation" accentClass={visuals.proseAccent}>
            <p className="whitespace-pre-wrap text-slate-800">
              {result.recommendation}
            </p>
          </ProseBlock>
        </div>
      </div>
    </article>
  );
}
