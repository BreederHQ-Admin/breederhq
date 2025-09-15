import type { ReactNode } from "react";

export type Route = { path: string; label: string; element: ReactNode };

// Add more pages later if needed.
export const contactRoutes = (page: { ContactsPage: ReactNode }): Route[] => [
  { path: "/contacts", label: "Contacts", element: page.ContactsPage },
];
