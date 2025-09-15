import React from "react";
import { AppShell, SidebarNav, PageHeader, Card } from "@bhq/ui";
import { api } from "./api";
import { contactRoutes } from "./routes";

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

type ContactRow = {
  id: string;
  name: string;
  primaryEmail?: string | null;
  phones?: { number: string }[];
  invoiceSummary?: { latestStatus?: string | null; anyOutstanding?: boolean } | null;
};

function ContactsPage() {
  const [rows, setRows] = React.useState<ContactRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    http.get<ContactRow[]>("/api/v1/contacts?limit=50")
      .then(setRows)
      api.contacts.list(50).then(setRows)
      .catch(e => setError(e as Error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Contacts" subtitle="People you work with" />
      <Card className="p-0">
        {loading ? (
          <div className="p-6 text-sm text-neutral-400">Loading…</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-400">Error: {error.message}</div>
        ) : (
          <table className="u-table-dense w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-400">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Phones</th>
                <th className="py-2 px-3">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="py-2 px-3">{r.name}</td>
                  <td className="py-2 px-3">{r.primaryEmail ?? "—"}</td>
                  <td className="py-2 px-3">{r.phones?.length ? r.phones.map(p => p.number).join(", ") : "—"}</td>
                  <td className="py-2 px-3">
                    {r.invoiceSummary
                      ? `${r.invoiceSummary.latestStatus ?? "—"}${r.invoiceSummary.anyOutstanding ? " • outstanding" : ""}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default function AppContacts() {
  const pages = { ContactsPage: <ContactsPage /> };
  const routes = contactRoutes(pages);
  const { path, navigate } = useHashPath("/contacts");
  const current = routes.find(r => r.path === path) ?? routes[0];

  return (
    <AppShell
      sidebar={
        <SidebarNav
          items={routes.map(r => ({
            label: r.label,
            href: `#${r.path}`,
            onClick: () => navigate(r.path),
          }))}
        />
      }
      content={current.element}
    />
  );
}
