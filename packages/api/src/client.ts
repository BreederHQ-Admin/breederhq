// packages/api/src/client.ts
type AnyEnv = Record<string, string | undefined> | undefined;

// Works in Vite (import.meta.env) and Node/Next (process.env)
const viteEnv: AnyEnv =
  typeof import.meta !== "undefined" && (import.meta as any).env
    ? (import.meta as any).env
    : undefined;

const nodeEnv: AnyEnv = typeof process !== "undefined" ? (process.env as AnyEnv) : undefined;

function readEnv(k: string): string | undefined {
  return viteEnv?.[k] ?? nodeEnv?.[k];
}

// Prefer VITE_ for Vite apps, then NEXT_PUBLIC_, then your BHQ_ custom names
const API_URL =
  readEnv("VITE_API_BASE_URL") ??
  readEnv("NEXT_PUBLIC_API_URL") ??
  readEnv("VITE_BHQ_API_BASE_URL") ??
  readEnv("BHQ_API_BASE_URL"); // legacy/custom fallback

const USE_ADMIN =
  (readEnv("VITE_USE_ADMIN_TOKEN") ??
    readEnv("NEXT_PUBLIC_USE_ADMIN_TOKEN") ??
    readEnv("BHQ_USE_ADMIN_TOKEN")) === "true";

const ADMIN_TOKEN =
  readEnv("VITE_ADMIN_TOKEN") ??
  readEnv("NEXT_PUBLIC_ADMIN_TOKEN") ??
  readEnv("BHQ_ADMIN_TOKEN");

// Optional final safety
if (!API_URL) {
  throw new Error(
    "[@bhq/api] Missing API base URL. Set VITE_API_BASE_URL (preferred) or NEXT_PUBLIC_API_URL."
  );
}

function baseHeaders() {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (USE_ADMIN && ADMIN_TOKEN) h["x-admin-token"] = ADMIN_TOKEN;
  return h;
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...baseHeaders(), ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}
