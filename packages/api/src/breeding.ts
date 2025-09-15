import { http } from "./http";
import type { BreedingPlanDTO } from "./types/breeding";
import { toUiBreedingPlan, type UiBreedingPlan } from "./adapters/breeding";

export async function listPlans(): Promise<UiBreedingPlan[]> {
  const dtos = await http<BreedingPlanDTO[]>(`/api/breeding/plans`);
  return dtos.map(toUiBreedingPlan);
}
export async function getPlan(id: string): Promise<UiBreedingPlan> {
  const dto = await http<BreedingPlanDTO>(`/api/breeding/plans/${id}`);
  return toUiBreedingPlan(dto);
}
