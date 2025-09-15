import React from "react";
import clsx from "clsx";

export type NavItem = { label: string; count?: number; active?: boolean; onClick?: () => void };

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="space-y-1">
      {items.map((it, i) => (
        <button
          key={i}
          onClick={it.onClick}
          className={clsx(
            "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm",
            "hover:bg-surface-2 transition-colors",
            it.active ? "bg-surface-2 font-medium text-fg" : "text-fg-muted"
          )}
        >
          <span>{it.label}</span>
          {typeof it.count === "number" ? (
            <span className="rounded-lg bg-surface px-2 py-0.5 text-xs text-fg-muted">
              {it.count}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
}
