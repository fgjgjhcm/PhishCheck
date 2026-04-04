export const THEME_STORAGE_KEY = "phishcheck-theme";

export const THEMES = ["light", "dark", "terminal"] as const;

export type ThemeId = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeId = "dark";

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.includes(value as ThemeId);
}
