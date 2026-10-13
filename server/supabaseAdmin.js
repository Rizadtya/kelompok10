// ---------------------------------------------------------------------------
// SERVER-ONLY Supabase helpers.
//
// SECURITY: This module reads SUPABASE_SERVICE_ROLE_KEY from process.env. That
// key bypasses Row Level Security, so it is EXTREMELY sensitive. It is read
// here only (server/ and api/ functions), never imported from src/, never sent
// to the browser, and never logged.
//
// Two things live here:
//   1. getAdminClient()  — a service-role client for privileged server tasks.
//   2. verifyAccessToken() — validates a user's access token (sent from the
//      browser as a Bearer token) using the public URL + anon key. This lets a
//      serverless function confirm the caller is a logged-in user before doing
//      work (e.g. calling the paid Gemini API).
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js';

function env(name) {
  return (process.env[name] || '').trim();
}

/** The Supabase project URL (same value as the public one, read server-side). */
export function getSupabaseUrl() {
  // Accept either a server var or the public one, whichever is set.
  return env('SUPABASE_URL') || env('VITE_SUPABASE_URL');
}

export function hasServiceRole() {
  return Boolean(getSupabaseUrl()) && Boolean(env('SUPABASE_SERVICE_ROLE_KEY'));
}

export function hasAnonKey() {
  return Boolean(getSupabaseUrl()) && Boolean(env('SUPABASE_ANON_KEY'));
}

let _admin = null;

/** Lazily-created service-role client. Throws if not configured. */
export function getAdminClient() {
  if (!hasServiceRole()) {
    throw new Error('Supabase service role is not configured on the server.');
  }
  if (!_admin) {
    _admin = createClient(getSupabaseUrl(), env('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

/**
 * Verify a user's access token (the JWT the browser gets after login).
 * Returns the user object on success, or null if the token is missing/invalid.
 * Uses the anon key — never the service role — for this check.
 */
export async function verifyAccessToken(accessToken) {
  if (!accessToken) return null;
  const url = getSupabaseUrl();
  const anon = env('SUPABASE_ANON_KEY');
  if (!url || !anon) return null;

  try {
    const client = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.auth.getUser(accessToken);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

/** Extract a Bearer token from an incoming request's Authorization header. */
export function getBearerToken(req) {
  const header =
    req?.headers?.authorization || req?.headers?.Authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(String(header));
  return match ? match[1].trim() : null;
}
