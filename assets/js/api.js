/**
 * Data access layer. Read-only Supabase REST calls with the publishable key;
 * RLS decides what the browser may see. Short in-memory + sessionStorage cache
 * so moving between pages doesn't refetch everything.
 */
import { SUPABASE_URL, SUPABASE_KEY, PRICE_SEARCH_API } from "./config.js";

const TTL = 5 * 60 * 1000;
const mem = new Map();

function cacheGet(key) {
  const m = mem.get(key);
  if (m && Date.now() - m.t < TTL) return m.v;
  try {
    const s = JSON.parse(sessionStorage.getItem("sv:" + key) || "null");
    if (s && Date.now() - s.t < TTL) { mem.set(key, s); return s.v; }
  } catch { /* storage blocked — fine */ }
  return undefined;
}
function cacheSet(key, v) {
  const e = { t: Date.now(), v };
  mem.set(key, e);
  try { sessionStorage.setItem("sv:" + key, JSON.stringify(e)); } catch { /* quota / private mode */ }
}

export async function sb(path, { cache = true, timeout = 15000 } = {}) {
  if (cache) { const c = cacheGet(path); if (c !== undefined) return c; }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY, Accept: "application/json" }, signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (cache) cacheSet(path, data);
    return data;
  } finally { clearTimeout(timer); }
}

const DEAL_COLS = "id,created_at,store,store_slug,country,category,title,description,tags,discount_percent,promo_code,deal_score,sale_url,start_date,end_date,last_checked,status,image_url";
const STORE_COLS = "id,name,slug,country,currency,base_url,category,active,last_crawled_at,worlds,audience,brands,sort_order,logo_url";
const OFFER_COLS = "id,product_id,current_price,original_price,currency,discount_pct,deal_score,price_signal,in_stock,status,first_seen_at,last_seen_at,score_breakdown," +
  "products(id,title,brand,sku,category,product_url,image_url,updated_at,stores(name,slug,country,currency,base_url,logo_url))";

/** Active store-level promotions (curated). Expired-by-date rows are dropped client-side too. */
export async function getDeals() {
  const rows = await sb(`deals?select=${DEAL_COLS}&status=eq.active&order=deal_score.desc.nullslast,discount_percent.desc.nullslast`);
  const now = Date.now();
  return rows.filter(d => !d.end_date || new Date(d.end_date).getTime() >= now);
}
export const getStores = () => sb(`stores?select=${STORE_COLS}&order=sort_order.asc`);
/** Crawled product offers (RLS returns only active + in-stock). */
export const getOffers = () => sb(`offers?select=${OFFER_COLS}&order=deal_score.desc,discount_pct.desc&limit=500`);
export async function getOfferByProduct(productId) {
  const rows = await sb(`offers?select=${OFFER_COLS}&product_id=eq.${encodeURIComponent(productId)}&limit=1`, { cache: false });
  return rows[0] || null;
}
export async function getProduct(productId) {
  const rows = await sb(`products?select=id,title,brand,sku,category,product_url,image_url,updated_at,stores(name,slug,country,currency,base_url)&id=eq.${encodeURIComponent(productId)}&limit=1`);
  return rows[0] || null;
}
export const getHistory = (productId) => sb(`price_history?select=price,original_price,observed_at&product_id=eq.${encodeURIComponent(productId)}&order=observed_at.asc&limit=1000`, { cache: false });

export async function getFx() {
  const rows = await sb("fx_rates?select=code,rate_gel,rate_date");
  const fx = {}; rows.forEach(r => (fx[r.code] = Number(r.rate_gel)));
  return { fx, date: rows[0]?.rate_date || null };
}

/** Same product sold in several countries (currently KIKO Milano IT vs GB). */
export function searchCompare(q) {
  const clean = String(q || "").replace(/[*,()%]/g, " ").trim();
  const filter = clean ? `&or=(title.ilike.*${encodeURIComponent(clean)}*,code.ilike.*${encodeURIComponent(clean)}*,brand.ilike.*${encodeURIComponent(clean)}*)` : "";
  return sb(`compare_items?select=id,brand,code,title,image_url,category,updated_at,compare_prices(country,currency,price,original_price,in_stock,url,checked_at)${filter}&order=updated_at.desc&limit=40`);
}

export async function priceSearch(q, countries) {
  if (!PRICE_SEARCH_API) throw new Error("not_configured");
  const r = await fetch(`${PRICE_SEARCH_API}?${new URLSearchParams({ q, countries: countries.join(",") })}`, { headers: { Accept: "application/json" } });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "failed");
  return data;
}

/** Email waitlist (RLS: anon may INSERT only, with whitelisted interests). Returns HTTP status. */
export async function subscribe(email, interests) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/radar_subscribers`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ email, interests })
  });
  return r.status;
}
