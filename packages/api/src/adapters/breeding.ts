import type { BreedingPlanDTO } from "../types/breeding";
import type { ExpectedWindows } from "../utils/breeding";
import { computeExpectedFromOvulation } from "../utils/breeding";

export type UiBreedingPlan = BreedingPlanDTO & { expected?: ExpectedWindows };

export function toUiBreedingPlan(dto: BreedingPlanDTO): UiBreedingPlan {
  const expected = dto.ovulation_at ? computeExpectedFromOvulation(dto.ovulation_at) : undefined;
  return { ...dto, expected };
}

/* Fixtures (3) */
export const planFixtures: BreedingPlanDTO[] = [
  { id:"p1", female_id:"a1", lockedCycle:false, ovulation_at:new Date().toISOString(), status:"planned" },
  { id:"p2", female_id:"a1", male_id:"a2", cycle_start_at:"2025-09-01T00:00:00Z", status:"active", actuals:{ bred_on:["2025-09-02"] } },
  { id:"p3", female_id:"a1", status:"canceled" },
];
