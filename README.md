# Easy Prayer v1.0.3

Easy Prayer is a progressive web application. It shows exact prayer times.

## Features

- Automatic geolocation setting
- City selection
- Calculation method selection
- Asr selection
- Multi language
- Week or month tables

## Release notes

See [CHANGELOG.md](CHANGELOG.md).

## Maintenance

`app_config.json` is the canonical application metadata source for the app name, version, color, canonical URL, and repository URL. When releasing, keep `app_config.json.version`, the visible app version, service worker cache revision, and manifest/icon cache-busting query values in sync.

PWA icons use separate normal `any` icons, padded `maskable` icons, and a dedicated `css/icons/apple-touch-icon.png` for iOS. This project is a simple PHP/static PWA; no Composer/package release pipeline is defined here, so publish/deploy steps must be documented separately when used.
