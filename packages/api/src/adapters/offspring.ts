import type { OffspringDTO, OffspringGroupDTO } from "../types/offspring";

export type UiOffspring = OffspringDTO & { balance_cents:number };
export type UiOffspringGroup = OffspringGroupDTO & {
  count:number;
  selection: Array<{ contact_id:string; assigned_at:string; status:string }>;
  selection_override?: Array<string>;
  invoice_rollup?: { assignedCount:number; latestStatus?:string; anyOutstanding:boolean };
};

export function toUiOffspring(dto: OffspringDTO): UiOffspring {
  const price = dto.price_cents ?? 0, paid = dto.paid_cents ?? 0;
  return { ...dto, balance_cents: Math.max(price - paid, 0) };
}

export function toUiOffspringGroup(dto: OffspringGroupDTO, children: OffspringDTO[]): UiOffspringGroup {
  const selection = (dto.invoices ?? [])
    .map(i => ({ contact_id:i.contact_id, assigned_at:i.assigned_at, status:i.status }))
    .sort((a,b) => a.assigned_at.localeCompare(b.assigned_at));
  const anyOutstanding = (dto.invoices ?? []).some(i => ["unpaid","partial"].includes(i.status));
  const invoice_rollup = (dto.invoices?.length)
    ? { assignedCount:dto.invoices.length, latestStatus:dto.invoices[0].status, anyOutstanding }
    : undefined;
  return { ...dto, count: children.length, selection, invoice_rollup };
}

/* Fixtures (3) */
export const groupFixtures: OffspringGroupDTO[] = [
  { id:"g1", plan_id:"p1", species:"dog", breed:"GSD", litter_name:"Alpha", whelped_at:"2025-12-01T00:00:00Z" },
  { id:"g2", plan_id:null, species:"cat", breed:"Ragdoll", litter_name:"Snow", whelped_at:null },
  { id:"g3", plan_id:"p2", species:"horse", breed:"Arabian", litter_name:"Star", whelped_at:"2026-01-15T00:00:00Z" },
];
