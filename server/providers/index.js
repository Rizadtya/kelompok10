// ---------------------------------------------------------------------------
// Provider abstraction. Each capability (text, vision, image) can be backed by
// a different provider. Resolution falls back to the mock provider whenever a
// requested provider is unavailable or missing credentials, so the server is
// always functional.
//
// SECURITY: All credentials are read from process.env here on the server only.
// They are never imported into the front-end bundle.
// ---------------------------------------------------------------------------

import { mockProvider } from './mock.js';
import { openaiProvider } from './openai.js';
import { geminiProvider } from './gemini.js';

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY || process.env.AI_API_KEY);
}

function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function resolve(kind) {
  const choice = (process.env[kind] || 'mock').toLowerCase();

  if (choice === 'gemini') {
    // Gemini supports text + vision. Fall back to mock if no key present.
    return hasGeminiKey() ? geminiProvider : mockProvider;
  }

  if (choice === 'openai' || choice === 'custom') {
    return hasOpenAIKey() ? openaiProvider : mockProvider;
  }

  return mockProvider;
}

export function getProviders() {
  return {
    text: resolve('AI_TEXT_PROVIDER'),
    vision: resolve('AI_VISION_PROVIDER'),
    image: resolve('AI_IMAGE_PROVIDER'),
  };
}

export function providerStatus() {
  const text = resolve('AI_TEXT_PROVIDER').name;
  const vision = resolve('AI_VISION_PROVIDER').name;
  const image = resolve('AI_IMAGE_PROVIDER').name;
  const configured = [text, vision, image].some((p) => p !== 'mock');
  return { text, vision, image, configured };
}
