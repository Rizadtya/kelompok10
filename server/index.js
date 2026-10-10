// ---------------------------------------------------------------------------
// Minimal, dependency-free AI server layer for the Automotive AI Visualizer.
// - Keeps all provider credentials server-side (reads process.env only here).
// - Exposes JSON endpoints the front-end calls through the Vite proxy (/api).
// - Falls back to the mock provider so it always runs without configuration.
//
// Run with: npm run server   (reads .env if present)
// ---------------------------------------------------------------------------

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getProviders, providerStatus } from './providers/index.js';
import { buildBrief } from './brief.js';
import { uid } from './util.js';

// --- tiny .env loader (no dependency) --------------------------------------
loadDotEnv();

const PORT = Number(process.env.PORT) || 8787;
const MAX_BODY = 25 * 1024 * 1024; // 25 MB to allow base64 images

const server = http.createServer(async (req, res) => {
  // CORS (handy if the client runs on a different origin without the proxy).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return end(res, 204, {});

  const url = (req.url || '').split('?')[0];

  try {
    if (req.method === 'GET' && url === '/api/status') {
      return end(res, 200, providerStatus());
    }
    if (req.method === 'GET' && (url === '/api/health' || url === '/health')) {
      return end(res, 200, { ok: true });
    }

    if (req.method === 'POST' && url.startsWith('/api/')) {
      const body = await readBody(req);
      const providers = getProviders();

      if (url === '/api/analyze') {
        const analysis = await providers.vision.analyzeVehicle(body);
        return end(res, 200, { analysis: normalizeAnalysis(analysis) });
      }
      if (url === '/api/recommend') {
        const recommendations = await providers.text.recommend(body);
        return end(res, 200, { recommendations });
      }
      if (url === '/api/explain') {
        const explanation = await providers.text.explain(body);
        return end(res, 200, { explanation });
      }
      if (url === '/api/generate') {
        const brief = buildBrief(body);
        const result = await providers.image.generateImage({
          brief,
          imageDataUrl: body.imageDataUrl || null,
        });
        const concept = {
          id: uid('concept'),
          imageUrl: result.imageUrl ?? null,
          prompt: result.prompt || brief,
          settings: {
            theme: body?.theme?.primary || '',
            use: body?.preferences?.intendedUse || '',
            provider: providers.image.name,
          },
          createdAt: new Date().toISOString(),
          isFallback: Boolean(result.isFallback),
          note: result.note,
        };
        return end(res, 200, { concept });
      }
    }

    return end(res, 404, { error: 'Not found' });
  } catch (err) {
    // Log server-side; return a safe message to the client.
    console.error('[server] error:', err);
    return end(res, 500, { error: err?.message || 'Internal server error' });
  }
});

server.listen(PORT, () => {
  const status = providerStatus();
  console.log(`\n  Automotive AI Visualizer — server`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(
    `  Providers: text=${status.text}, vision=${status.vision}, image=${status.image}` +
      (status.configured ? '' : '  (mock mode — add credentials in .env for real AI)\n'),
  );
});

// --- helpers ---------------------------------------------------------------

function end(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('Request body too large.'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', reject);
  });
}

/** Guard against malformed provider output so the UI never breaks. */
function normalizeAnalysis(a) {
  const arr = (v) => (Array.isArray(v) ? v : v ? [String(v)] : []);
  return {
    identification: a?.identification || 'Unidentified vehicle',
    confidence: typeof a?.confidence === 'number' ? Math.max(0, Math.min(1, a.confidence)) : 0.4,
    bodyStyle: a?.bodyStyle || '',
    characteristics: arr(a?.characteristics),
    existingMods: arr(a?.existingMods),
    recommendedDirections: arr(a?.recommendedDirections),
    compatibility: arr(a?.compatibility),
    constraints: arr(a?.constraints),
    needsUserInput: Boolean(a?.needsUserInput),
    notes: a?.notes || '',
  };
}

function loadDotEnv() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* non-fatal */
  }
}
