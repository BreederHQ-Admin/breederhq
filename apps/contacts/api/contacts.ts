// apps/contacts/api/contacts.js
export default async function handler(req, res) {
  const API_BASE = process.env.BHQ_API_BASE_URL;   // e.g. https://breederhq-api.onrender.com/api/v1
  const ADMIN    = process.env.BHQ_ADMIN_TOKEN;    // your Render ADMIN_TOKEN

  if (!API_BASE || !ADMIN) {
    res.status(500).json({ error: "server_not_configured" });
    return;
  }

  // Build upstream URL (forward query params)
  const url = new URL(`${API_BASE}/contacts`);
  if (req.query) {
    for (const [k, v] of Object.entries(req.query)) {
      url.searchParams.set(k, String(v));
    }
  }

  // Prepare request to API
  const init = {
    method: req.method,
    headers: {
      authorization: `Bearer ${ADMIN}`,
    },
  };

  // Forward JSON body for non-GET/HEAD
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.headers["content-type"] = req.headers["content-type"] || "application/json";
    // Vercel parses req.body for JSON already; fall back to raw if needed
    init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
  }

  // Call upstream API
  const upstream = await fetch(url.toString(), init);
  const contentType = upstream.headers.get("content-type") || "application/json";
  const buf = Buffer.from(await upstream.arrayBuffer());

  res.status(upstream.status).setHeader("content-type", contentType).send(buf);
}
