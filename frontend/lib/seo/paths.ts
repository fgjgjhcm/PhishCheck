/** Stable paths for internal links and sitemap. */
export const SEO_PATHS = {
  home: "/",
  phishingChecker: "/phishing-checker",
  emailScamChecker: "/email-scam-checker",
  textScamChecker: "/text-message-scam-checker",
  guidesIndex: "/guides",
  guideEmailPhishing: "/guides/how-to-tell-if-an-email-is-a-phishing-scam",
  guideTextScam: "/guides/signs-a-text-message-is-a-scam",
  guidePaypal: "/guides/paypal-phishing-email-example",
  guideAmazon: "/guides/amazon-scam-email-example",
  guideLinkSafe: "/guides/how-to-check-if-a-link-is-safe",
} as const;

export const GUIDE_SLUGS = [
  "how-to-tell-if-an-email-is-a-phishing-scam",
  "signs-a-text-message-is-a-scam",
  "paypal-phishing-email-example",
  "amazon-scam-email-example",
  "how-to-check-if-a-link-is-safe",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];
