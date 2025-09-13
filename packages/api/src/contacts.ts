export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

import { createApiClient } from "./client";

export function createContactsApi(baseUrl: string, adminToken?: string) {
  const api = createApiClient({ baseUrl, adminToken });
  return {
    list(): Promise<Contact[]> { return api.get<Contact[]>("/contacts"); },
    create(c: Omit<Contact, "id">): Promise<Contact> { return api.post<Contact>("/contacts", c); }
  };
}
