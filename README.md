# Fridge to Dinner — Web App

A Vue 3 SPA that turns your pantry into tonight's dinner — ranked by what you actually have, with a guided cook-along mode for when you're ready to start.

## What makes this different from a typical CRUD frontend

- **Substitution-aware suggestions** — consumes an API that models ingredient substitutions as a graph, so “missing buttermilk but have milk” doesn't tank a recipe's ranking the way a naive exact-match system would.
- **Installable, works offline** — built as a PWA; your last-fetched suggestions are still viewable with no connection, and the app installs to your home screen or dock like a native app.
- **Cook Mode** — a full-screen, distraction-free step-by-step view with a built-in per-step timer, distinct from the rest of the app's card-based layout on purpose.
- **A real design system, not a component library default** — custom design tokens built around a “pantry ledger” visual language; ingredients render as a glanceable shelf of filled or outlined jars rather than a progress bar.

## Stack

- Vue 3 (Composition API)
- Vue Router, Pinia
- Axios
- vite-plugin-pwa (offline support and installability)
- Cypress (end-to-end tests)
- No UI framework dependency — styling is hand-built on CSS custom properties, so the signature visual elements aren't fighting a component library's defaults

## Features

- Auth (register, login, and logout) against a token-based API
- Pantry management with debounced ingredient autocomplete
- Ranked, filterable recipe suggestions
- Full recipe detail with have and missing ingredient states
- Guided Cook Mode with per-step timers
- Installable PWA with offline suggestion caching

## Running locally

```bash
npm install
npm run dev
```

Requires the [API](link-to-your-api-repo) running locally, or point `VITE_API_BASE_URL` in a `.env` file at a deployed instance.

## Testing

```bash
npx cypress run
```

Covers the full user journey: register → login → build a pantry → view ranked suggestions → open a recipe → log out.

## Build and deploy

```bash
npm run build
```

Deployed automatically to GitHub Pages on push to `main` via GitHub Actions — see `.github/workflows/deploy.yml`.

## Design notes

The visual language is built around one idea: ingredients should read like items on a shelf, not entries in a progress bar. Recipe titles are set in italic Fraunces against a clean Inter interface, and numeric or data elements use JetBrains Mono so they read distinctly as data rather than prose.

## Related repo

The API this consumes lives at [link to your API repo](link-to-your-api-repo) — a Laravel backend with token auth and a graph-based ingredient substitution engine.
