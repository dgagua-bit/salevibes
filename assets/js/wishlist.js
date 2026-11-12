/**
 * Wishlist + local price alerts. Everything lives in this browser's
 * localStorage — nothing is sent anywhere. Alerts are evaluated when the user
 * opens the site (no background/email delivery yet).
 */
const KEY = "sv-wishlist-v1";
const LEGACY = "vibes-favs"; // home page: array of saved deal ids

function blank() { return { items: {}, brands: [], minDiscount: 0 }; }

export function load() {
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { s = null; }
  if (!s || typeof s !== "object" || !s.items) s = blank();
  // The home page (original design) keeps saved promotions in "vibes-favs".
  // That list is the source of truth for deal items, so both views stay in sync.
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY) || "[]");
    if (Array.isArray(legacy)) {
      const want = new Set(legacy.map(String));
      Object.keys(s.items).forEach(k => { if (k.startsWith("deal:") && !want.has(k.slice(5))) delete s.items[k]; });
      want.forEach(id => { const k = `deal:${id}`; if (!s.items[k]) s.items[k] = { type: "deal", id, savedAt: new Date().toISOString() }; });
    }
  } catch { /* ignore */ }
  return s;
}
export function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
  try {
    const ids = Object.values(s.items).filter(i => i.type === "deal").map(i => (isNaN(Number(i.id)) ? i.id : Number(i.id)));
    localStorage.setItem(LEGACY, JSON.stringify(ids));
  } catch { /* private mode */ }
  try { window.dispatchEvent(new CustomEvent("sv:wishlist", { detail: s })); } catch { /* node */ }
}

export const keyOf = (type, id) => `${type}:${id}`;
export const has = (type, id) => !!load().items[keyOf(type, id)];
export const count = () => Object.keys(load().items).length;

export function toggle(type, id, snapshot = {}) {
  const s = load(), k = keyOf(type, id);
  if (s.items[k]) delete s.items[k];
  else s.items[k] = { type, id: String(id), savedAt: new Date().toISOString(), ...snapshot };
  save(s);
  return !!s.items[k];
}
export function setTarget(type, id, target) {
  const s = load(), k = keyOf(type, id);
  if (!s.items[k]) return;
  const n = Number(target);
  if (n > 0) s.items[k].targetPrice = n; else delete s.items[k].targetPrice;
  save(s);
}
export function setPrefs({ brands, minDiscount }) {
  const s = load();
  if (Array.isArray(brands)) s.brands = [...new Set(brands.map(b => String(b).trim()).filter(Boolean))].slice(0, 30);
  if (minDiscount !== undefined) s.minDiscount = Math.max(0, Math.min(90, Number(minDiscount) || 0));
  save(s);
}

/**
 * Which conditions are met right now?
 * @returns [{kind:'target'|'brand', offer, item?}]
 */
export function matches(state, offers) {
  const out = [];
  const byProduct = new Map(offers.map(o => [String(o.product_id), o]));
  Object.values(state.items).forEach(it => {
    if (it.type !== "offer" || !it.targetPrice) return;
    const o = byProduct.get(String(it.id));
    if (o && Number(o.current_price) <= it.targetPrice) out.push({ kind: "target", offer: o, item: it });
  });
  if (state.brands.length) {
    const want = state.brands.map(b => b.toLowerCase());
    offers.forEach(o => {
      const b = String(o.products?.brand || "").toLowerCase();
      if (b && want.includes(b) && Number(o.discount_pct) >= (state.minDiscount || 1)) out.push({ kind: "brand", offer: o });
    });
  }
  return out;
}
