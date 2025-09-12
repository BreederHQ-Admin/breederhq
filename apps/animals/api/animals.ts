// apps/animals/api/animals.ts
// Vercel Node Function (TS) without extra typings; mirrors contacts.ts pattern.

export default async function handler(req: any, res: any) {
  const env = ((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>;
  const API_BASE = env.BHQ_API_BASE_URL;   // e.g. https://breederhq-api.onrender.com/api/v1
  const ADMIN    = env.BHQ_ADMIN_TOKEN;    // Render ADMIN_TOKEN (same one your Contacts app uses)

  if (!API_BASE || !ADMIN) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "server_not_configured" }));
    return;
  }

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Forward to API /animals
  const url = new URL(`${API_BASE}/animals`);
  const query = req.query ?? {};
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, String(v));

  const headers: Record<string, string> = { authorization: `Bearer ${ADMIN}` };

  let body: any = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const ct = (req.headers?.["content-type"] as string) || "application/json";
    headers["content-type"] = ct;
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
  }

  const upstream = await fetch(url.toString(), { method: req.method, headers, body });
  const contentType = upstream.headers.get("content-type") || "application/json";
  const buf = Buffer.from(await upstream.arrayBuffer());

  res.statusCode = upstream.status;
  res.setHeader("content-type", contentType);
  res.end(buf);
}
