import { riskHeadline } from "./analysis-display";
import type { AnalyzeResponse } from "./phishcheck-types";

export function formatReport(
  messageText: string,
  messageHeaders: string,
  result: AnalyzeResponse
): string {
  const excerpt =
    messageText.length > 600
      ? `${messageText.slice(0, 600).trim()}\n… (truncated)`
      : messageText;

  const lines: string[] = [
    "PhishCheck — analysis report",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Assessment: ${riskHeadline(result.risk_level)}`,
    `Confidence: ${result.confidence_score}%`,
    `Method: ${result.analysis_method}`,
    "",
    "--- Message (excerpt) ---",
    excerpt || "(empty)",
    "",
  ];

  if (messageHeaders.trim()) {
    lines.push("--- Headers (excerpt) ---");
    lines.push(
      messageHeaders.length > 800
        ? `${messageHeaders.slice(0, 800).trim()}\n… (truncated)`
        : messageHeaders.trim()
    );
    lines.push("");
  }

  if (result.red_flags.length) {
    lines.push("Red flags:");
    result.red_flags.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
  }
  if (result.detected_indicators.length) {
    lines.push("Detected indicators:");
    result.detected_indicators.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
  }
  if (result.suspicious_links.length) {
    lines.push("Suspicious links:");
    result.suspicious_links.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
  }
  if (result.sender_signals.length) {
    lines.push("Sender signals:");
    result.sender_signals.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
  }

  lines.push("Explanation:");
  lines.push(result.explanation);
  lines.push("");
  lines.push("Recommendation:");
  lines.push(result.recommendation);
  lines.push("");
  lines.push(
    "Disclaimer: This tool provides an AI-generated risk assessment and should not be the sole basis for security decisions."
  );

  return lines.join("\n");
}
