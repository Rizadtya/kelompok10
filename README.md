# Automotive AI Visualizer

An AI-powered web app to explore, customize, analyze, and visualize automotive
modifications. Upload a vehicle photo, choose a styling direction, and get
AI-driven analysis, recommendations, a visual concept, and a design rationale.

Inspired functionally by a reference PartyRock app, rebuilt as a polished,
production-style platform.

## Stack

- **React + TypeScript + Vite** — front-end app
- **Tailwind CSS** — dark charcoal / neon-lime design system
- **lucide-react** — icons
- **Node (built-in `http`)** — dependency-free server layer for AI calls
- **Provider abstraction** — swap in OpenAI-compatible providers for text,
  vision, and image generation

## Project structure

```
.
├─ index.html
├─ server/                 # Server-side AI layer (credentials live here)
│  ├─ index.js             # HTTP server + routes (/api/*)
│  ├─ brief.js             # Builds the image/design brief from config
│  └─ providers/
│     ├─ index.js          # Resolves providers, falls back to mock
│     ├─ mock.js           # Credential-free deterministic provider
│     └─ openai.js         # OpenAI-compatible provider (text/vision/image)
└─ src/
   ├─ App.tsx              # Layout: sidebar + workspace + preview
   ├─ types.ts             # Customization data model
   ├─ constants.ts         # Themes, options, presets, step metadata
   ├─ state/               # React Context store (+ persistence)
   ├─ lib/                 # API client, hooks, utils
   └─ components/
      ├─ layout/           # Sidebar, TopBar, ProgressBar
      ├─ preview/          # Live preview panel + placeholder
      ├─ steps/            # The 10 workflow widgets
      ├─ upload/           # Vehicle image uploader
      ├─ generate/         # Visual generation + before/after slider
      └─ ui/               # Reusable primitives (fields, states, etc.)
```

## Getting started

```bash
npm install

# Terminal 1 — AI server (runs in mock mode without credentials)
npm run server

# Terminal 2 — front-end dev server
npm run dev
```

Open the URL Vite prints (default http://localhost:5173). The Vite dev server
proxies `/api/*` to the server on port 8787.

> Note: start the server and dev server in separate terminals. On Windows
> PowerShell, run each command in its own window.

## Connecting a real AI provider (Google Gemini)

The app runs fully in **mock mode** with no setup. To enable real AI with
Gemini (text + vision):

### 1. Get a Gemini API key

1. Open **https://aistudio.google.com/apikey** and sign in with a Google account.
2. Click **Create API key** (there is a free tier).
3. Copy the key — treat it like a password.

### 2. Local development

1. Copy `.env.example` to `.env`.
2. Set:

   ```env
   AI_TEXT_PROVIDER=gemini
   AI_VISION_PROVIDER=gemini
   AI_IMAGE_PROVIDER=mock
   GEMINI_API_KEY=your_key_here
   ```

3. Restart `npm run server`. The top bar should switch from "Mock mode" to
   "AI connected".

> Gemini has no image *generation* on this REST surface, so keep
> `AI_IMAGE_PROVIDER=mock`. Analysis, recommendations, and explanation all use
> Gemini; the visual concept uses the honest configuration-based fallback.

### 3. Deploy to Vercel (key stays secret)

The repo includes `vercel.json` and serverless functions in `api/` that reuse
the exact same handler code as the local server.

1. Push this repo to GitHub (already done).
2. On **vercel.com** → **Add New → Project** → import your GitHub repo.
3. Vercel auto-detects Vite. Leave the defaults (build `npm run build`,
   output `dist`).
4. Before deploying, open **Settings → Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `AI_TEXT_PROVIDER` | `gemini` |
   | `AI_VISION_PROVIDER` | `gemini` |
   | `AI_IMAGE_PROVIDER` | `mock` |
   | `GEMINI_API_KEY` | *your key* |

5. Click **Deploy**. Your app is live; `/api/*` runs as serverless functions.

To update later: `git push` → Vercel redeploys automatically.

### Security model (how the key stays safe)

- The key is read **only** on the server — in `server/providers/gemini.js` and
  the `api/` functions — via `process.env`. It is **never** imported into any
  file under `src/`, so it never enters the browser bundle.
- `.env` is listed in `.gitignore` (along with `.env.*`), so your real key is
  **never committed**, even if the GitHub repo is public. Only `.env.example`
  (with blank values) is committed.
- On Vercel the key lives in encrypted **Environment Variables**, not in git.
- The key is sent to Google via an HTTPS request header and is not written to
  logs or returned in error messages.
- The browser only ever talks to your own `/api/*` endpoints — it never calls
  Google directly and never sees the key.

> If a key is ever exposed, revoke it in Google AI Studio and generate a new one.

### A note on PartyRock

Access to the reference PartyRock app does **not** grant API access to its
underlying models. Integrate only through supported provider APIs with your own
credentials.

## How the AI is used

- **Analysis** (`/api/analyze`): vision model reviews the photo + details and
  separates visual estimates from provided specs.
- **Recommendations** (`/api/recommend`): text model proposes prioritized mods
  with honest pricing caveats (no fabricated prices).
- **Explanation** (`/api/explain`): text model writes a structured rationale.
- **Generation** (`/api/generate`): image model edits/generates a concept,
  preserving the vehicle's identity and scene where supported.

If image generation isn't configured, the app shows an explicit setup message
and a functional configuration-based fallback concept — it never pretends a
static placeholder is an AI render.

## Build

```bash
npm run build      # type-check + production build
npm run preview    # preview the build
```

## Disclaimers

AI output is a set of **visual concepts and suggestions**, not verified
specifications. Always confirm fitment, compatibility, and local road-legality
with a qualified professional before purchasing or installing parts.
