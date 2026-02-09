This file provides guidance to AI coding agents when working with code in this repository.

## What This Is

MovieWatcht — a React Native (Expo) mobile app for discovering movies and TV series via the TMDb API. Supports watchlists with TMDb auth, light/dark themes, and English/Norwegian localization.

## Commands

```bash
npx expo start          # Dev server (or: bun start)
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
npx expo start --web    # Web browser
npx expo start --ios --clear # Clear Metro cache
CI=1 npx expo export --platform ios # Non-interactive iOS bundle validation
npx expo lint           # ESLint (or: bun run lint)
```

Package manager: **bun** (`bun.lock`). Expo CLI commands above are the source of truth for local runs.

## Architecture

**Pure JavaScript, no TypeScript.** Expo SDK 55 managed workflow. React Native 0.83. React Compiler enabled.

### Layout

- `App.js` — Entry point. Sets up native bottom tabs, stack navigators per tab, and theme wiring. i18n config moved to `language/i18n.js`.
- `pages/` — Screen components. Each screen manages its own state via hooks.
- `pages/Search.js` — Dedicated global search screen for movies + TV using TMDb multi-search and native header search bar.
- `components/` — Shared UI. `RenderMovieDetails.js` and `RenderSeriesDetails.js` are the largest files.
- `settings/api.js` — All TMDb API endpoint URLs and the API key. Every endpoint is a pre-built URL string exported as a constant.
- `colors/colors.js` — Theme color constants (light/dark variants, button colors).
- `styles/` — `globalStyles.js` (borderRadius, boxShadow) and `buttons.js`.
- `language/i18n.js` — i18n-js v4 instance config (locale detection, fallback). Imported by all screens.
- `language/en/` and `language/nb/` — Translation JSON files.

### Navigation

- Uses `@react-navigation/bottom-tabs/unstable` native bottom tabs (`createNativeBottomTabNavigator`).
- Five tabs: `Home`, `Series`, `Search`, `WatchList`, `Settings`.
- `Home` and `Series` tabs use SF Symbols (`movieclapper`, `tv`) via `tabBarIcon`.
- `Search`, `WatchList`, `Settings` use iOS system items via `tabBarSystemItem` (`search`, `bookmarks`, `more`).
- Each tab has its own native stack for drill-down screens (`Details`, `SeriesDetails`, `SeriesSeason`, `PersonDetails`, etc.).
- Dedicated `Search` tab owns native `headerSearchBarOptions` search UX.
- `Home` and `Series` still use `react-native-tab-view` internally for category switching.

### State & Data

- Local state via `useState` hooks (no global store).
- `AsyncStorage` for persisted preferences (appearance, sessionId, region).
- `AppearanceContext` provides theme state via React Context — screens use `useAppearance()` hook.
- `RegionContext` provides region state via React Context (minimal usage).
- API calls use `axios` directly in components.
- TMDb OAuth flow for watchlist features (request token → approve in WebView → create session).

### Theming

Appearance (light/dark/auto) managed by `AppearanceContext` (`components/AppearanceContext.js`). Screens access theme via `useAppearance()` hook. Colors come from `colors/colors.js`.

### Tooling

- **ESLint**: `eslint-config-expo` flat config (`eslint.config.js`). Run via `npx expo lint`.
- **React Compiler**: Enabled in `app.json` under `experiments.reactCompiler`. Auto-memoizes components and hooks.
- **No test runner or type checker** is configured.

### Patterns to Know

- API URLs are constructed by appending the API key as a query param: `${apiKey}` where `apiKey = '?api_key=...'`.
- Pagination is handled with `&page=${pageNumber}` appended to URLs.
- Haptic feedback (`expo-haptics`) fires on tab presses.
- Search uses TMDb multi-search endpoint (`searchMultiUrl`) and filters `media_type` to `movie`/`tv`.
- i18n uses `i18n-js` v4 — instance created in `language/i18n.js`, imported as `import i18n from '../language/i18n'`.
- Native tab bar minimize behavior configured in `App.js` via `tabBarMinimizeBehavior: 'onScrollDown'`.
- Known caveat: minimize-on-scroll may not trigger in `Home`/`Series` because the first descendant scroll view can be the internal pager from `react-native-tab-view`.
- Image URLs built from TMDb CDN base paths (`w92`, `w185`, `w300`, `w342`, `w780` sizes) in `settings/api.js`.
- Images use `expo-image` with blurhash placeholders.

### Platform Notes

- Current product focus is iOS. Android config exists but is not actively maintained.
- If UI behavior looks stale after nav changes, run with cache clear: `npx expo start --ios --clear`.

## Git Workflow

- `main` — production branch
- Feature branches off `main` for development
