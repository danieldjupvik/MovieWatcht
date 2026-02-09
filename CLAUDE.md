This file provides guidance to AI coding agents when working with code in this repository.

## What This Is

MovieWatcht — a React Native (Expo) mobile app for discovering movies and TV series via the TMDb API. Supports watchlists with TMDb auth, light/dark themes, and English/Norwegian localization.

## Commands

```bash
bun start           # Dev server
bun run ios         # iOS simulator
bun run android     # Android emulator
bun run web         # Web browser
```

Package manager: **bun** (not npm/yarn).

No test runner, linter, or type checker is configured.

## Architecture

**Pure JavaScript, no TypeScript.** Expo SDK 54 managed workflow. React Native 0.81.

### Layout

- `App.js` — Entry point. Sets up bottom tab navigation (Home, Series, WatchList, Settings), theme loading, and search bar.
- `pages/` — Screen components. Each screen manages its own state via hooks and loads appearance preferences from AsyncStorage independently.
- `components/` — Shared UI. `RenderMovieDetails.js` (~800 LOC) and `RenderSeriesDetails.js` (~900 LOC) are the largest files in the project.
- `settings/api.js` — All TMDb API endpoint URLs and the API key. Every endpoint is a pre-built URL string exported as a constant.
- `colors/colors.js` — Theme color constants (light/dark variants, button colors).
- `styles/` — `globalStyles.js` (borderRadius, boxShadow) and `buttons.js`.
- `language/` — i18n translation files: `en/translation.json` and `nb/translation.json`. Uses i18n-js.

### Navigation

@react-navigation v7 with native-stack + bottom-tabs. Four tabs: Home (movies), Series, WatchList, Settings. Each tab has its own native stack navigator for drill-down screens (Details, PersonDetails, etc.).

### State & Data

- Local state via `useState` hooks (no global store).
- `AsyncStorage` for persisted preferences (appearance, sessionId, region).
- `RegionContext` provides region state via React Context (minimal usage).
- API calls use `axios` directly in components.
- TMDb OAuth flow for watchlist features (request token → approve in WebView → create session).

### Theming

Appearance (light/dark/auto) is stored in AsyncStorage under key `appearance`. Most screens load this independently on mount via `AsyncStorage.getItem('appearance')`. Colors come from `colors/colors.js`.

### Patterns to Know

- API URLs are constructed by appending the API key as a query param: `${apiKey}` where `apiKey = '?api_key=...'`.
- Pagination is handled with `&page=${pageNumber}` appended to URLs.
- Haptic feedback (`expo-haptics`) fires on tab presses.
- Platform-specific tab bar: iOS uses `expo-blur` backdrop, Android uses solid background.
- Image URLs are built from TMDb CDN base paths (`w92`, `w185`, `w300`, `w342`, `w780` sizes) in `settings/api.js`.

## Git Workflow

- `main` — production branch
- `develop` — active development branch
