import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Browser Supabase client.
//
// Reads PUBLIC config injected by /public_config.js into window.__PUBLIC_CONFIG__.
// Only the public URL + anon key are used here — these are safe in the browser.
// Database security is enforced by Row Level Security (RLS) in Supabase, not by
// hiding the anon key.
// ---------------------------------------------------------------------------

interface PublicConfig {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

declare global {
  interface Window {
    __PUBLIC_CONFIG__?: PublicConfig;
  }
}

function readConfig(): PublicConfig {
  const cfg = (typeof window !== 'undefined' && window.__PUBLIC_CONFIG__) || {};
  return cfg;
}

const config = readConfig();

const url = config.SUPABASE_URL?.trim();
const anonKey = config.SUPABASE_ANON_KEY?.trim();

/** True when public_config.js has been filled in with real values. */
export const isSupabaseConfigured =
  Boolean(url) &&
  Boolean(anonKey) &&
  url !== 'PASTE_YOUR_SUPABASE_URL_HERE' &&
  anonKey !== 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';

/**
 * The shared Supabase client. Null until public_config.js is configured, so the
 * UI can show a helpful setup message instead of crashing.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Convenience accessor that throws a clear error if used before configuration. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Fill in SUPABASE_URL and SUPABASE_ANON_KEY in public/public_config.js.',
    );
  }
  return supabase;
}
