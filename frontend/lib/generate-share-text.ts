import type { AnalyzeResponse } from "./phishcheck-types";

const FALLBACK_SHARE_APP_URL = "https://phish-check.vercel.app";

function readConfiguredShareAppUrl(): string {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SHARE_APP_URL
      : undefined;
  const trimmed = raw?.trim();
  if (trimmed) {
    return trimmed.replace(/\/$/, "");
  }
  return FALLBACK_SHARE_APP_URL;
}

/** Public URL shown in shared text; override with NEXT_PUBLIC_SHARE_APP_URL (no trailing slash). */
export const DEFAULT_SHARE_APP_URL = readConfiguredShareAppUrl();

export type GenerateShareTextOptions = {
  appUrl?: string;
  /** Reserved for future: short links, campaign tags, etc. */
};

const MAX_REASONS = 3;

function clampScore(n: unknown): number {
  const v = typeof n === "number" && !Number.isNaN(n) ? n : Number(n);
  if (Number.isNaN(v)) return 0;
  return Math.min(100, Math.max(0, Math.round(v)));
}

/** Collect up to ``max`` unique, non-empty reasons (red flags first, then indicators). */
export function pickShareReasons(
  result: AnalyzeResponse,
  max: number = MAX_REASONS
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const s = String(raw ?? "").trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    out.push(s);
  };
  for (const x of result.red_flags ?? []) {
    if (out.length >= max) break;
    push(x);
  }
  for (const x of result.detected_indicators ?? []) {
    if (out.length >= max) break;
    push(x);
  }
  return out;
}

/**
 * Plain-text blurb for clipboard / future ``navigator.share`` / social previews.
 * For image share cards, reuse ``pickShareReasons`` + the same score/level helpers.
 */
export function generateShareText(
  result: AnalyzeResponse,
  options?: GenerateShareTextOptions
): string {
  const level = String(result?.risk_level ?? "Unknown");
  const pct = clampScore(result?.confidence_score);
  const base = (options?.appUrl ?? DEFAULT_SHARE_APP_URL).replace(/\/$/, "");
  const appLine = `${base}/`;

  const reasons = pickShareReasons(result, MAX_REASONS);

  const lines: string[] = [
    `⚠️ Phishing Risk: ${pct}% (${level})`,
    "",
    `This message was flagged as ${level} risk.`,
    "",
  ];

  if (reasons.length > 0) {
    lines.push("Top issues:");
    for (const r of reasons) {
      lines.push(`• ${r}`);
    }
    lines.push("");
  }

  lines.push("Scan your own messages:", appLine);

  return lines.join("\n");
}
