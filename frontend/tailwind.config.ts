import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ph: {
          page: "var(--ph-page-bg)",
          card: "var(--ph-card)",
          input: "var(--ph-input-bg)",
          primary: "var(--ph-primary)",
          "primary-hover": "var(--ph-primary-hover)",
          text: "var(--ph-text)",
          muted: "var(--ph-text-secondary)",
          danger: "var(--ph-danger)",
          border: "var(--ph-border)",
          "border-subtle": "var(--ph-border-subtle)",
          panel: "var(--ph-panel)",
          "panel-muted": "var(--ph-panel-muted)",
          "accent-soft": "var(--ph-accent-soft)",
          "accent-border": "var(--ph-accent-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "result-reveal": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "result-reveal": "result-reveal 0.28s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
