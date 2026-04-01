import { getOrCreateSessionId } from "./phishcheck-session";
import type { RiskLevel } from "./phishcheck-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TRACK_URL = `${API_BASE}/track-click`;
/** Max time to wait for the server before opening the link anyway (keeps UX snappy). */
const TRACK_FALLBACK_MS = 450;

export const STAY_PROTECTED_PAGE_CONTEXT = "stay_protected" as const;

export type TrackRecommendationClickInput = {
  toolId: string;
  toolName: string;
  riskLevel: RiskLevel;
  href: string;
  /** Where in the app the CTA lives (default: stay_protected). */
  pageContext?: string;
};

/**
 * POST click telemetry, then open `href` in a new tab (same UX as target=_blank).
 * Waits for the request or TRACK_FALLBACK_MS. If tracking fails, logs a warning and still opens the link.
 * Note: some browsers may block window.open when too far from the click event; we keep the delay short.
 */
export async function trackRecommendationClick(
  input: TrackRecommendationClickInput
): Promise<void> {
  const {
    toolId,
    toolName,
    riskLevel,
    href,
    pageContext = STAY_PROTECTED_PAGE_CONTEXT,
  } = input;

  const sessionId = getOrCreateSessionId();

  const payload = {
    tool_id: toolId,
    tool_name: toolName,
    risk_level: riskLevel.toLowerCase(),
    page_context: pageContext,
    session_id: sessionId || "unknown",
    timestamp: Date.now(),
    href,
  };

  const openDestination = () => {
    const win = window.open(href, "_blank", "noopener,noreferrer");
    if (!win) {
      console.warn(
        "[PhishCheck] New tab may have been blocked. Open the link manually:",
        href
      );
    }
  };

  const trackPromise = fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        console.warn(
          "[PhishCheck] track-click failed:",
          res.status,
          res.statusText
        );
      }
    })
    .catch((err: unknown) => {
      console.warn("[PhishCheck] recommendation click tracking failed", err);
    });

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, TRACK_FALLBACK_MS);
  });

  try {
    await Promise.race([trackPromise, timeoutPromise]);
  } finally {
    openDestination();
  }
}
