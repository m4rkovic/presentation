# ASCALab @ Arena Tehnologij

Interactive student event site built with React, Vite, Tailwind CSS and Framer Motion.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Event data backend

The site can send three event payload types to a single HTTP endpoint:

- `analytics`
- `quiz_result`
- `lead`

Set the endpoint at deploy time:

```bash
VITE_EVENT_API_URL=https://your-endpoint.example.com
```

The endpoint receives POST requests with this shape:

```json
{
  "kind": "lead",
  "payload": {},
  "sentAt": "2026-09-30T09:00:00.000Z"
}
```

If `VITE_EVENT_API_URL` is not configured, the UI does **not** claim that anything synced. Quiz results, analytics and student leads are kept only in that browser's local storage. Staff can open the landing page with `?staff=1` to export locally captured leads as CSV.

## Quiz integrity

Answer order and the AI-image left/right order are shuffled on every run. Prize status shown by the client is provisional and must be confirmed by ASCALab staff. Client-side scoring is not a security boundary; move validation server-side before using the quiz for high-value prizes.

## Routing

SPA fallbacks are included for both Vercel (`vercel.json`) and Netlify (`public/_redirects`) so direct refreshes on `/quiz` resolve correctly.

## Offline behavior

The production service worker precaches the application shell, official logo and event media under `/media/`. A completely fresh device still needs one successful production load so the service worker can install; after that, the cached shell and quiz images can be served without the third-party image hosts.

## Media

`npm run dev` and `npm run build` both run `npm run prepare:media` first. That script downloads the current licensed/reference media into `public/media/` and requests WebP from Unsplash where supported. Runtime pages then use only local `/media/...` paths.

If the event artwork changes, update `scripts/fetch-media.mjs`, delete the corresponding generated file locally and run `npm run prepare:media` again.

## Staff checklist

1. Configure `VITE_EVENT_API_URL` and verify leads/results arrive centrally.
2. Confirm prize rules and reward names with the event team.
3. Test the production URL on the actual tablet and at least one mid-range phone.
4. Load the site once on the kiosk while online so the service worker warms its cache.
5. Run the production build once before the fair and verify every self-hosted image under `/media/` is present.
