# MovieWatcht Upgrade

## Current state

- Expo SDK 48, React Native 0.71, React 18.2
- Dependencies aligned to SDK 48 via `bun add` (original package.json had older mismatched versions)
- Metro bundler works with `NODE_OPTIONS=--openssl-legacy-provider` (Node 18 OpenSSL 3.0 workaround)
- Web mode runs and API calls work — app is functional
- iOS simulator doesn't work because Expo Go for SDK 48 is no longer available for iOS 26
- Node 18 pinned via `.node-version` (fnm)
- Using bun instead of yarn (yarn.lock still exists from original project)

## Upgrade path

Incremental SDK upgrades: 48 → 49 → 50 → 51 → 52

Each step:
- Update expo and run `npx expo install --fix` to align dependencies
- Fix any breaking changes
- Verify it builds

## Things to address during upgrade

- Remove `@unimodules/core` (deprecated, replaced by expo-modules-core)
- Remove `react-native-appearance` (built into React Native now)
- `fiction-expo-restart` may need replacement
- `@react-native-community/masked-view` replaced by `@react-native-masked-view/masked-view`
- React Navigation v5 → v6+ (breaking API changes)
- OpenSSL workaround should become unnecessary with newer Metro
- Bump Node from 18 to 24+ (update `.node-version`) once Expo/Metro supports it
- Clean up: remove yarn.lock, commit bun.lockb

## After upgrade

- Verify iOS simulator runs
- Test all screens and API calls
- Update app.json (SDK version, build numbers)
- EAS Build setup for App Store submission
