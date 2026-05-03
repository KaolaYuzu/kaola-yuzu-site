# Kaola Yuzu Vercel Deploy Package

Structure:

- `index.html` — main Kaola Yuzu website
- `quiz.html` — AI music distributor quiz page
- `api/subscribe.js` — Vercel Serverless Function for Brevo email subscription

Vercel settings:

- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty

Required Environment Variables:

- `BREVO_API_KEY`
- `BREVO_LIST_ID`

Routes:

- `/` main site
- `/quiz.html` distributor quiz

Notes:

- The quiz email form now posts to `/api/subscribe`, so it uses the same Brevo flow as the main site.
- Affiliate buttons remain client-side links.
