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

If `VITE_EVENT_API_URL` is not configured, the UI does **not** claim that anything synced. Quiz results, analytics and student leads are kept only in that browser's local storage. Staff can open the landing page with `?staff=1` to export local leads, quiz results and analytics as separate CSV files. This fallback is useful for a single kiosk, but it is not central reporting for visitors using their own phones.

## Quiz integrity

Answer order and the AI-image left/right order are shuffled on every run. Prize status shown by the client is provisional and must be confirmed by ASCALab staff. Client-side scoring is not a security boundary. The client sends original selected-answer indices to the configured event backend, so a future backend can independently validate results. Until that validation exists, the UI treats prize status as provisional and staff confirmation is required.

## Routing

SPA fallbacks are included for both Vercel (`vercel.json`) and Netlify (`public/_redirects`) so direct refreshes on `/quiz` resolve correctly.

## Offline behavior

The production service worker warms the application shell, official logo and event media under `/media/` on a best-effort basis. A missing asset no longer aborts the whole service-worker installation. A completely fresh device still needs one successful production load before offline use can be relied on.

## Media

`npm run dev` and `npm run build` both run `npm run prepare:media` first. The script downloads missing reference media into `public/media/` and requests WebP from Unsplash where supported. Runtime pages use only local `/media/...` paths.

Remote download failures now warn instead of aborting the build. For the fair, the strongest setup is to generate the media once and commit the resulting `public/media/` files so production deployment no longer depends on third-party image hosts at build time. `public/media/` is intentionally no longer ignored by Git.

If the event artwork changes, update `scripts/fetch-media.mjs`, replace the corresponding local file and commit the final event media.

## Staff checklist

1. Configure `VITE_EVENT_API_URL` and verify leads, quiz results and analytics arrive centrally. Without this, staff-mode CSV export is the only central collection fallback.
2. Confirm prize rules and reward names with the event team.
3. Test the production URL at 1024×768 on the actual iPad Air 2 in landscape, plus 1366×768 desktop and one mid-range phone.
4. Confirm carousel arrows, keyboard focus and horizontal swipe all move between work slides.
5. Load the site once on the kiosk while online so the service worker warms its cache.
6. Generate and commit the final `public/media/` assets before the fair.
7. Submit a real lead from a second device and confirm it arrives centrally; if it does not, fix `VITE_EVENT_API_URL` before relying on the form.
