# Easy Prayer v1.3.4

Easy Prayer is a progressive web application. It shows exact prayer times.

## Features

- Automatic geolocation setting
- Local city autocomplete and saved cities
- Worldwide timezone support
- Optional prayer-time sound alerts and custom sound upload
- Calculation method selection
- Per-method manual prayer-time adjustments
- Asr selection
- Turkish, English, and German interfaces
- Week or month tables

## City data

City names, coordinates, administrative regions, population, and IANA timezones are imported into `db/world_cities.db` from the [GeoNames geographical database](https://www.geonames.org/). GeoNames data is licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). The application searches this embedded SQLite database and does not send city queries to an external location service.

## Release notes

See [CHANGELOG.md](CHANGELOG.md).

## Maintenance

`app_config.json` is the canonical application metadata source for the app name, application version, icon version, color, canonical URL, and repository URL. When releasing, keep `app_config.json.version`, the visible app version, and service worker cache revision in sync. Manifest icon URLs use the separate `iconVersion`, which must change only when the icon artwork actually changes; changing it prompts Android/Chrome users to review an app identity update.

The service worker tries to activate new versions automatically and cleans up old Easy Prayer app-shell/runtime caches. App content, the manifest request, and cached icon assets can be refreshed through the versioned URLs, but home-screen launcher icon replacement is controlled by Android/iOS and may not happen immediately for an existing install. Removing and reinstalling the PWA is a testing or last-resort step, not the normal update path.

PWA update banner text comes from `js/lang.js`. Because the update flow reloads automatically after `controllerchange`, the banner stays compact and does not show a manual Reload button.

PWA icons use separate normal `any` icons, padded `maskable` icons, and a dedicated `css/icons/apple-touch-icon.png` for iOS. This project is a simple PHP/static PWA; no Composer/package release pipeline is defined here, so publish/deploy steps must be documented separately when used.
