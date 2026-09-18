# Changelog

## v1.3.4 - 2026-09-18

- Added a navbar theme button with light, dark, and automatic day/night modes.
- Localized the theme labels and refreshed the browser theme color to match the selected mode.

## v1.3.3 - 2026-09-13

- Kept automatic geolocation independent from city selection: it now uses the device coordinates directly and displays “Current location”.
- Reserved city names and city-center coordinates exclusively for locations explicitly chosen through city search.

## v1.3.2 - 2026-09-13

- Showed the most relevant nearby city from the local database for automatic locations, with “Current location” retained only as a fallback.
- Added spacing between the page heading and prayer table.
- Emphasized the next displayed prayer time with a slightly heavier font and refreshed the emphasis as time advances.

## v1.3.1 - 2026-09-13

- Moved the selected city and map link beside the prayer-times heading.
- Removed the latitude, longitude, administrative area, and country rows from the main view to save vertical space.
- Truncated long city names responsively while preserving the full name as the link title.

## v1.3.0 - 2026-09-13

- Added optional minute adjustments for every displayed prayer time.
- Stored adjustments separately for each calculation method, restoring them when that method is selected again.
- Applied adjusted times consistently to both the prayer table and prayer-time sound alerts.

## v1.2.3 - 2026-09-13

- Placed each side-panel heading and close button in the same grid row for exact vertical alignment while preserving accessible heading semantics.

## v1.2.2 - 2026-09-13

- Aligned side-panel headings with their close buttons and removed the heading and prayer-sound separators.
- Normalized spacing between settings and added a high-contrast custom checked state for the prayer-sound checkbox.

## v1.2.1 - 2026-09-13

- Stacked labels above their controls in both side panels so longer translations remain readable without overlapping form fields.

## v1.2.0 - 2026-09-13

- Added complete German interface support, including location, settings, prayer names, calculation methods, sound messages, dates, and program information.

## v1.1.3 - 2026-09-13

- Cleared stale status messages when changing language so the next sound-test result uses the selected language.
- Replaced the generic map-link label with the selected city name while keeping the globe icon and map destination.

## v1.1.2 - 2026-09-13

- Shortened Turkish and English month names to three letters so the date column stays compact, especially on mobile screens.

## v1.1.1 - 2026-09-13

- Versioned every CSS and JavaScript asset URL so an older service worker cannot combine the new page with stale application code.
- Fixed the resulting startup failure that prevented city controls and the prayer sound test button from working after the v1.1.0 update.

## v1.1.0 - 2026-09-13

- Added local city autocomplete backed by an embedded GeoNames SQLite database with more than 34,000 cities.
- Added saved cities and quick switching between automatic and manually selected locations.
- Added a helpful location setup screen when browser geolocation is unavailable.
- Added per-city IANA timezone support so worldwide prayer times use the selected city's local time.
- Added optional, unobtrusive prayer-time sounds with two built-in tones and a custom sound upload stored on the device.
- Restored persistence for the existing color, background color, and font-size settings.

## v1.0.7 - 2026-07-13

- Decoupled manifest icon URLs from routine application releases so Android/Chrome no longer asks users to approve an unchanged icon on every update.
- Added a dedicated `iconVersion` that changes only when the icon artwork changes.

## v1.0.6 - 2026-07-10

- Made `app_config.json` the single source of the version. The PWA manifest is now served by `manifest.php` (which reads `app_config.json` and injects the version into icon URLs), and `easy_prayer.json` became a version-free template. Bumping the version in `app_config.json` now propagates to the page, service worker caches, and manifest icons with no other edits.

## v1.0.5 - 2026-06-20

- Localized the PWA update banner through `js/lang.js`.
- Removed the manual Reload button from the automatic reload flow.
- Preserved PWA cache revision and manifest/icon version sync.

## v1.0.4 - 2026-06-20

- Added manifest link cache-busting and versioned app script loading.
- Improved service worker auto-activation and Easy Prayer cache cleanup.
- Added startup service worker update checks with a one-time reload guard.
- Documented PWA update behavior and launcher icon cache limits.

## v1.0.3 - 2026-06-20

- Moved the canonical app metadata and version source back to `app_config.json`.
- Removed the separate plain-text version file.
- Kept PWA cache revision and manifest/icon cache-busting synced with the app version.

## v1.0.2 - 2026-06-20

- Fixed PWA splash icon color by keeping maskable icons on a white canvas with the original blue logo.
- Preserved the existing launcher safe-area padding and normal/maskable icon separation.

## v1.0.1 - 2026-06-20

- Fixed PWA launcher icon safe-area handling with separate padded maskable icons.
- Added a dedicated iOS apple touch icon and kept normal `any` icons separate.
- Added a canonical app version source.
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
