// apps/contacts/api/contacts.ts
// Vercel Node Function (TypeScript) with zero external typings.
// Works without @vercel/node and without @types/node.

export default async function handler(req: any, res: any) {
  // Read env safely without needing Node types
  const env = ((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>;
  const API_BASE = env.BHQ_API_BASE_URL;   // e.g. https://breederhq-api.onrender.com/api/v1
  const ADMIN    = env.BHQ_ADMIN_TOKEN;    // the Render ADMIN_TOKEN

  if (!API_BASE || !ADMIN) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "server_not_configured" }));
    return;
  }

  // Preflight (just in case)
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Build upstream URL and forward query params
  const url = new URL(`${API_BASE}/contacts`);
  const query = req.query ?? {};
  for (const [k, v] of Object.entries(query)) {
    url.searchParams.set(k, String(v));
  }

  // Prepare upstream request
  const headers: Record<string, string> = {
    authorization: `Bearer ${ADMIN}`,
  };

  // Forward content-type for non-GET/HEAD
  let body: any = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const ct = (req.headers?.["content-type"] as string) || "application/json";
    headers["content-type"] = ct;
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
  }

  // Call the API
  const upstream = await fetch(url.toString(), {
    method: req.method,
    headers,
    body,
  });

  const contentType = upstream.headers.get("content-type") || "application/json";
  const text = await upstream.text();

  // Relay response
  res.statusCode = upstream.status;
  res.setHeader("content-type", contentType);
  res.end(text);
}
