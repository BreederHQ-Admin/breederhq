import type { Config } from "tailwindcss";

function withVar(name: string) {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue ? `rgb(var(${name}) / ${opacityValue})` : `rgb(var(${name}))`;
}

const preset: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // role tokens mapped to CSS variables defined in global.css
        bg: withVar("--bg"),
        surface: withVar("--surface"),
        "surface-hover": withVar("--surface-hover"),
        "surface-border": withVar("--surface-border"),
        foreground: withVar("--fg"),
        "fg-muted": withVar("--fg-muted"),
        "fg-subtle": withVar("--fg-subtle"),
        primary: withVar("--brand"),
        "primary-foreground": withVar("--brand-fg"),
        "brand-ring": withVar("--brand-ring"),
      },
      borderColor: {
        DEFAULT: withVar("--surface-border"),
        border: withVar("--surface-border"),
      },
    },
  },
  plugins: [],
};

export default preset;
