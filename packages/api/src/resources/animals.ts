import type { Http } from "../http";

export type AnimalRow = {
  id: string;
  name: string;
  sex?: "M" | "F";
};

export function makeAnimals(http: Http) {
  return {
    list(limit = 50) {
      return http.get<AnimalRow[]>(`/api/v1/animals?limit=${limit}`);
    },
  };
}
