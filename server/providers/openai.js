// ---------------------------------------------------------------------------
// OpenAI-compatible provider. Only used when AI_*_PROVIDER=openai and a key is
// present. Credentials are read from the environment and never leave the server.
// Works with the official OpenAI API or any OpenAI-compatible endpoint via
// AI_BASE_URL / AI_API_KEY.
// ---------------------------------------------------------------------------

const DEFAULT_BASE = 'https://api.openai.com/v1';

function cfg() {
  return {
    baseUrl: process.env.AI_BASE_URL || DEFAULT_BASE,
    apiKey: process.env.OPENAI_API_KEY || process.env.AI_API_KEY || '',
    textModel: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
    visionModel: process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini',
    imageModel: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
  };
}

async function chatJSON(messages) {
  const { baseUrl, apiKey, textModel } = cfg();
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: textModel,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Provider error (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '{}';
  return JSON.parse(content);
}

const SYSTEM = `You are an expert automotive design consultant. Respond ONLY with valid JSON matching the requested schema. Never invent exact market prices; use null for costEstimate unless you have reliable regional data. Never claim parts are compatible without evidence — frame compatibility as "verify" guidance. Clearly separate visual estimates from provided specifications.`;

export const openaiProvider = {
  name: 'openai',

  async analyzeVehicle({ vehicle, hasImage, imageDataUrl, theme }) {
    const schema = `{"identification":string,"confidence":number(0-1),"bodyStyle":string,"characteristics":string[],"existingMods":string[],"recommendedDirections":string[],"compatibility":string[],"constraints":string[],"needsUserInput":boolean,"notes":string}`;
    const content = [
      {
        type: 'text',
        text: `Analyze this vehicle. User-provided details: ${JSON.stringify(vehicle)}. Primary theme: ${theme?.primary || 'none'}. ${hasImage ? 'A photo is attached.' : 'No photo provided.'} Return JSON: ${schema}`,
      },
    ];
    if (hasImage && imageDataUrl) {
      content.push({ type: 'image_url', image_url: { url: imageDataUrl } });
    }
    return chatJSON([
      { role: 'system', content: SYSTEM },
      { role: 'user', content },
    ]);
  },

  async recommend({ vehicle, theme, exterior, wheels, preferences, analysis }) {
    const schema = `{"summary":string,"exterior":[{"category":string,"title":string,"rationale":string,"priority":"Essential"|"Recommended"|"Optional","costEstimate":string|null,"safetyNote":string?}],"wheelsSuspension":[same shape],"colorPalette":[{"name":string,"hex":string,"role":string}],"stylingCombinations":string[],"pricingDisclaimer":string}`;
    return chatJSON([
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: `Create modification recommendations. Vehicle: ${JSON.stringify(vehicle)}. Theme: ${JSON.stringify(theme)}. Exterior: ${JSON.stringify(exterior)}. Wheels: ${JSON.stringify(wheels)}. Preferences: ${JSON.stringify(preferences)}. Analysis: ${JSON.stringify(analysis)}. Return JSON: ${schema}`,
      },
    ]);
  },

  async explain({ vehicle, theme, exterior, wheels, preferences, recommendations }) {
    const schema = `{"philosophy":string,"visualIdentity":string,"colorPalette":string,"bodyStyling":string,"wheelsSuspension":string,"balanceProportions":string,"visualImpact":string,"practicalConsiderations":string}`;
    return chatJSON([
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: `Write a structured design explanation. Vehicle: ${JSON.stringify(vehicle)}. Theme: ${JSON.stringify(theme)}. Exterior: ${JSON.stringify(exterior)}. Wheels: ${JSON.stringify(wheels)}. Preferences: ${JSON.stringify(preferences)}. Recommendations summary: ${recommendations?.summary || ''}. Return JSON: ${schema}`,
      },
    ]);
  },

  async generateImage({ brief, imageDataUrl }) {
    const { baseUrl, apiKey, imageModel } = cfg();
    // Prefer image edits when a source photo is available so the vehicle's
    // identity and scene are preserved; fall back to generation otherwise.
    try {
      if (imageDataUrl) {
        // Convert data URL -> Blob for multipart edit request.
        const blob = dataUrlToBlob(imageDataUrl);
        const form = new FormData();
        form.append('model', imageModel);
        form.append('prompt', brief);
        form.append('image', blob, 'vehicle.png');
        form.append('size', '1024x1024');
        const res = await fetch(`${baseUrl}/images/edits`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: form,
        });
        if (res.ok) {
          const data = await res.json();
          const b64 = data.data?.[0]?.b64_json;
          if (b64) return { imageUrl: `data:image/png;base64,${b64}`, isFallback: false, prompt: brief };
        }
      }
      const res = await fetch(`${baseUrl}/images/generations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: imageModel, prompt: brief, size: '1024x1024', n: 1 }),
      });
      if (!res.ok) throw new Error(`Image provider error (${res.status})`);
      const data = await res.json();
      const b64 = data.data?.[0]?.b64_json;
      const url = data.data?.[0]?.url;
      if (b64) return { imageUrl: `data:image/png;base64,${b64}`, isFallback: false, prompt: brief };
      if (url) return { imageUrl: url, isFallback: false, prompt: brief };
      throw new Error('No image returned by provider.');
    } catch (err) {
      // Surface a clean fallback rather than failing the whole request.
      return {
        imageUrl: null,
        isFallback: true,
        note: `Image generation failed: ${err.message}. Showing a configuration-based concept instead.`,
        prompt: brief,
      };
    }
  },
};

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(',');
  const mime = /data:(.*?);base64/.exec(meta)?.[1] || 'image/png';
  const binary = Buffer.from(b64, 'base64');
  return new Blob([binary], { type: mime });
}
