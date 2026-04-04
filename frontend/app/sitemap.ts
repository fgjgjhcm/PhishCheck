import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-config";
import { GUIDE_SLUGS, SEO_PATHS } from "@/lib/seo/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastMod = new Date();

  const staticPaths = [
    SEO_PATHS.home,
    SEO_PATHS.phishingChecker,
    SEO_PATHS.emailScamChecker,
    SEO_PATHS.textScamChecker,
    SEO_PATHS.guidesIndex,
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: lastMod,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.85,
  }));

  const guideEntries: MetadataRoute.Sitemap = GUIDE_SLUGS.map((slug) => ({
    url: `${base}/guides/${slug}`,
    lastModified: lastMod,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...guideEntries];
}
