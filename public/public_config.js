/* ===========================================================================
 * public_config.js  —  PUBLIC runtime configuration (browser-safe)
 * ===========================================================================
 *
 * WHAT GOES HERE:
 *   Only values that are SAFE to expose in the browser:
 *     - SUPABASE_URL        (public project URL)
 *     - SUPABASE_ANON_KEY   (the "anon/public" key — designed to be public;
 *                            real security comes from Row Level Security)
 *
 * WHAT MUST **NEVER** GO HERE:
 *     - SUPABASE_SERVICE_ROLE_KEY   (secret — bypasses all security)
 *     - GEMINI_API_KEY              (secret)
 *   Put those in `.env.local` (local) and Vercel Environment Variables (prod).
 *
 * This file is loaded by index.html BEFORE the app, and the app reads the
 * values from `window.__PUBLIC_CONFIG__`.
 *
 * It is SAFE to commit this file. The anon key is meant to be visible to the
 * browser; your database stays protected by RLS policies in Supabase.
 * ========================================================================= */

window.__PUBLIC_CONFIG__ = {
  // Paste your Supabase Project URL here (looks like https://xxxx.supabase.co)
  SUPABASE_URL: 'https://boarnpqqoovyzifdstie.supabase.co',

  // Paste your Supabase anon / public key here (a long JWT-like string)
  SUPABASE_ANON_KEY: 'sb_publishable__1CdSNG8TwFij9iijH725g_4A9B8q_6',
};
