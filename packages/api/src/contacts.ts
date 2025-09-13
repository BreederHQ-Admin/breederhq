export type Contact = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  primaryEmail: string | null;
  primaryPhone: string | null;
  organizationCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = { data: T[]; total: number; limit: number; offset: number };

export type ListContactsParams = {
  query?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
};

import { http } from "./client";

export const contacts = {
  list(params: ListContactsParams) {
    const qs = new URLSearchParams();
    if (params.query) qs.set("query", params.query);
    if (params.sort) qs.set("sort", params.sort);
    if (params.order) qs.set("order", params.order);
    qs.set("limit", String(params.limit ?? 25));
    qs.set("offset", String(params.offset ?? 0));
    return http<Paginated<Contact>>(`/api/contacts?${qs.toString()}`);
  },
  get(id: string) {
    return http<Contact>(`/api/contacts/${id}`);
  }
};
