// ---------------------------------------------------------------------------
// Shared request handlers used by BOTH:
//   - the local Node server (server/index.js), and
//   - the Vercel serverless functions (api/*.js).
//
// Each handler takes a parsed JSON body and returns a plain object. Keeping the
// logic here means there is one source of truth and the Gemini/OpenAI/mock
// integration behaves identically in local dev and on Vercel.
// ---------------------------------------------------------------------------

import { getProviders, providerStatus } from './providers/index.js';
import { buildBrief } from './brief.js';
import { uid } from './util.js';

export function statusHandler() {
  return providerStatus();
}

export async function analyzeHandler(body) {
  const providers = getProviders();
  const analysis = await providers.vision.analyzeVehicle(body || {});
  return { analysis: normalizeAnalysis(analysis) };
}

export async function recommendHandler(body) {
  const providers = getProviders();
  const recommendations = await providers.text.recommend(body || {});
  return { recommendations };
}

export async function explainHandler(body) {
  const providers = getProviders();
  const explanation = await providers.text.explain(body || {});
  return { explanation };
}

export async function generateHandler(body) {
  const providers = getProviders();
  const brief = buildBrief(body || {});
  const result = await providers.image.generateImage({
    brief,
    imageDataUrl: body?.imageDataUrl || null,
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
  return { concept };
}

/** Guard against malformed provider output so the UI never breaks. */
export function normalizeAnalysis(a) {
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
