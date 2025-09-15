import { http } from "./http";
import type { ContactDTO } from "./types/contacts";
import { toUiContactRow, type UiContactRow } from "./adapters/contacts";

export async function listContacts(q?: { search?:string; limit?:number; page?:number }): Promise<UiContactRow[]> {
  const qs = new URLSearchParams();
  if (q?.search) qs.set("search", q.search);
  if (q?.limit) qs.set("limit", String(q.limit));
  if (q?.page) qs.set("page", String(q.page));
  const dtos = await http<ContactDTO[]>(`/api/contacts${qs.toString()?`?${qs}`:""}`);
  return dtos.map(toUiContactRow);
}
export async function getContact(id: string): Promise<UiContactRow> {
  const dto = await http<ContactDTO>(`/api/contacts/${id}`);
  return toUiContactRow(dto);
}
