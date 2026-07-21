# My Life Dashboard

A personal, mobile-friendly dashboard — calendars, Oura Ring, and weather/UV — built as a static [GitHub Pages](https://pages.github.com/) site. No backend, no database, no paid hosting.

## Use this yourself

1. Click **Use this template** above (or fork it) to get your own copy.
2. In your copy's **Settings**, make sure the repo is **public** — free GitHub Pages requires it.
3. **Settings → Pages** → Source: **Deploy from a branch** → `main` → Save.
4. Open the repo in [Claude Code](https://claude.com/claude-code) and ask it to help you connect your calendars and Oura — it will read `CLAUDE.md` and know the setup and safety rules automatically. Or edit the files by hand, see below.

## What's live vs. manual

| Section | How it works |
|---|---|
| **Calendars** | Live Google Calendar embeds — configure in `_data/calendars.yml`. Share each calendar with your own Google account (not "public"), so events only render for you, signed in. |
| **Weather / UV** | Live, automatic, no signup — fetched from the free keyless [Open-Meteo](https://open-meteo.com/) API using coordinates in `_data/location.yml`. |
| **Oura Ring** | Live, once connected — click "Connect Oura" on the dashboard and paste a personal access token. It's stored only in your browser (`localStorage`), never committed to this repo. Or leave it disconnected and edit `_data/oura.yml` manually. |

## Security notes

- No API keys or secrets are ever committed to this repo.
- The Oura token you enter lives only in your own browser's local storage and is sent only to Oura's own API, directly from your device.
- This repo must be **public** for free GitHub Pages to work, so anything committed to `_data/*.yml` (the fallback Oura numbers, your approximate location) is technically world-readable. If that matters to you, keep those numbers vague/rounded, or ask Claude Code to help move them to browser-only storage too.

&copy; 2026 &bull; [MIT License](https://gh.io/mit)
