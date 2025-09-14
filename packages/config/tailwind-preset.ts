import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const preset: Partial<Config> = {
  darkMode: ["class", "[data-theme=dark]"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
          soft: "rgb(var(--bg-soft) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
          subtle: "rgb(var(--fg-subtle) / <alpha-value>)",
          invert: "rgb(var(--fg-invert) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          fg: "rgb(var(--brand-fg) / <alpha-value>)",
          soft: "rgb(var(--brand-soft) / <alpha-value>)",
          ring: "rgb(var(--brand-ring) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          hover: "rgb(var(--surface-hover) / <alpha-value>)",
          border: "rgb(var(--surface-border) / <alpha-value>)",
        },
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": {
          "--radius-xl": "1.25rem",
          "--radius-lg": "1rem",
          "--radius-md": "0.75rem",
          "--radius-sm": "0.5rem",
          "--shadow-sm": "0 1px 2px rgba(0,0,0,0.08)",
          "--shadow": "0 6px 16px rgba(0,0,0,0.12)",
          "--shadow-lg": "0 14px 34px rgba(0,0,0,0.18)",
        },
      });
    }),
  ],
};

export default preset;
