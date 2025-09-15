import { http } from "./http";
import type { AnimalDTO } from "./types/animals";
import { toUiAnimal, type UiAnimal } from "./adapters/animals";

export async function listAnimals(): Promise<UiAnimal[]> {
  const dtos = await http<AnimalDTO[]>(`/api/animals`);
  return dtos.map(d => toUiAnimal(d));
}
export async function getAnimal(id: string): Promise<UiAnimal> {
  const dto = await http<AnimalDTO>(`/api/animals/${id}`);
  return toUiAnimal(dto);
}
