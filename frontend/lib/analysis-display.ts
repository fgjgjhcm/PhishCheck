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
          "bg-[#DC2626] text-white shadow-sm shadow-red-900/20 ring-1 ring-red-900/10",
        bar: "bg-[#DC2626] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        barTrack: "bg-[#FEF2F2] ring-1 ring-red-200/70",
        headerTint:
          "bg-gradient-to-br from-[#FEF2F2]/90 via-white to-[#F8FAFC]",
        headerBorder: "border-red-200/40",
        headerGlow:
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_0_0_1px_rgba(220,38,38,0.05),0_12px_36px_-16px_rgba(220,38,38,0.12)]",
        headerAmbient:
          "bg-[radial-gradient(ellipse_95%_85%_at_50%_-15%,rgba(220,38,38,0.11),transparent_58%)]",
        chipItem:
          "border-red-200/80 bg-[#FEF2F2] text-red-900 shadow-sm shadow-red-900/[0.04]",
        proseAccent:
          "border-l-[3px] border-[#DC2626]/85 bg-[#FEF2F2]/60 pl-5 sm:pl-6",
        eyebrow: "text-[#991B1B]",
      };
    case "Medium":
      return {
        badge:
          "bg-[#D97706] text-white shadow-sm shadow-amber-900/15 ring-1 ring-amber-900/10",
        bar: "bg-[#D97706] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        barTrack: "bg-[#FFFBEB] ring-1 ring-amber-200/70",
        headerTint:
          "bg-gradient-to-br from-[#FFFBEB]/90 via-white to-[#F8FAFC]",
        headerBorder: "border-amber-200/45",
        headerGlow:
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_0_0_1px_rgba(217,119,6,0.06),0_12px_36px_-16px_rgba(217,119,6,0.1)]",
        headerAmbient:
          "bg-[radial-gradient(ellipse_95%_85%_at_50%_-15%,rgba(217,119,6,0.1),transparent_58%)]",
        chipItem:
          "border-amber-200/85 bg-[#FFFBEB] text-amber-950 shadow-sm shadow-amber-900/[0.04]",
        proseAccent:
          "border-l-[3px] border-[#D97706]/80 bg-[#FFFBEB]/70 pl-5 sm:pl-6",
        eyebrow: "text-[#B45309]",
      };
    default:
      return {
        badge:
          "bg-[#059669] text-white shadow-sm shadow-emerald-900/12 ring-1 ring-emerald-900/10",
        bar: "bg-[#059669] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        barTrack: "bg-[#ECFDF5] ring-1 ring-emerald-200/65",
        headerTint:
          "bg-gradient-to-br from-[#ECFDF5]/90 via-white to-[#F8FAFC]",
        headerBorder: "border-emerald-200/40",
        headerGlow:
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_0_0_1px_rgba(5,150,105,0.05),0_12px_36px_-16px_rgba(5,150,105,0.09)]",
        headerAmbient:
          "bg-[radial-gradient(ellipse_95%_85%_at_50%_-15%,rgba(5,150,105,0.09),transparent_58%)]",
        chipItem:
          "border-emerald-200/80 bg-[#ECFDF5] text-emerald-950 shadow-sm shadow-emerald-900/[0.03]",
        proseAccent:
          "border-l-[3px] border-[#059669]/75 bg-[#ECFDF5]/60 pl-5 sm:pl-6",
        eyebrow: "text-[#047857]",
      };
  }
}
