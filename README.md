# Repit

Loop any part of a YouTube video for study and practice.

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

## Login, watch history and favorites (optional)

Login with Google, per-user watch history and a favorites list are powered
by [Supabase](https://supabase.com) (free tier) and are **optional** — the
app works exactly as before if you don't set them up.

See [`SETUP_SUPABASE.md`](./SETUP_SUPABASE.md) for the full step-by-step
(creating the Supabase project, running `supabase/schema.sql`, enabling
Google OAuth, and setting the environment variables locally and on Vercel).
