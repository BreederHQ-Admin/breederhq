export type ApiClientOptions = { baseUrl: string; adminToken?: string };
export function createApiClient(opts: ApiClientOptions) {
  const base = opts.baseUrl.replace(/\/+$/, "");
  return {
    async get(path: string) {
      const res = await fetch(`${base}${path}`, { headers: opts.adminToken ? { Authorization: `Bearer ${opts.adminToken}` } : {} });
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    }
  };
}
