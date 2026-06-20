# Changelog

## v1.0.2 - 2026-06-20

- Fixed PWA splash icon color by keeping maskable icons on a white canvas with the original blue logo.
- Preserved the existing launcher safe-area padding and normal/maskable icon separation.

## v1.0.1 - 2026-06-20

- Fixed PWA launcher icon safe-area handling with separate padded maskable icons.
- Added a dedicated iOS apple touch icon and kept normal `any` icons separate.
- Added `VERSION` as the canonical app version source.
- Synced service worker cache revision and manifest/icon cache-busting with the app version.

## v1.0.0 - 2026-06-14

- Added a single application config source for program metadata and versioning.
- Updated the service worker to use versioned app-shell and runtime caches.
- Improved offline handling for navigation and cached assets.
- Fixed stale service worker cache entries for missing font and settings files.
- Added a PWA update banner that lets users reload when a new version is ready.
- Modernized the PWA manifest with app id, scope, standalone display, maskable icons, and a shortcut.
- Improved accessibility by using button controls with ARIA labels for navigation and popup actions.
- Escaped dynamic PHP output and added safer external link attributes.
- Updated the footer and README to show the current application version.
