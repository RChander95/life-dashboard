# My Life Dashboard — notes for Claude Code

This repo is a static GitHub Pages site (Jekyll, no theme, no build tooling
beyond Jekyll itself). `index.html` is the whole dashboard: inline CSS, inline
JS, Liquid loops over `_data/*.yml`. There is no backend and no database —
every "connection" below is either a live client-side fetch or a file the
user edits.

If a user asks you to "set up my dashboard" or "connect my calendar/Oura/
Apple Health," walk them through the relevant section below rather than
re-architecting anything. Keep changes scoped to `_data/*.yml` unless they
explicitly ask for a design or feature change.

## The four data sources

| Source | File | Live or manual | Notes |
|---|---|---|---|
| Calendars | `_data/calendars.yml` | Live (Google Calendar iframe embed) | See "Calendar privacy" below — never suggest "Make available to public." |
| Weather / UV | `_data/location.yml` | Live (Open-Meteo, keyless) | Just needs `lat`/`lon`. No signup, no key. |
| Oura Ring | `_data/oura.yml` + in-page "Connect Oura" | Manual by default, live if user connects a token | See "Oura token" below. |
| Apple Health | `_data/apple_health.yml` | Manual only | Apple has no public API for Health data — do not imply this can be automated. |

## Calendar privacy

Google Calendar's "Make available to public" setting exposes the calendar to
anyone with the link, not just this dashboard. Always tell users to use
**"Share with specific people"** instead, sharing with their own Google
account. The embed then only renders real events for someone signed into
that account; everyone else sees a blank/permission box. This is already
the wording used in `_data/calendars.yml`'s comments and the in-page setup
guide — keep new instructions consistent with it.

## Oura token

`index.html` has a "Connect Oura" control in the Oura Ring section
(search for `oura-connect-box`). Clicking it reveals a password-type input;
the token is saved to `localStorage` only, never written to any file or
committed anywhere, and is sent only in direct HTTPS requests to
`api.ouraring.com` from the visitor's own browser. Tell users to generate a
**read-only** personal access token at
https://cloud.ouraring.com/personal-access-tokens.

The JS (`syncOura()` in `index.html`) calls `daily_readiness`,
`daily_sleep`, `daily_activity`, and `sleep` on Oura's v2 API and falls back
silently to the manual `_data/oura.yml` values if any call fails (e.g. bad
token, or Oura changes a field name). If a user reports a metric not
updating live, check the field names against Oura's current API docs
(https://cloud.ouraring.com/v2/docs) before assuming the token is wrong —
these were implemented without a live account to test against.

## The public-repo tradeoff

Free GitHub Pages requires the repo to be public — there is no private-Pages
option outside GitHub Enterprise. That means whatever is committed to
`_data/oura.yml`, `_data/apple_health.yml`, and `_data/location.yml` is
world-readable, even though nobody but the account-holder can see live
calendar events or a connected Oura feed. If a user is uncomfortable with
that, the fix is moving those two files' data into the same
`localStorage`-only pattern used for the Oura token (a small edit form on
each tile) rather than committed YAML — offer this, don't assume it, since
it's a real tradeoff between convenience and exposure.

## Design language

Warm/cream light mode, warm near-black dark mode (both via CSS custom
properties at the top of `index.html`, plus a manual toggle that sets
`data-theme` on `<html>`), serif figures for numbers (`--font-serif`), small-caps
gray "kicker" labels, status chips instead of colored borders, thin CSS
progress rings for 0–100 scores. Match this instead of introducing a new
visual style for new sections.
