export type ApiClientOptions = { baseUrl: string; adminToken?: string };

export function createApiClient(opts: ApiClientOptions) {
  const base = opts.baseUrl.replace(/\/+$/, "");
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = { ...(init?.headers as Record<string, string> | undefined) };
    if (opts.adminToken) headers["x-admin-token"] = opts.adminToken;
    const res = await fetch(`${base}${path}`, { ...init, headers });
    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
    return res.json();
  }
  return {
    get<T>(path: string) { return request<T>(path); },
    post<T>(path: string, body: unknown) {
      return request<T>(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
  };
}
