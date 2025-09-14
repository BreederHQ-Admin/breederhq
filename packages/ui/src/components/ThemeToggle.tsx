import React from "react";

function setTheme(next: "light" | "dark") {
  const root = document.documentElement;
  if (next === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
  localStorage.setItem("bhq-theme", next);
}

function getInitialTheme(): "light" | "dark" {
  const saved = localStorage.getItem("bhq-theme");
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    setMode(getInitialTheme());
  }, []);

  React.useEffect(() => {
    setTheme(mode);
  }, [mode]);

  return (
    <button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      className="h-8 rounded-md border border-surface-border bg-surface px-2 text-sm text-fg-muted hover:bg-surface-hover"
      title="Toggle theme"
    >
      {mode === "dark" ? "Dark" : "Light"}
    </button>
  );
}
