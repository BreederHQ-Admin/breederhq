import React from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const base =
  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white",
  ghost:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800",
};

export const Button: React.FC<Props> = ({ className, variant = "primary", ...props }) => {
  return <button className={clsx(base, variants[variant], className)} {...props} />;
};
