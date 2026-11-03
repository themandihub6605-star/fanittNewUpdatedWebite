# Fanitt website

Static marketing site for Fanitt (React + Vite + Tailwind + Framer Motion).
Everything app-related (campaigns, live, chat, store, login) lives in the mobile app.

## Run locally
    npm install
    npm run dev            # http://localhost:5173

## Build for Hostinger
    npm run build          # output in dist/

Upload everything inside `dist/` (including `.htaccess`) to `public_html` on Hostinger.

## Settings
- `.env` → `VITE_API_BASE_URL` (default https://api.fanitt.com/api)
- Company details, Play Store link, socials: `src/config/site.ts`
- App screenshots: `public/screens/*.webp`
- Legal pages are loaded live from the backend (`/api/legal`).
- The website's domain must be in the backend `CLIENT_URLS` (CORS).
