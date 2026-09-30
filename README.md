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

The production service worker caches the application shell and warms the current remote media assets after the first successful online load. A completely fresh device still needs network access for its first load.

## Media

The current landing-page photography is externally hosted and bandwidth-reduced. Before the fair, the final licensed image set should be downloaded, converted to WebP/AVIF and placed under `public/media/` so the event does not depend on third-party image CDNs.

## Staff checklist

1. Configure `VITE_EVENT_API_URL` and verify leads/results arrive centrally.
2. Confirm prize rules and reward names with the event team.
3. Test the production URL on the actual tablet and at least one mid-range phone.
4. Load the site once on the kiosk while online so the service worker warms its cache.
5. Replace external photography with self-hosted final media.
