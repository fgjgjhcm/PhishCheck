"use client";

import { useTheme } from "@/components/ThemeProvider";
import { THEMES, type ThemeId } from "@/lib/theme-constants";

const LABELS: Record<ThemeId, string> = {
  light: "Light",
  dark: "Dark",
  terminal: "Terminal",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-1 sm:items-end">
      <label
        htmlFor="ph-theme"
        className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-ph-muted"
      >
        Theme
      </label>
      <select
        id="ph-theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeId)}
        className="min-w-[9.5rem] cursor-pointer rounded-lg border border-ph-border bg-ph-input py-2 pl-3 pr-8 text-sm font-medium text-ph-text shadow-sm transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-ph-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)]"
        aria-label="Color theme"
      >
        {THEMES.map((id) => (
          <option key={id} value={id}>
            {LABELS[id]}
          </option>
        ))}
      </select>
    </div>
  );
}
