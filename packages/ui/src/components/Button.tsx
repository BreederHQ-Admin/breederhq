import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const map: Record<Variant, string> = {
    primary: "bg-brand text-brand-fg hover:bg-brand/90 focus-visible:ring-brand",
    secondary: "bg-surface text-fg hover:bg-surface-hover border border-surface-border",
    outline: "bg-transparent text-fg border border-surface-border hover:bg-surface",
    ghost: "bg-transparent text-fg-muted hover:bg-surface",
    danger: "bg-danger/90 text-fg-invert hover:bg-danger",
  };

  return <button className={clsx(base, map[variant], className)} {...props} />;
}
