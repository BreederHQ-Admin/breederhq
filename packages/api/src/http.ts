// packages/api/src/http.ts
export type MakeAuthHeader = () => Record<string, string> | null;

export function createHttp(baseURL: string, makeAuthHeader?: MakeAuthHeader) {
  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    init: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(init.headers);
    const extra = makeAuthHeader?.();
    if (extra) for (const [k, v] of Object.entries(extra)) headers.set(k, v);
    if (body !== undefined && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    const res = await fetch(`${baseURL}${path}`, {
      ...init,
      method,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return undefined as T;
    return (await res.json()) as T;
  }

  return {
    get:   <T = unknown>(path: string, init?: RequestInit) =>
      request<T>("GET", path, undefined, init),
    post:  <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("POST", path, body, init),
    put:   <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("PUT", path, body, init),
    patch: <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>("PATCH", path, body, init),
    delete:<T = unknown>(path: string, init?: RequestInit) =>
      request<T>("DELETE", path, undefined, init),
  };
}

export type Http = ReturnType<typeof createHttp>;
