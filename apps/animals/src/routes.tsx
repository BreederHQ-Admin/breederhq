import type { ReactNode } from "react";
export type Route = { path: string; label: string; element: ReactNode };

export const animalRoutes = (page: { AnimalsPage: ReactNode }): Route[] => [
  { path: "/animals", label: "Animals", element: page.AnimalsPage },
];
