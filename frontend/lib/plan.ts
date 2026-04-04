/**
 * Centralized plan / scan-limit logic (MVP: localStorage).
 *
 * Future: Replace storage reads in `resolveProStatus()` with
 * `getUserPlanFromBackend()` + Stripe webhook–backed subscription state.
 */

export const STRIPE_PRO_CHECKOUT_URL =
  "https://buy.stripe.com/dRmaEWfMz5eH5nQ3a387K01";

export const PRO_STORAGE_KEY = "phishcheck_pro";
export const FREE_SCAN_USAGE_KEY = "phishcheck_free_scan_usage";

export const FREE_DAILY_SCAN_LIMIT = 3;

type FreeScanUsage = { day: string; count: number };

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function readFreeUsage(): FreeScanUsage {
  const raw = safeGetItem(FREE_SCAN_USAGE_KEY);
  if (!raw) {
    return { day: localDateKey(), count: 0 };
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "day" in parsed &&
      "count" in parsed
    ) {
      const day = String((parsed as FreeScanUsage).day);
      const count = Number((parsed as FreeScanUsage).count);
      if (day && Number.isFinite(count) && count >= 0) {
        return { day, count };
      }
    }
  } catch {
    /* fall through */
  }
  return { day: localDateKey(), count: 0 };
}

function writeFreeUsage(u: FreeScanUsage): void {
  safeSetItem(FREE_SCAN_USAGE_KEY, JSON.stringify(u));
}

/**
 * Placeholder for server-backed plan resolution.
 * Wire this to your API after auth + Stripe Customer Portal / webhooks update subscription state.
 *
 * Typical flow:
 * - Stripe `checkout.session.completed` / `customer.subscription.updated` webhook → persist plan on user
 * - This function: GET /api/me/plan → { tier: "pro" | "free", ... }
 */
export async function getUserPlanFromBackend(): Promise<"pro" | "free" | null> {
  void 0;
  return null;
}

/**
 * Single place to decide Pro (MVP: localStorage).
 * Later: await `getUserPlanFromBackend()`, cache in memory + optional SWR, and merge with local flag if needed.
 */
function readProFromStorage(): boolean {
  return safeGetItem(PRO_STORAGE_KEY) === "true";
}

export function isProUser(): boolean {
  return readProFromStorage();
}

export function unlockPro(): void {
  safeSetItem(PRO_STORAGE_KEY, "true");
}

export function clearPro(): void {
  safeRemoveItem(PRO_STORAGE_KEY);
}

/** Successful scans used today (free tier only; Pro ignores this for limits). */
export function getTodaySuccessfulScanCount(): number {
  const today = localDateKey();
  const u = readFreeUsage();
  return u.day === today ? u.count : 0;
}

/**
 * Remaining free scans for today, or `"unlimited"` when Pro.
 */
export function getRemainingScans(): number | "unlimited" {
  if (isProUser()) {
    return "unlimited";
  }
  const used = getTodaySuccessfulScanCount();
  return Math.max(0, FREE_DAILY_SCAN_LIMIT - used);
}

export function isScanAllowed(): boolean {
  if (isProUser()) {
    return true;
  }
  return getTodaySuccessfulScanCount() < FREE_DAILY_SCAN_LIMIT;
}

/**
 * Call once per successful analyze response only.
 * Idempotent for the same logical completion is enforced by the caller (single success path).
 */
export function incrementScanUsage(): void {
  if (isProUser()) {
    return;
  }
  const today = localDateKey();
  const u = readFreeUsage();
  const count = u.day === today ? u.count : 0;
  writeFreeUsage({ day: today, count: count + 1 });
}

export function redirectToStripeCheckout(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.location.href = STRIPE_PRO_CHECKOUT_URL;
}
