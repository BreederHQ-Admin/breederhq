// apps/contacts/api/contacts.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = process.env.BHQ_API_BASE_URL!;      // e.g. https://breederhq-api.onrender.com/api/v1
const ADMIN    = process.env.BHQ_ADMIN_TOKEN!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(`${API_BASE}/contacts`);
  // forward query params (limit, cursor, fields…)
  for (const [k, v] of Object.entries(req.query)) url.searchParams.set(k, String(v));

  const upstream = await fetch(url.toString(), {
    method: req.method,
    headers: {
      'content-type': req.headers['content-type'] || 'application/json',
      'authorization': `Bearer ${ADMIN}`,
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? (req as any).body : undefined,
  });

  const text = await upstream.text();
  res.status(upstream.status).setHeader('content-type', upstream.headers.get('content-type') || 'application/json');
  res.send(text);
}
