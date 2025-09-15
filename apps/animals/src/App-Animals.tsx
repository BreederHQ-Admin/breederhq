import React from "react";
import { AppShell, SidebarNav, PageHeader, Card } from "@bhq/ui";
import { listAnimals, type UiAnimal } from "@bhq/api";
import { animalRoutes, type Route } from "./routes";

function useHashPath(defaultPath: string) {
  const [path, setPath] = React.useState(() => location.hash.slice(1) || defaultPath);
  React.useEffect(() => {
    const onHash = () => setPath(location.hash.slice(1) || defaultPath);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [defaultPath]);
  const navigate = (to: string) => { location.hash = to; };
  return { path, navigate };
}

function AnimalsPage() {
  const [rows, setRows] = React.useState<UiAnimal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    listAnimals().then(setRows).catch(e => setError(e as Error)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Animals" subtitle="Animals under management" />
      <Card className="bhq-glass bhq-shadow-stack p-0">
        {loading ? <div className="p-6 text-sm text-neutral-400">Loading…</div>
        : error ? <div className="p-6 text-sm text-red-400">Error: {error.message}</div>
        : (
          <table className="u-table-dense w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-400">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Sex</th>
                <th className="py-2 px-3">Owners</th>
                <th className="py-2 px-3">Primary Contact</th>
                <th className="py-2 px-3">Resident</th>
                <th className="py-2 px-3">Last Cycle</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(a => {
                const primary = a.owners.find(o => o.is_primary_contact);
                const resident = a.owners.find(o => o.is_resident);
                return (
                  <tr key={a.id} className="border-t border-white/10">
                    <td className="py-2 px-3">{a.name}</td>
                    <td className="py-2 px-3">{a.sex}</td>
                    <td className="py-2 px-3">{a.owners?.length ? a.owners.map(o => o.name).join(", ") : "—"}</td>
                    <td className="py-2 px-3">{primary?.name ?? "—"}</td>
                    <td className="py-2 px-3">{resident?.name ?? "—"}</td>
                    <td className="py-2 px-3">{a.last_cycle_at ? new Date(a.last_cycle_at).toLocaleDateString() : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default function AppAnimals() {
  const pages = { AnimalsPage: <AnimalsPage /> };
  const routes = animalRoutes(pages);
  const { path, navigate } = useHashPath("/animals");
  const current = routes.find(r => r.path === path) ?? routes[0];

  return (
    <AppShell
      sidebar={<SidebarNav items={routes.map(r => ({ label: r.label, href: `#${r.path}`, onClick: () => navigate(r.path) }))} />}
      content={current.element}
    />
  );
}
