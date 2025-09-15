// packages/api/src/http.ts
const API_URL = import.meta.env.VITE_API_URL!;
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (ADMIN_TOKEN) headers.set("Authorization", `Bearer ${ADMIN_TOKEN}`);
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, credentials: "include" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
