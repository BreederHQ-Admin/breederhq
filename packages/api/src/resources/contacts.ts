import type { Http } from "../http";

export type ContactRow = {
  id: string;
  name: string;
  primaryEmail?: string | null;
  phones?: { number: string }[];
  invoiceSummary?: { latestStatus?: string | null; anyOutstanding?: boolean } | null;
};

export function makeContacts(http: Http) {
  return {
    list(limit = 50) {
      return http.get<ContactRow[]>(`/api/v1/contacts?limit=${limit}`);
    },
    // add create/update later:
    // create(input: {...}) { return http.post<ContactRow>("/api/v1/contacts", input); }
  };
}
