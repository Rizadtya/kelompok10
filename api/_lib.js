// Shared helpers for the Vercel serverless functions.
// Vercel passes Node-style (req, res). We read the JSON body ourselves so the
// same handler code works regardless of body-parser availability.

import { verifyAccessToken, getBearerToken, hasAnonKey } from '../server/supabaseAdmin.js';

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

/**
 * Wrap a handler for POST requests with error handling + method guard.
 *
 * When `requireAuth` is true AND Supabase auth is configured on the server,
 * the request must include a valid `Authorization: Bearer <token>` from a
 * logged-in user. This protects the (paid) AI endpoints from anonymous abuse.
 *
 * When Supabase auth is NOT configured (e.g. local mock mode), auth is skipped
 * so the app still works out of the box.
 */
export function withPost(handler, { requireAuth = false } = {}) {
  return async (req, res) => {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

    try {
      if (requireAuth && hasAnonKey()) {
        const token = getBearerToken(req);
        const user = await verifyAccessToken(token);
        if (!user) {
          return sendJson(res, 401, {
            error: 'You must be signed in to use this feature.',
          });
        }
        // Make the authenticated user available to the handler if needed.
        const body = await readJson(req);
        const result = await handler(body, { user });
        return sendJson(res, 200, result);
      }

      const body = await readJson(req);
      const result = await handler(body);
      return sendJson(res, 200, result);
    } catch (err) {
      // Log server-side only; never leak secrets in the client-facing message.
      console.error('[api] error:', err?.message);
      return sendJson(res, 500, { error: err?.message || 'Internal server error' });
    }
  };
}
