# Supabase setup

## Do I need to run SQL?

- **For login/signup/logout only:** No. Supabase Auth provides the built-in
  `auth.users` table. Just enable the **Email** provider under
  **Authentication → Providers**.
- **To store profiles and saved builds:** Yes — run `schema.sql`.

## How to run `schema.sql`

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Left sidebar → **SQL Editor** → **New query**.
3. Open `schema.sql` from this folder, copy everything, paste it in, click **Run**.
4. You should see "Success. No rows returned". It is safe to run again later.

## What it creates

| Object | Purpose |
|---|---|
| `public.profiles` | One row per user (auto-created on signup via trigger). |
| `public.saved_builds` | Stores a user's customization sessions as JSON. |
| RLS policies | Each user can only read/write **their own** rows. |

## Security notes

- **Row Level Security (RLS) is enabled** on both tables. This is why the
  public `anon` key is safe in the browser: even with the key, a user can only
  touch rows where `auth.uid()` matches their own id.
- The `service_role` key (server-only, in `.env` / Vercel env vars)
  bypasses RLS — never expose it to the browser.
