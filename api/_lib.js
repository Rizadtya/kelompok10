// Shared helpers for the Vercel serverless functions.
// Vercel passes Node-style (req, res). We read the JSON body ourselves so the
// same handler code works regardless of body-parser availability.

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body; // already parsed
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

/** Wrap a handler with error handling + method guard. */
export function withPost(handler) {
  return async (req, res) => {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
    try {
      const body = await readJson(req);
      const result = await handler(body);
      return sendJson(res, 200, result);
    } catch (err) {
      // Log server-side only; return a safe message (never the API key).
      console.error('[api] error:', err?.message);
      return sendJson(res, 500, { error: err?.message || 'Internal server error' });
    }
  };
}
