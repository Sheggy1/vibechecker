# VibeCheck

**AI-powered sentiment micro-app for social media managers.**

Paste any customer comment and get an instant Vibe Rating — sentiment category, confidence score, energy level, and a punchy one-line summary — so you can read the room before you reply.

---

## What it does

| Feature | Detail |
|---|---|
| Sentiment detection | POSITIVE / NEGATIVE / NEUTRAL / MIXED |
| Confidence score | 0–100%, color-coded bar |
| Energy level | HIGH / MEDIUM / LOW |
| Vibe summary | One-line AI-generated insight |
| Session history | Last 5 checks, persisted in React state |
| Test suite | 9 integration tests, mocked API, zero real calls |

---

## Project structure

```
vibecheck/
├── index.html                  # Vite entry point
├── package.json
├── vite.config.js              # Vite + Vitest config
├── README.md
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root component — owns tab + history state
    ├── api/
    │   └── analyzeVibe.js      # Anthropic API call — the "backend" layer
    ├── constants/
    │   └── vibes.js            # Sentiment → color/emoji/label mapping
    ├── components/
    │   ├── Header.jsx          # Top bar with name and version badge
    │   ├── TabNav.jsx          # Analyze / History / Tests tab bar
    │   ├── AnalyzeTab.jsx      # Main input + result card
    │   ├── HistoryTab.jsx      # Last 5 checks display
    │   ├── VibeCard.jsx        # Compact history card component
    │   ├── ConfidenceBar.jsx   # Animated confidence progress bar
    │   └── TestsTab.jsx        # In-app test runner with mocked responses
    └── tests/
        └── vibecheck.test.js   # Vitest integration tests (CLI)
```

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:5173

# 3. Run tests
npm run test
```

---

## Configuration

The app calls the Anthropic Claude API directly from the browser. This is fine for prototyping, but **in production you must proxy through a backend** to avoid exposing your API key.

**For the prototype** — the API key is handled by the Claude.ai artifact environment automatically. No `.env` setup needed when running as an artifact.

**For standalone deployment** — create a `.env` file:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Then update `src/api/analyzeVibe.js`:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
},
```

**Recommended for production** — move the API call to an Express or FastAPI route:

```js
// Express example
app.post("/api/vibe", async (req, res) => {
  const { text } = req.body;
  // call Anthropic here with server-side key
  res.json(result);
});
```

Then point `analyzeVibe.js` at `/api/vibe` instead of the Anthropic URL directly.

---

## API contract

`analyzeVibe(text: string)` calls Claude with a strict JSON-only system prompt and returns:

```json
{
  "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED",
  "confidence": 94,
  "energy_level": "HIGH" | "MEDIUM" | "LOW",
  "vibe_summary": "Enthusiastic praise, high engagement likely"
}
```

Throws on: non-2xx HTTP status, network failure, or unparseable JSON response.

---

## Testing

The test suite lives in two places:

**`src/tests/vibecheck.test.js`** — Vitest CLI tests (9 cases, mocked fetch):

```bash
npm run test
```

Coverage includes:
- POSITIVE / NEGATIVE / NEUTRAL / MIXED happy paths
- Confidence always in range 0–100
- API 500 error handling
- API 429 rate limit handling
- Malformed JSON response handling
- Network failure (fetch rejection)

**`src/components/TestsTab.jsx`** — In-browser test runner (6 cases, no CLI needed). Hit "▶ run tests" in the Tests tab.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite 5 |
| Styling | Inline styles + CSS variables |
| AI engine | Anthropic Claude (claude-sonnet-4) |
| Testing | Vitest + jsdom |
| Fonts | Syne (display) · IBM Plex Mono (data) |

---

## Extending the app

**Add real backend** — extract `analyzeVibe.js` into `server/routes/vibe.js`, call Anthropic server-side, return the same JSON shape.

**Add persistent storage** — swap React state in `App.jsx` for `localStorage` reads/writes, or hook up a database via the backend route.

**Add more vibes** — extend `VIBES` in `src/constants/vibes.js` with new sentiment categories and update the system prompt in `analyzeVibe.js` to include them.

**Deploy** — `npm run build` outputs a static `dist/` folder. Deploy to Vercel, Netlify, or any static host. Pair with a serverless function for the API proxy.

---

Built as a VibeCheck prototype · Powered by Claude · MIT License
