# Repit

Loop any part of a YouTube video for study and practice. No login, no backend, no database — everything runs in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. `vercel.json` is already configured for SPA routing.

## Sharing a loop

Once a video is loaded, the loop start/end and speed are saved as query params:

```
?v=VIDEO_ID&a=START_SECONDS&b=END_SECONDS&speed=1
```

Use the **Copy link** button in the header to copy the current state.
