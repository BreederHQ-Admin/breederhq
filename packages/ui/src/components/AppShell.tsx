import React from "react";

type AppShellProps = {
  title?: string;
  headerSlot?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ title = "BreederHQ", headerSlot, sidebar, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-brand/20" aria-hidden />
            <span className="text-sm font-semibold tracking-tight">{title}</span>
          </div>
          <div className="flex items-center gap-2">{headerSlot}</div>
        </div>
      </header>

      <div className="container grid grid-cols-1 gap-6 py-6 md:grid-cols-12">
        {sidebar ? (
          <aside className="md:col-span-3 lg:col-span-2">
            <div className="card">{sidebar}</div>
          </aside>
        ) : null}
        <main className={sidebar ? "md:col-span-9 lg:col-span-10" : "md:col-span-12"}>{children}</main>
      </div>
    </div>
  );
}
