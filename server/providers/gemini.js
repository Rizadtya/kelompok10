// ---------------------------------------------------------------------------
// Google Gemini provider (text + vision).
//
// SECURITY: The API key is read ONLY from process.env here on the server. It is
// never bundled into the front-end, never sent to the browser, and never logged.
// On Vercel the key lives in the project's Environment Variables, not in git.
//
// Uses the public Generative Language REST API:
//   POST {base}/models/{model}:generateContent?key=API_KEY
// Docs: https://ai.google.dev/api/generate-content
//
// Gemini has no first-party image *generation* in this REST surface here, so
// image requests return a clean fallback and the app renders its config-based
// concept honestly (never a fake render).
// ---------------------------------------------------------------------------

const DEFAULT_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function cfg() {
  return {
    baseUrl: process.env.GEMINI_BASE_URL || DEFAULT_BASE,
    apiKey: process.env.GEMINI_API_KEY || '',
    textModel: process.env.GEMINI_TEXT_MODEL || DEFAULT_MODEL,
    visionModel: process.env.GEMINI_VISION_MODEL || DEFAULT_MODEL,
  };
}

// Primary model, then fallbacks tried in order if one is overloaded (503) or
// unavailable (404). Keeps the app responsive when a specific model is busy.
const DEFAULT_MODEL = 'gemini-3.5-flash';
const MODEL_FALLBACKS = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-3.8-flash'];

function modelChain(preferred) {
  // Preferred first, then the rest (de-duplicated).
  return [preferred, ...MODEL_FALLBACKS].filter((m, i, a) => m && a.indexOf(m) === i);
}

const SYSTEM = `You are an expert automotive design consultant. Respond ONLY with a valid JSON object matching the requested schema — no markdown, no prose outside the JSON. Never invent exact market prices; use null for costEstimate unless you have reliable regional data. Never claim parts are compatible without evidence — frame compatibility as "verify" guidance. Clearly separate visual estimates from the specifications the user provided.`;

/**
 * Call Gemini generateContent and parse a JSON object from the response.
 * `parts` is an array of Gemini content parts (text and/or inline images).
 */
async function generateJSON(parts, { useVision } = {}) {
  const c = cfg();
  if (!c.apiKey) throw new Error('GEMINI_API_KEY is not configured on the server.');
  const preferred = useVision ? c.visionModel : c.textModel;

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  // Transient = retry same model; 404 = model gone, move to next in the chain.
  const TRANSIENT = new Set([429, 500, 503]);
  const RETRIES_PER_MODEL = 2;
  let res = null;
  let lastErrStatus = 0;
  let lastErrText = '';

  // Per-request timeout so a slow/overloaded model never hangs the response
  // (critical for Vercel's function duration limit and for UX).
  const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 20000;

  outer: for (const model of modelChain(preferred)) {
    for (let attempt = 1; attempt <= RETRIES_PER_MODEL; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
      try {
        res = await fetch(`${c.baseUrl}/models/${encodeURIComponent(model)}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Key sent via header (preferred over query string so it never lands in logs).
            'x-goog-api-key': c.apiKey,
          },
          body,
          signal: ctrl.signal,
        });
      } catch (err) {
        // Timed out or network error — treat like a transient failure.
        clearTimeout(timer);
        lastErrStatus = 408;
        lastErrText = err?.name === 'AbortError' ? 'request timed out' : String(err?.message || err);
        if (attempt < RETRIES_PER_MODEL) {
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
        break; // move to next model in the chain
      }
      clearTimeout(timer);
      if (res.ok) break outer;
      lastErrStatus = res.status;
      lastErrText = (await res.text()).slice(0, 200);
      if (res.status === 404) break; // model unavailable — try next model
      if (!TRANSIENT.has(res.status)) break outer; // non-retryable (e.g. 400/401/403)
      await new Promise((r) => setTimeout(r, 500 * attempt)); // backoff then retry
    }
  }

  if (!res || !res.ok) {
    throw new Error(`Gemini error (${lastErrStatus}): ${lastErrText}`);
  }

  const data = await res.json();
  const textOut =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('') ?? '{}';
  try {
    return JSON.parse(textOut);
  } catch {
    // Defensive: strip code fences if the model wrapped the JSON.
    const cleaned = textOut.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  }
}

/** Convert a data URL into a Gemini inline_data part. */
function inlineImagePart(dataUrl) {
  const [meta, b64] = dataUrl.split(',');
  const mimeType = /data:(.*?);base64/.exec(meta)?.[1] || 'image/png';
  return { inline_data: { mime_type: mimeType, data: b64 } };
}

export const geminiProvider = {
  name: 'gemini',

  async analyzeVehicle({ vehicle, hasImage, imageDataUrl, theme }) {
    const schema = `{"identification":string,"confidence":number(0-1),"bodyStyle":string,"characteristics":string[],"existingMods":string[],"recommendedDirections":string[],"compatibility":string[],"constraints":string[],"needsUserInput":boolean,"notes":string}`;
    const parts = [
      {
        text: `Analyze this vehicle. User-provided details: ${JSON.stringify(vehicle)}. Primary theme: ${theme?.primary || 'none'}. ${hasImage ? 'A photo is attached — treat anything from it as a visual estimate.' : 'No photo provided.'} Return a JSON object with this shape: ${schema}`,
      },
    ];
    const useVision = Boolean(hasImage && imageDataUrl);
    if (useVision) parts.push(inlineImagePart(imageDataUrl));
    return generateJSON(parts, { useVision });
  },

  async recommend({ vehicle, theme, exterior, wheels, preferences, analysis }) {
    const schema = `{"summary":string,"exterior":[{"category":string,"title":string,"rationale":string,"priority":"Essential"|"Recommended"|"Optional","costEstimate":string|null,"safetyNote":string?}],"wheelsSuspension":[same item shape as exterior],"colorPalette":[{"name":string,"hex":string,"role":string}],"stylingCombinations":string[],"pricingDisclaimer":string}`;
    return generateJSON([
      {
        text: `Create modification recommendations. Vehicle: ${JSON.stringify(vehicle)}. Theme: ${JSON.stringify(theme)}. Exterior: ${JSON.stringify(exterior)}. Wheels: ${JSON.stringify(wheels)}. Preferences: ${JSON.stringify(preferences)}. Analysis: ${JSON.stringify(analysis)}. Return a JSON object: ${schema}`,
      },
    ]);
  },

  async explain({ vehicle, theme, exterior, wheels, preferences, recommendations }) {
    const schema = `{"philosophy":string,"visualIdentity":string,"colorPalette":string,"bodyStyling":string,"wheelsSuspension":string,"balanceProportions":string,"visualImpact":string,"practicalConsiderations":string}`;
    return generateJSON([
      {
        text: `Write a structured automotive design explanation. Vehicle: ${JSON.stringify(vehicle)}. Theme: ${JSON.stringify(theme)}. Exterior: ${JSON.stringify(exterior)}. Wheels: ${JSON.stringify(wheels)}. Preferences: ${JSON.stringify(preferences)}. Recommendations summary: ${recommendations?.summary || ''}. Return a JSON object: ${schema}`,
      },
    ]);
  },

  async generateImage({ brief }) {
    // This REST surface is used for text/vision only. Return an honest fallback
    // so the UI shows a configuration-based concept rather than a fake render.
    return {
      imageUrl: null,
      isFallback: true,
      note: 'Gemini is configured for analysis and text generation. No image-generation provider is connected, so this is a configuration-based concept rather than an AI-rendered image.',
      prompt: brief,
    };
  },
};
