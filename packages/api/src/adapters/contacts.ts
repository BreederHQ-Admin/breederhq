import type { ContactDTO } from "../types/contacts";

export type UiContactRow = {
  id: string;
  name: string;
  primaryEmail?: string;
  email_status: "verified"|"unverified"|"none";
  phones: Array<{ number:string; phone_type:"mobile"|"home"|"work"|"other" }>;
  tags: string[];
  invoiceSummary?: { assignedCount:number; latestStatus?: string; anyOutstanding:boolean };
  created_at: string;
};

export function toUiContactRow(dto: ContactDTO): UiContactRow {
  const name = [dto.first_name, dto.last_name].filter(Boolean).join(" ").trim() || "Untitled";
  const preferred = dto.emails?.find(e => e.preferred) ?? dto.emails?.[0];
  const email_status = preferred ? (preferred.verified ? "verified" : "unverified") : "none";
  const phones = (dto.phones ?? []).map(p => ({ number:p.number, phone_type:p.label ?? "other" }));
  const inv = dto.invoices ?? [];
  const anyOutstanding = inv.some(i => i.status === "unpaid" || i.status === "partial");
  const latestStatus = inv[0]?.status;
  const invoiceSummary = inv.length ? { assignedCount: inv.length, latestStatus, anyOutstanding } : undefined;
  return { id:dto.id, name, primaryEmail:preferred?.address, email_status, phones, tags:dto.tags ?? [], invoiceSummary, created_at:dto.created_at };
}

/* Fixtures (3) */
export const contactFixtures: ContactDTO[] = [
  { id:"c1", first_name:"Rene", last_name:"P.", emails:[{address:"r@x.com",verified:true,preferred:true}], phones:[{number:"555-1111",label:"mobile"}], tags:["vip"], created_at:new Date().toISOString(), updated_at:new Date().toISOString(), invoices:[{id:"i1",status:"partial",assigned_at:new Date().toISOString(),contact_id:"c1"} as any] },
  { id:"c2", first_name:"Jason", last_name:"S.", emails:[], phones:[], tags:["lead:new"], created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
  { id:"c3", first_name:null, last_name:null, emails:[{address:"team@x.com",verified:false}], phones:[{number:"555-2222"}], tags:["lead:lost"], created_at:new Date().toISOString(), updated_at:new Date().toISOString() },
];
