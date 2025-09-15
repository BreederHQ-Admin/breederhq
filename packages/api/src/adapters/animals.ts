import type { AnimalDTO } from "../types/animals";

export type UiOwner = { contact_id:string; name:string; is_primary_contact:boolean; is_resident:boolean };
export type UiAnimal = {
  id: string; name: string; sex: "female"|"male";
  breed?: string|null; birthdate?: string|null;
  owners: UiOwner[];
  last_cycle_at?: string|null;
  last_cycle_sourced_from: "plan"|"animal"|"none";
};

export function toUiAnimal(
  dto: AnimalDTO,
  opts?: { mostRecentPlanCycleStart?: string|null }
): UiAnimal {
  const owners = (dto.owners?.length ? dto.owners : [{ contact_id:"", name:"Unassigned", is_primary_contact:true, is_resident:true }])
    .map((o, i) => ({
      ...o,
      is_primary_contact: o.is_primary_contact ?? i === 0,
      is_resident: o.is_resident ?? i === 0
    }));
  const ensureSingleTrue = (key:"is_primary_contact"|"is_resident") => {
    const count = owners.filter(o => o[key]).length;
    if (count !== 1) {
      owners.forEach(o => (o[key] = false));
      owners[0][key] = true;
    }
  };
  ensureSingleTrue("is_primary_contact");
  ensureSingleTrue("is_resident");

  const last_cycle_at = opts?.mostRecentPlanCycleStart ?? dto.last_cycle_at ?? null;
  const last_cycle_sourced_from = opts?.mostRecentPlanCycleStart ? "plan" : (dto.last_cycle_at ? "animal" : "none");

  return { id:dto.id, name:dto.name, sex:dto.sex, breed:dto.breed ?? null, birthdate:dto.birthdate ?? null, owners, last_cycle_at, last_cycle_sourced_from };
}

/* Fixtures (3) */
export const animalFixtures: AnimalDTO[] = [
  { id:"a1", name:"Luna", sex:"female", owners:[{contact_id:"c1", name:"Rene", is_primary_contact:true, is_resident:true}], last_cycle_at:null },
  { id:"a2", name:"Milo", sex:"male", owners:[{contact_id:"c2", name:"Jason"}] },
  { id:"a3", name:"Nova", sex:"female", owners:[] },
];
