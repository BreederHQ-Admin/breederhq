import { http } from "./http";
import type { OffspringDTO, OffspringGroupDTO } from "./types/offspring";
import { toUiOffspring, toUiOffspringGroup, type UiOffspring, type UiOffspringGroup } from "./adapters/offspring";

export async function listOffspringGroups(): Promise<UiOffspringGroup[]> {
  const groups = await http<OffspringGroupDTO[]>(`/api/offspring/groups`);
  // fetch children per group, or add an API that returns groups with children
  const results: UiOffspringGroup[] = [];
  for (const g of groups) {
    const kids = await http<OffspringDTO[]>(`/api/offspring/groups/${g.id}/items`);
    results.push(toUiOffspringGroup(g, kids));
  }
  return results;
}
export async function listOffspringByGroup(groupId: string): Promise<UiOffspring[]> {
  const dtos = await http<OffspringDTO[]>(`/api/offspring/groups/${groupId}/items`);
  return dtos.map(toUiOffspring);
}
