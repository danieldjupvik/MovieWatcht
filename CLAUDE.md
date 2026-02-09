This file provides guidance to AI coding agents when working with code in this repository.

## What This Is

MovieWatcht — a React Native (Expo) mobile app for discovering movies and TV series via the TMDb API. Supports watchlists with TMDb auth, light/dark themes, and English/Norwegian localization.

## Commands

```bash
npx expo start          # Dev server (or: npm start / bun start)
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
npx expo start --web    # Web browser
npx expo start --ios --clear # Clear Metro cache
CI=1 npx expo export --platform ios # Non-interactive iOS bundle validation
```

Package manager in repo: **bun** lockfile exists (`bun.lock`), but Expo CLI commands above are the source of truth for local runs.

No test runner, linter, or type checker is configured.

## Architecture

**Pure JavaScript, no TypeScript.** Expo SDK 55 preview managed workflow. React Native 0.83.

Current baseline commit after native tabs/search migration:

- `fe7e803` (`feat: migrate app to native iOS tabs and search`)

### Layout

- `App.js` — Entry point. Sets up native bottom tabs, stack navigators per tab, i18n, and theme wiring.
- `pages/` — Screen components. Each screen manages its own state via hooks and loads appearance preferences from AsyncStorage independently.
- `pages/Search.js` — Dedicated global search screen for movies + TV using TMDb multi-search and native header search bar.
- `components/` — Shared UI. `RenderMovieDetails.js` (~800 LOC) and `RenderSeriesDetails.js` (~900 LOC) are the largest files in the project.
- `settings/api.js` — All TMDb API endpoint URLs and the API key. Every endpoint is a pre-built URL string exported as a constant.
- `colors/colors.js` — Theme color constants (light/dark variants, button colors).
- `styles/` — `globalStyles.js` (borderRadius, boxShadow) and `buttons.js`.
- `language/` — i18n translation files: `en/translation.json` and `nb/translation.json`. Uses i18n-js.

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
- `RegionContext` provides region state via React Context (minimal usage).
- API calls use `axios` directly in components.
- TMDb OAuth flow for watchlist features (request token → approve in WebView → create session).

### Theming

Appearance (light/dark/auto) is stored in AsyncStorage under key `appearance`. Most screens load this independently on mount via `AsyncStorage.getItem('appearance')`. Colors come from `colors/colors.js`.

### Patterns to Know

- API URLs are constructed by appending the API key as a query param: `${apiKey}` where `apiKey = '?api_key=...'`.
- Pagination is handled with `&page=${pageNumber}` appended to URLs.
- Haptic feedback (`expo-haptics`) fires on tab presses.
- Search now uses TMDb multi-search endpoint (`searchMultiUrl`) and filters `media_type` to `movie`/`tv`.
- Native tab bar minimize behavior is configured in `App.js` via `tabBarMinimizeBehavior: 'onScrollDown'`.
- Known caveat: minimize-on-scroll may not trigger in `Home`/`Series` because the first descendant scroll view can be the internal pager from `react-native-tab-view`.
- Legacy `components/SearchResults.js` and `components/SeriesSearchResults.js` were removed during migration.
- Image URLs are built from TMDb CDN base paths (`w92`, `w185`, `w300`, `w342`, `w780` sizes) in `settings/api.js`.

### Platform Notes

- Current product focus is iOS. Android config exists but is not actively maintained in this migration.
- If UI behavior looks stale after nav changes, run with cache clear: `npx expo start --ios --clear`.

## Git Workflow

- `main` — production branch
- `develop` — active development branch
