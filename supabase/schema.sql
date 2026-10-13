-- ===========================================================================
-- Automotive AI Visualizer — Supabase schema
-- ===========================================================================
--
-- HOW TO RUN
--   1. Supabase Dashboard → your project → SQL Editor → New query.
--   2. Paste this whole file and click "Run".
--   3. It is idempotent (safe to run more than once).
--
-- WHAT THIS DOES
--   - Creates a `profiles` table (one row per user, auto-created on signup).
--   - Creates a `saved_builds` table to store a user's customization sessions.
--   - Enables Row Level Security (RLS) so each user can ONLY read/write their
--     OWN rows. This is what makes the public anon key safe in the browser.
--
-- NOTE
--   Basic login/signup/logout works WITHOUT this file (Supabase Auth provides
--   the built-in auth.users table). Run this only if you want profiles and
--   persisted builds.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) PROFILES  — public-facing user info linked to auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  display_name text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Each user may read their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Each user may insert their own profile row.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Each user may update their own profile.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 2) SAVED BUILDS — a user's customization sessions (matches the app's model)
-- ---------------------------------------------------------------------------
create table if not exists public.saved_builds (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default 'Untitled build',
  -- The whole CustomizationState object is stored as JSON for flexibility.
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists saved_builds_user_id_idx
  on public.saved_builds (user_id);

alter table public.saved_builds enable row level security;

-- A user can only see their own builds.
drop policy if exists "builds_select_own" on public.saved_builds;
create policy "builds_select_own"
  on public.saved_builds for select
  using (auth.uid() = user_id);

-- A user can only create builds owned by themselves.
drop policy if exists "builds_insert_own" on public.saved_builds;
create policy "builds_insert_own"
  on public.saved_builds for insert
  with check (auth.uid() = user_id);

-- A user can only update their own builds.
drop policy if exists "builds_update_own" on public.saved_builds;
create policy "builds_update_own"
  on public.saved_builds for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- A user can only delete their own builds.
drop policy if exists "builds_delete_own" on public.saved_builds;
create policy "builds_delete_own"
  on public.saved_builds for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3) AUTO-CREATE a profile row whenever a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4) Keep updated_at fresh on row updates
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists saved_builds_set_updated_at on public.saved_builds;
create trigger saved_builds_set_updated_at
  before update on public.saved_builds
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- Done. RLS is ON for both tables; users are isolated to their own rows.
-- ===========================================================================
