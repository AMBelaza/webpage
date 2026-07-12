# Andres M. Belaza — Personal Website

A lightweight, containerized personal portfolio site featuring multi-language support (English / Spanish), rendered with vanilla HTML, CSS, and JavaScript.

## Features

- **Static & Lightweight** — Pure HTML, CSS, and vanilla JS.
- **Multi-language Support** — JSON-based translations with English as the fallback language. Supports English and Spanish (Dutch flag rendered but no translation file yet).
- **Containerized** — Runs via Docker using a minimal `nginxinc/nginx-unprivileged:1.27-alpine` image.
- **Dark Theme** — Green-accented dark UI with smooth hover animations.

## Project Structure

```
.
├── index.html          # Main page
├── styles.css          # Styles (dark theme, green accents)
├── script.js           # Language switching & social link rendering
├── translations/
│   ├── en.json         # English translations (fallback)
│   └── es.json         # Spanish translations
├── assets/
│   └── profile.jpg     # Profile photo
├── Dockerfile          # Nginx container definition
├── docker-compose.yml  # Service configuration
└── .env                # Environment variables (e.g. HOST_PORT) #Only used during develop
```

### Custom Port

Override the host port by editing `.env`:

```env
HOST_PORT=8080
```
Note: only used on development, on production there is no bridge to host

## Adding a Language

1. Create a new JSON file in `translations/` (e.g., `translations/nl.json`).
2. Copy the structure from `translations/en.json` and translate the values.
3. Add the language code and flag to `script.js`:

```js
const VALID_LANGUAGES = ['en', 'es', 'nl'];

const FLAG_TO_LANG = {
  '🇪🇸': 'es',
  '🇺🇸': 'en',
  '🇳🇱': 'nl'
};

const userLanguages = ['🇪🇸', '🇺🇸', '🇳🇱'];
```

## File Details

| File            | Description                                              |
|-----------------|----------------------------------------------------------|
| `index.html`    | Single-page layout with profile, social links, languages |
| `styles.css`    | CSS variables, responsive layout, dark/green theme       |
| `script.js`     | Fetches translations, renders social links, language switching |
| `Dockerfile`    | Copies site files into nginx-unprivileged Alpine image   |
| `docker-compose.yml` | Orchestrates the container with resource limits      |
