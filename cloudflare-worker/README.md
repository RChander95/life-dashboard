# Oura proxy — one-time setup (free, ~15 min)

Your dashboard can't call Oura directly from the browser (Oura blocks that).
This tiny [Cloudflare Worker](https://workers.cloudflare.com/) fixes it: it
holds your Oura token securely and relays the data to your dashboard. It's
free and needs no credit card.

**What stays private:** your Oura token is stored as a Cloudflare *secret* —
it's never in the dashboard, the browser, or this GitHub repo.

---

## Step 1 — Get your Oura token

1. Go to <https://cloud.ouraring.com/personal-access-tokens>.
2. **Create New Personal Access Token** → copy it somewhere temporary.

## Step 2 — Create the Worker

1. Sign up / log in at <https://dash.cloudflare.com> (free).
2. In the left menu: **Compute (Workers)** → **Create** → **Create Worker**.
3. Give it a name like `oura-proxy` → **Deploy** (it deploys a placeholder).
4. Click **Edit code**.
5. Delete everything in the editor, then paste the entire contents of
   [`oura-proxy.js`](./oura-proxy.js) from this folder.
6. Click **Deploy** (top right).

## Step 3 — Add your token + origin as variables

1. Still on the Worker, go to **Settings** → **Variables and Secrets**.
2. Add a **Secret**:
   - Name: `OURA_TOKEN`
   - Value: the token you copied in Step 1
   - Save.
3. Add a **Variable** (plain text):
   - Name: `ALLOWED_ORIGIN`
   - Value: your dashboard's origin — for this repo that's
     `https://rchander95.github.io` (no path, no trailing slash).
   - Save / **Deploy**.

## Step 4 — Copy the Worker URL and connect the dashboard

1. On the Worker's overview page, copy its URL — it looks like
   `https://oura-proxy.YOUR-SUBDOMAIN.workers.dev`.
2. Open your live dashboard, click **Connect Oura**, paste that URL, **Save**.

Your Oura numbers should go live within a second. If you ever rotate your
token, just update the `OURA_TOKEN` secret on the Worker — nothing else changes.

---

### Notes

- The Worker only forwards four read-only Oura endpoints (readiness, sleep,
  activity, sleep detail) and only answers requests from your `ALLOWED_ORIGIN`.
- The Worker URL isn't secret, but it's stored only in your own browser
  (local storage), not committed to the repo. Even if someone had the URL,
  the `ALLOWED_ORIGIN` check blocks other websites from using it.
- Free tier allows 100,000 requests/day — far more than a dashboard needs.
