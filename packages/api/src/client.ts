const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const USE_ADMIN = process.env.NEXT_PUBLIC_USE_ADMIN_TOKEN === "true";
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

function baseHeaders() {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (USE_ADMIN && ADMIN_TOKEN) h["x-admin-token"] = ADMIN_TOKEN;
  return h;
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...baseHeaders(), ...(init?.headers || {}) }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}
