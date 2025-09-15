import React from "react";
import { AppShell, SidebarNav, PageHeader, Card, Button } from "@bhq/ui";
import { api } from "./api";
import type { UiBreedingPlan } from "@bhq/api";
import { breedingRoutes, type Route } from "./routes";

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

function PlansTable({ plans }: { plans: UiBreedingPlan[] }) {
  return (
    <table className="u-table-dense w-full">
      <thead>
        <tr className="text-left text-xs text-neutral-400">
          <th className="py-2 px-3">Plan</th><th className="py-2 px-3">Female</th>
          <th className="py-2 px-3">Locked</th><th className="py-2 px-3">Ovulation</th>
          <th className="py-2 px-3">Whelping (expected)</th><th className="py-2 px-3">Go Home (expected)</th>
          <th className="py-2 px-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {plans.map(p => (
          <tr key={p.id} className="border-t border-white/10">
            <td className="py-2 px-3">{p.id}</td>
            <td className="py-2 px-3">{p.female_id}</td>
            <td className="py-2 px-3">{p.lockedCycle ? "Yes" : "No"}</td>
            <td className="py-2 px-3">{p.ovulation_at ? new Date(p.ovulation_at).toLocaleDateString() : "—"}</td>
            <td className="py-2 px-3">{p.expected ? `${new Date(p.expected.whelping.start).toLocaleDateString()} – ${new Date(p.expected.whelping.end).toLocaleDateString()}` : "—"}</td>
            <td className="py-2 px-3">{p.expected ? `${new Date(p.expected.goHome.start).toLocaleDateString()} – ${new Date(p.expected.goHome.end).toLocaleDateString()}` : "—"}</td>
            <td className="py-2 px-3">{p.status ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CalendarView({ plans }: { plans: UiBreedingPlan[] }) {
  return (
    <div className="p-4">
      <div className="text-sm text-neutral-300 mb-3">Month view shows plans that overlap the visible range.</div>
      <ul className="space-y-2">
        {plans.map(p => (
          <li key={p.id} className="p-3 bhq-glass bhq-hairline">
            <div className="text-xs text-neutral-400">Plan {p.id}</div>
            {p.expected ? (
              <div className="text-sm">
                <div><b>Breeding:</b> {new Date(p.expected.breeding.start).toLocaleDateString()} – {new Date(p.expected.breeding.end).toLocaleDateString()}</div>
                <div><b>Whelping:</b> {new Date(p.expected.whelping.start).toLocaleDateString()} – {new Date(p.expected.whelping.end).toLocaleDateString()}</div>
                <div><b>Go Home:</b> {new Date(p.expected.goHome.start).toLocaleDateString()} – {new Date(p.expected.goHome.end).toLocaleDateString()}</div>
              </div>
            ) : <div className="text-neutral-400 text-sm">No expected windows yet</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlannerView({ plans }: { plans: UiBreedingPlan[] }) {
  return (
    <div className="p-4">
      <div className="text-sm text-neutral-300 mb-3">Phases advance only when actuals are entered; removing actuals moves phases backward.</div>
      <ul className="space-y-2">
        {plans.map(p => (
          <li key={p.id} className="p-3 bhq-glass bhq-hairline">
            <div className="text-xs text-neutral-400">Plan {p.id}</div>
            <div className="text-sm">
              <div><b>Bred on:</b> {p.actuals?.bred_on?.join(", ") || "—"}</div>
              <div><b>Whelped on:</b> {p.actuals?.whelped_on || "—"}</div>
              <div><b>Go home on:</b> {p.actuals?.go_home_on || "—"}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppBreeding() {
  const [plans, setPlans] = React.useState<UiBreedingPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const { path, navigate } = useHashPath("/breeding/plans");

React.useEffect(() => {
  setLoading(true);
  api.breeding
    .listPlans()
    .then(setPlans)
    .catch((e: unknown) => setError(e as Error))
    .finally(() => setLoading(false));
}, []);

  const pages = {
    Plans:    loading || error ? <Status loading={loading} error={error} /> : <PlansTable plans={plans} />,
    Calendar: loading || error ? <Status loading={loading} error={error} /> : <CalendarView plans={plans} />,
    Planner:  loading || error ? <Status loading={loading} error={error} /> : <PlannerView plans={plans} />,
  };

  const routes = breedingRoutes(pages);
  const current = routes.find(r => r.path === path) ?? routes[0];

  return (
    <AppShell
      sidebar={<SidebarNav items={[
        { label:"Plans", href:"#/breeding/plans", onClick:()=>navigate("/breeding/plans") },
        { label:"Calendar", href:"#/breeding/calendar", onClick:()=>navigate("/breeding/calendar") },
        { label:"Planner", href:"#/breeding/planner", onClick:()=>navigate("/breeding/planner") },
      ]} />}
      content={
        <div className="p-6 space-y-4">
          <PageHeader title="Breeding (Cycles)" subtitle="Plans, Calendar, Planner" />
          <Card className="bhq-glass bhq-shadow-stack p-0">
            {current.element}
          </Card>
        </div>
      }
    />
  );
}

function Status({ loading, error }: { loading: boolean; error: Error | null }) {
  if (loading) return <div className="p-6 text-sm text-neutral-400">Loading…</div>;
  if (error) return <div className="p-6 text-sm text-red-400">Error: {error.message}</div>;
  return null;
}
