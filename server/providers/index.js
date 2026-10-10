// ---------------------------------------------------------------------------
// Provider abstraction. Each capability (text, vision, image) can be backed by
// a different provider. Resolution falls back to the mock provider whenever a
// requested provider is unavailable or missing credentials, so the server is
// always functional.
// ---------------------------------------------------------------------------

import { mockProvider } from './mock.js';
import { openaiProvider } from './openai.js';

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY || process.env.AI_API_KEY);
}

function resolve(kind) {
  const choice = (process.env[kind] || 'mock').toLowerCase();
  if (choice === 'openai' || choice === 'custom') {
    if (hasOpenAIKey()) return openaiProvider;
    // Requested a real provider but no key — degrade gracefully to mock.
    return mockProvider;
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
