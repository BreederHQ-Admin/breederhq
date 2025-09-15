export type BreedingPlanDTO = {
  id: string;
  female_id: string;
  male_id?: string | null;
  lockedCycle?: boolean;           // locks female selection only
  cycle_start_at?: string | null;  // optional
  ovulation_at?: string | null;    // expected window anchor
  actuals?: { bred_on?: string[]; whelped_on?: string | null; go_home_on?: string | null };
  status?: "planned"|"active"|"whelped"|"complete"|"canceled";
};
