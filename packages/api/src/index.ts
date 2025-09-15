// packages/api/src/index.ts
// Public entry for @bhq/api (frontend SDK). Env-agnostic: apps inject baseURL + auth.

export { createHttp, type Http, type MakeAuthHeader } from "./http";

// Re-export resource factories + their types
export * from "./resources/contacts";
export * from "./resources/animals";
export * from "./resources/breeding";
export * from "./resources/offspring";

// (Optional) re-export shared types if you keep them under src/types/*
export * from "./types/contacts";
export * from "./types/animals";
export * from "./types/breeding";
export * from "./types/offspring";

// One convenience factory that binds everything to a configured Http
import { createHttp, type MakeAuthHeader } from "./http";
import { makeContacts } from "./resources/contacts";
import { makeAnimals } from "./resources/animals";
import { makeBreeding } from "./resources/breeding";
import { makeOffspring } from "./resources/offspring";

export function makeApi(baseURL: string, makeAuth?: MakeAuthHeader) {
  const http = createHttp(baseURL, makeAuth);
  return {
    http,                       // raw client if you need it
    contacts:  makeContacts(http),
    animals:   makeAnimals(http),
    breeding:  makeBreeding(http),
    offspring: makeOffspring(http),
  };
}
