import type { ReactNode } from "react";
export type Route = { path: string; label: string; element: ReactNode };

export const offspringRoutes = (page: { OffspringPage: ReactNode }): Route[] => [
  { path: "/offspring", label: "Offspring", element: page.OffspringPage },
];
