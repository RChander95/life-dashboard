/**
 * Oura proxy — a tiny Cloudflare Worker.
 *
 * Why this exists: Oura's API does not allow web pages to call it directly
 * (no CORS), so a static GitHub Pages dashboard can't reach it from the
 * browser. This Worker sits in between: the dashboard calls the Worker, the
 * Worker calls Oura with your token (added server-side) and returns the data
 * with the CORS header the browser needs.
 *
 * Your Oura token is stored as a Worker *secret* (OURA_TOKEN) — it never
 * appears in the dashboard, the browser, or the GitHub repo.
 *
 * Setup lives in cloudflare-worker/README.md. Two variables to set in the
 * Cloudflare dashboard:
 *   - OURA_TOKEN     (Secret)   your Oura personal access token
 *   - ALLOWED_ORIGIN (Variable) your dashboard origin, e.g.
 *                               https://rchander95.github.io
 */

const OURA_BASE = 'https://api.ouraring.com/v2/usercollection/';
// Read-only daily collections the dashboard may request. Extra entries here
// are future-proofing so new tiles don't require re-editing the Worker.
const ALLOWED_PATHS = [
  'daily_readiness', 'daily_sleep', 'daily_activity', 'daily_stress',
  'daily_spo2', 'daily_resilience', 'daily_cardiovascular_age',
  'sleep', 'sleep_time',
];

export default {
  async fetch(request, env) {
    const allowOrigin = env.ALLOWED_ORIGIN || '*';
    const reqOrigin = request.headers.get('Origin') || '';

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors(allowOrigin) });
    }

    // Only answer requests coming from your dashboard's origin.
    if (allowOrigin !== '*' && reqOrigin && reqOrigin !== allowOrigin) {
      return json({ error: 'origin not allowed' }, 403, allowOrigin);
    }

    if (!env.OURA_TOKEN) {
      return json({ error: 'OURA_TOKEN secret is not set on this Worker' }, 500, allowOrigin);
    }

    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '';
    const start = url.searchParams.get('start_date') || '';
    const end = url.searchParams.get('end_date') || '';

    if (!ALLOWED_PATHS.includes(path)) {
      return json({ error: 'unsupported path' }, 400, allowOrigin);
    }

    const ouraUrl = OURA_BASE + path +
      '?start_date=' + encodeURIComponent(start) +
      '&end_date=' + encodeURIComponent(end);

    let ouraResp;
    try {
      ouraResp = await fetch(ouraUrl, {
        headers: { Authorization: 'Bearer ' + env.OURA_TOKEN },
      });
    } catch (e) {
      return json({ error: 'could not reach Oura' }, 502, allowOrigin);
    }

    const body = await ouraResp.text();
    return new Response(body, {
      status: ouraResp.status,
      headers: cors(allowOrigin, true),
    });
  },
};

function cors(origin, isJson) {
  const h = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  };
  if (isJson) h['Content-Type'] = 'application/json';
  return h;
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), { status, headers: cors(origin, true) });
}
