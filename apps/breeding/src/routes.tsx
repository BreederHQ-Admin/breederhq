import type { ReactNode } from "react";
export type Route = { path: string; label: string; element: ReactNode };

// All three “pages” are provided by the App container (it fetches plans once).
export const breedingRoutes = (pages: {
  Plans: ReactNode; Calendar: ReactNode; Planner: ReactNode;
}) => ([
  { path: "/breeding/plans",    label: "Plans",    element: pages.Plans },
  { path: "/breeding/calendar", label: "Calendar", element: pages.Calendar },
  { path: "/breeding/planner",  label: "Planner",  element: pages.Planner },
]);
