import type { AnalyzeResponse, RiskLevel } from "./phishcheck-types";

export function riskHeadline(level: RiskLevel): string {
  switch (level) {
    case "High":
      return "High Risk — Likely Phishing";
    case "Medium":
      return "Medium Risk — Use Caution";
    default:
      return "Low Risk — Probably Safe";
  }
}

function mentionsUrgency(texts: string[]): boolean {
  const blob = texts.join(" ").toLowerCase();
  return /\burg(en|e|ency)|immediately|asap|within\s+\d+|act\s+now|24\s*hours|deadline|suspended|verify\s+now/i.test(
    blob
  );
}

function mentionsImpersonation(signals: string[], texts: string[]): boolean {
  const blob = [...signals, ...texts].join(" ").toLowerCase();
  return (
    /dkim|spf|dmarc|microsoft|google|apple|amazon|paypal|ceo|it\s+support|security|bank|brand|impersonat|mimic|spoof/i.test(
      blob
    ) || signals.length > 0
  );
}

/** Short, demo-ready summary derived from structured fields (no extra API). */
export function buildResultSummary(result: AnalyzeResponse): string {
  const { risk_level, red_flags, detected_indicators, suspicious_links, sender_signals } =
    result;
  const cueTexts = [...red_flags, ...detected_indicators];

  if (risk_level === "Low") {
    return "This message appears relatively safe based on the content provided.";
  }

  if (risk_level === "Medium") {
    return "This message shows some suspicious traits, but the risk is not conclusive.";
  }

  // High
  const urgent = mentionsUrgency(cueTexts);
  const impersonation = mentionsImpersonation(sender_signals, cueTexts);

  if (impersonation && urgent) {
    return "This message strongly resembles a phishing attempt involving impersonation and urgent requests.";
  }
  if (suspicious_links.length > 0 && (urgent || impersonation)) {
    return "This message strongly resembles a phishing attempt involving suspicious links and high-pressure tactics.";
  }
  if (impersonation) {
    return "This message strongly resembles a phishing attempt involving impersonation or brand-mimicry signals.";
  }
  if (suspicious_links.length > 0) {
    return "This message strongly resembles a phishing attempt involving suspicious links.";
  }
  if (red_flags.length >= 3) {
    return "This message strongly resembles a phishing attempt with multiple overlapping red flags.";
  }
  return "This message strongly resembles a phishing attempt based on several high-risk patterns.";
}

/** Styling tokens reference CSS variables set per `[data-theme]` in `globals.css`. */
export function riskVisuals(level: RiskLevel): {
  badge: string;
  bar: string;
  barTrack: string;
  headerTint: string;
  headerBorder: string;
  headerGlow: string;
  headerAmbient: string;
  chipItem: string;
  proseAccent: string;
  eyebrow: string;
} {
  switch (level) {
    case "High":
      return {
        badge:
          "bg-[var(--ph-rh-badge)] text-[var(--ph-rh-badge-fg)] shadow-sm ring-1 ring-[var(--ph-rh-ring)]",
        bar: "bg-[var(--ph-rh-bar)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        barTrack:
          "bg-[var(--ph-rh-track)] ring-1 ring-[var(--ph-rh-track-ring)]",
        headerTint:
          "bg-gradient-to-br from-[var(--ph-rh-h-from)] via-[var(--ph-rh-h-via)] to-[var(--ph-rh-h-to)]",
        headerBorder: "border-[var(--ph-rh-h-border)]",
        headerGlow: "shadow-[var(--ph-rh-h-glow)]",
        headerAmbient: "[background-image:var(--ph-rh-ambient)]",
        chipItem:
          "border border-[var(--ph-rh-chip-border)] bg-[var(--ph-rh-chip-bg)] text-[var(--ph-rh-chip-fg)] shadow-sm",
        proseAccent:
          "border-l-[3px] border-[var(--ph-rh-prose-border)] bg-[var(--ph-rh-prose-bg)] pl-5 sm:pl-6",
        eyebrow: "text-[var(--ph-rh-eyebrow)]",
      };
    case "Medium":
      return {
        badge:
          "bg-[var(--ph-rm-badge)] text-[var(--ph-rm-badge-fg)] shadow-sm ring-1 ring-[var(--ph-rm-ring)]",
        bar: "bg-[var(--ph-rm-bar)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        barTrack:
          "bg-[var(--ph-rm-track)] ring-1 ring-[var(--ph-rm-track-ring)]",
        headerTint:
          "bg-gradient-to-br from-[var(--ph-rm-h-from)] via-[var(--ph-rm-h-via)] to-[var(--ph-rm-h-to)]",
        headerBorder: "border-[var(--ph-rm-h-border)]",
        headerGlow: "shadow-[var(--ph-rm-h-glow)]",
        headerAmbient: "[background-image:var(--ph-rm-ambient)]",
        chipItem:
          "border border-[var(--ph-rm-chip-border)] bg-[var(--ph-rm-chip-bg)] text-[var(--ph-rm-chip-fg)] shadow-sm",
        proseAccent:
          "border-l-[3px] border-[var(--ph-rm-prose-border)] bg-[var(--ph-rm-prose-bg)] pl-5 sm:pl-6",
        eyebrow: "text-[var(--ph-rm-eyebrow)]",
      };
    default:
      return {
        badge:
          "bg-[var(--ph-rl-badge)] text-[var(--ph-rl-badge-fg)] shadow-sm ring-1 ring-[var(--ph-rl-ring)]",
        bar: "bg-[var(--ph-rl-bar)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        barTrack:
          "bg-[var(--ph-rl-track)] ring-1 ring-[var(--ph-rl-track-ring)]",
        headerTint:
          "bg-gradient-to-br from-[var(--ph-rl-h-from)] via-[var(--ph-rl-h-via)] to-[var(--ph-rl-h-to)]",
        headerBorder: "border-[var(--ph-rl-h-border)]",
        headerGlow: "shadow-[var(--ph-rl-h-glow)]",
        headerAmbient: "[background-image:var(--ph-rl-ambient)]",
        chipItem:
          "border border-[var(--ph-rl-chip-border)] bg-[var(--ph-rl-chip-bg)] text-[var(--ph-rl-chip-fg)] shadow-sm",
        proseAccent:
          "border-l-[3px] border-[var(--ph-rl-prose-border)] bg-[var(--ph-rl-prose-bg)] pl-5 sm:pl-6",
        eyebrow: "text-[var(--ph-rl-eyebrow)]",
      };
  }
}
