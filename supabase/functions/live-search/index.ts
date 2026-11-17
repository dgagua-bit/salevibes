// live-search — finds a specific product on store websites right now, with real prices.
// Public:  POST { q }                 -> { items: [...], stores_searched, cached }
// Admin:   POST { task: "detect" }    -> marks which stores expose Shopify's public product search
// Only public storefront endpoints are used (/search/suggest.json, /cart.js). Results are cached 30 min;
// fresh searches are capped at 40 per minute in total. Every query is logged (text + result count only) for the admin panel.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const TTL_MIN = 30, MAX_STORES = 40, PER_STORE = 10; // 10 = the most Shopify's predictive search returns per store

async function authorized(req: Request) {
  const secret = req.headers.get("x-radar-secret");
  if (secret) { const { data } = await db.rpc("verify_radar_secret", { p: secret }); return data === true; }
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token || token.startsWith("sb_")) return false;
  const { data: { user } } = await db.auth.getUser(token);
  if (!user?.email || !user.email_confirmed_at) return false;
  const { data } = await db.from("admins").select("email").eq("email", user.email.toLowerCase()).maybeSingle();
  return !!data;
}

async function getJson(url: string, ms = 7000) {
  const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, redirect: "follow", signal: AbortSignal.timeout(ms) });
  if (!r.ok) { await r.body?.cancel(); throw new Error(`HTTP ${r.status}`); }
  const t = await r.text();
  if (!/^\s*[{\[]/.test(t)) throw new Error("not json");
  return JSON.parse(t);
}

function bases(baseUrl: string) {
  const u = new URL(baseUrl);
  const prefix = u.pathname.replace(/\/+$/, "");
  return [...new Set([u.origin + prefix, u.origin])];
}

async function detect(s: any) {
  for (const b of bases(s.base_url)) {
    try {
      const d = await getJson(`${b}/search/suggest.json?q=a&resources[type]=product&resources[limit]=1`);
      if (d?.resources?.results) return { platform: "shopify", search_base: b };
    } catch { /* try next */ }
  }
  return { platform: "other", search_base: null };
}

function num(v: unknown) { const n = Number(String(v ?? "").replace(",", ".")); return Number.isFinite(n) && n > 0 ? n : null; }

// Shopify answers in the currency of the visitor's location, so ask each store which one it uses (cached 6 h).
const curCache = new Map<string, { c: string; t: number }>();
async function storeCurrency(origin: string) {
  const hit = curCache.get(origin);
  if (hit && Date.now() - hit.t < 6 * 3600_000) return hit.c;
  const cart = await getJson(`${origin}/cart.js`, 6000).catch(() => null);
  const c = /^[A-Z]{3}$/.test(cart?.currency || "") ? cart.currency : null;
  if (c) curCache.set(origin, { c, t: Date.now() });
  return c;
}

async function searchStore(s: any, q: string) {
  const [d, currency] = await Promise.all([
    getJson(`${s.search_base}/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=${PER_STORE}&resources[options][unavailable_products]=last`, 6000),
    storeCurrency(new URL(s.search_base).origin)
  ]);
  if (!currency) return [];
  const origin = new URL(s.search_base).origin;
  return (d?.resources?.results?.products || []).map((p: any) => {
    const price = num(p.price) ?? num(p.price_min);
    const orig = num(p.compare_at_price_max) ?? num(p.compare_at_price_min);
    let url = String(p.url || ""); if (url.startsWith("/")) url = origin + url; url = url.split("?")[0];
    let image = String(p.image || p.featured_image?.url || ""); if (image.startsWith("//")) image = "https:" + image;
    return { store: s.name, store_slug: s.slug, country: s.country, currency, title: String(p.title || "").slice(0, 200), brand: p.vendor || null,
      price, original_price: orig && price && orig > price ? orig : null, url, image: image || null, in_stock: p.available !== false };
  }).filter((x: any) => x.price && x.url.startsWith("https://"));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  let body: any = {}; try { body = await req.json(); } catch { /* none */ }

  if (body.task === "detect") {
    if (!(await authorized(req))) return json({ error: "unauthorized" }, 401);
    const { data: stores } = await db.from("stores").select("id,name,base_url").order("sort_order");
    const out: any[] = []; let i = 0;
    await Promise.all(Array.from({ length: 8 }, async () => {
      while (i < (stores || []).length) {
        const s = stores![i++]; const r = await detect(s);
        await db.from("stores").update({ ...r, platform_checked_at: new Date().toISOString() }).eq("id", s.id);
        out.push({ name: s.name, ...r });
      }
    }));
    return json({ ok: true, shopify: out.filter(x => x.platform === "shopify").map(x => x.name), checked: out.length });
  }

  const q = String(body.q || "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (q.length < 2) return json({ error: "query_too_short" }, 400);
  const key = q.toLowerCase();
  const { data: hit } = await db.from("search_cache").select("payload,created_at").eq("key", key).maybeSingle();
  if (hit && Date.now() - new Date(hit.created_at).getTime() < TTL_MIN * 60_000) {
    await db.from("search_log").insert({ q, results: (hit.payload as any)?.items?.length ?? 0, cached: true });
    return json({ ...hit.payload, cached: true });
  }
  // protect the stores and our quota: at most 40 fresh (uncached) searches per minute in total
  const { count } = await db.from("search_log").select("id", { count: "exact", head: true }).eq("cached", false).gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((count ?? 0) >= 40) return json({ error: "busy" }, 429);

  const { data: stores } = await db.from("stores").select("name,slug,country,currency,search_base,brands,sort_order").eq("platform", "shopify").not("search_base", "is", null);
  const terms = key.split(" ");
  const ranked = (stores || []).map(s => ({ s, w: (s.brands || []).some((b: string) => terms.some(t => b.toLowerCase().includes(t) && t.length > 2)) ? 0 : 1 }))
    .sort((a, b) => a.w - b.w || (a.s.sort_order ?? 999) - (b.s.sort_order ?? 999)).slice(0, MAX_STORES).map(x => x.s);
  const results = await Promise.allSettled(ranked.map(s => searchStore(s, q)));
  const items = results.flatMap(r => r.status === "fulfilled" ? r.value : []);
  const payload = { q, items, stores_searched: ranked.length, stores_answered: results.filter(r => r.status === "fulfilled").length, at: new Date().toISOString() };
  await db.from("search_cache").upsert({ key, payload, created_at: new Date().toISOString() });
  await db.from("search_log").insert({ q, results: items.length, cached: false });
  return json({ ...payload, cached: false });
});
