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

## Connecting a real AI provider

The app runs fully in **mock mode** with no setup. To enable real AI:

1. Copy `.env.example` to `.env`.
2. Set the providers you want and add credentials. Example (OpenAI):

   ```env
   AI_TEXT_PROVIDER=openai
   AI_VISION_PROVIDER=openai
   AI_IMAGE_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   ```

3. Restart `npm run server`.

Any OpenAI-compatible endpoint works via `AI_BASE_URL` and `AI_API_KEY`.

**Credentials never reach the browser** — they are read only in `server/`.

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
