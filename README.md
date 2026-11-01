# Atmosphere — City Weather

A responsive, photography-led weather dashboard built with React, TypeScript and Vite. Search for cities worldwide, view live conditions and forecasts, and see a landmark photograph for supported cities.

## Features

- Live current conditions, apparent (feels-like) temperature, humidity, wind, UV, visibility, pressure and precipitation.
- 24-hour hourly outlook and 7-day forecast with rain probability and daily highs/lows.
- City autocomplete powered by Open-Meteo Geocoding.
- Automatic local time and date using the weather API's IANA timezone.
- Landmark image mapping for Hyderabad (Charminar), Bengaluru (Vidhana Soudha), Mumbai (Gateway of India), Delhi (India Gate), Chennai (Marina Beach), Kolkata (Victoria Memorial), Paris (Eiffel Tower), London (Big Ben), New York (Statue of Liberty) and Dubai (Burj Khalifa).
- Current-location weather (with browser permission), Celsius/Fahrenheit toggle, refresh, loading and error states.
- Responsive desktop and mobile layouts; respects reduced-motion preferences.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The production-ready site is generated in `dist/`.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Choose **GitHub Actions** as the build and deployment source.
4. Add a workflow at `.github/workflows/deploy.yml` (example below).

```yaml
name: Deploy Atmosphere to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

If deploying a repository project page (rather than a user/org root page), set Vite's `base` in `vite.config.ts` to `'/YOUR_REPOSITORY_NAME/'` before building. For a root domain, leave the default base as-is.

## APIs and attribution

- Weather and geocoding: [Open-Meteo](https://open-meteo.com/). No API key is required for this app's current public endpoint usage. Review Open-Meteo's current terms and attribution requirements before commercial use.
- Landmark images: Wikimedia Commons Special:FilePath links are used for the named landmark mappings. Please verify each selected file's availability, author attribution and license before a public/commercial launch; Wikimedia file licenses vary. If a mapped file is unavailable, the app falls back to a general city/skyline photograph rather than assigning another city's landmark.
- Fallback cityscape image: Unsplash. Review the provider's current license/terms for your intended use.

## Validation checklist

- [ ] `npm install` completes.
- [ ] `npm run build` completes without TypeScript errors.
- [ ] Search Hyderabad and verify Charminar mapping; search Bengaluru and verify Vidhana Soudha mapping.
- [ ] Search a city not in the landmark list and verify fallback image.
- [ ] Check actual and feels-like values against Open-Meteo for the selected coordinates.
- [ ] Switch °C/°F and verify current, hourly and daily values update.
- [ ] Test location permission allow/deny, invalid city, offline mode and narrow mobile viewport.
- [ ] Verify landmark image URLs and licenses before production publishing.

## Project structure

```text
src/
  components/       CitySearch.tsx, WeatherDashboard.tsx
  data/             landmarks.ts
  services/         weatherService.ts
  types/            weather.ts
  utils/            weather.ts
  main.tsx
  styles.css
```
