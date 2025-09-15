type Envelope<T> = { ok: true; data: T } | { ok: false; error: { code:string; message:string; fields?:Record<string,unknown> } };

const API_URL = import.meta?.env?.VITE_API_URL ?? process?.env?.VITE_API_URL;
const tokenFromEnv = () => (typeof window === "undefined" ? process?.env?.VITE_ADMIN_TOKEN : null);
const tokenFromStorage = () => (typeof window !== "undefined" ? localStorage.getItem("bhq_token") : null);

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const auth = tokenFromStorage() ?? tokenFromEnv() ?? undefined;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type":"application/json", ...(auth?{Authorization:`Bearer ${auth}`}:{}) , ...(init?.headers||{}) }
  });
  const json = await res.json() as Envelope<T>;
  if (!json.ok) throw Object.assign(new Error(json.error.message), { code: json.error.code, fields: json.error.fields });
  return json.data;
}
