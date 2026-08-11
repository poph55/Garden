# palmerhudson.com

Personal portfolio and digital garden built with React and Vite and deployed on Netlify.

## Local development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run lint
npm run build
```

The production build includes an asset-size budget check.

## Site structure

- `/` — professional landing page
- `/projects` — project index
- `/projects/box-score` — MLB box score visualizer
- `/projects/subway-live` — live MTA subway visualization
- `/pulsarnav` — bundled Pulsar Navigator
- `/garden` — personal collections

Netlify Functions proxy the MLB and MTA feeds. Their routes and cache behavior are configured in `netlify.toml`.
