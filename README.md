# FridgeRaid — Web App

[![CI](https://github.com/TomassSaulite/FridgeRaid/actions/workflows/ci.yml/badge.svg)](https://github.com/TomassSaulite/FridgeRaid/actions/workflows/ci.yml)

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
- Vuetify
- Hand-built Sass design tokens for the signature visual elements

## Features

- Auth (register, login, and logout) against a token-based API
- Pantry management with debounced ingredient autocomplete
- Ranked, filterable recipe suggestions
- Full recipe detail with have and missing ingredient states
- Guided Cook Mode with per-step timers
- Installable PWA with offline suggestion caching

## Try it locally

Run the API first, seed the recipe catalog, then start this frontend:

```bash
# in FridgeRaidAPI
php artisan migrate
php artisan db:seed --class=RecipeImportSeeder
php artisan serve

# in FridgeRaid
npm install
npm run dev
```

Create an account, add a few ingredients, and open **Suggestions** to see the substitution-aware ranking. Then open a recipe and switch to **Cook Mode**.

## Running locally

```bash
npm install
npm run dev
```

Requires the [API](https://github.com/TomassSaulite/FridgeRaidAPI) running locally, or point `VITE_API_URL` in a `.env` file at a deployed instance.

## Verification

```bash
npm run build
```

The build outputs static files to `dist/`, so it can be served from any static host. The same build runs automatically in GitHub Actions.

## Build and deploy

```bash
npm run build
```

Set `VITE_API_URL` to your deployed API before building.

## Design notes

The visual language is built around one idea: ingredients should read like items on a shelf, not entries in a progress bar. Recipe titles are set in italic Fraunces against a clean Inter interface, and numeric or data elements use JetBrains Mono so they read distinctly as data rather than prose.

## Related repo

The API this consumes lives at [FridgeRaidAPI](https://github.com/TomassSaulite/FridgeRaidAPI) — a Laravel backend with token auth and a graph-based ingredient substitution engine.
