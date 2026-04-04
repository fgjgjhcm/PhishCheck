/**
 * Canonical site URL for metadata, sitemap, and structured data.
 * Override in production with NEXT_PUBLIC_SITE_URL when using a custom domain.
 */
export const DEFAULT_SITE_URL = "https://phish-check.vercel.app";

export function getSiteUrl(): string {
  const fromEnv =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? process.env.NEXT_PUBLIC_SITE_URL.trim()
      : "";
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
