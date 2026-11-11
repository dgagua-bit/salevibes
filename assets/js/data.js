/** Page-level data loading: fetch once, enrich, expose lookups. */
import { getDeals, getStores, getOffers, getFx } from "./api.js";
import { enrichOffer } from "./intel.js";
import { catLabel, countryName } from "./format.js";

export async function loadAll({ deals = true, stores = true, offers = true } = {}) {
  const [d, s, o, f] = await Promise.allSettled([
    deals ? getDeals() : [], stores ? getStores() : [], offers ? getOffers() : [], getFx()
  ]);
  const fxRes = f.status === "fulfilled" ? f.value : { fx: {}, date: null };
  const out = {
    deals: d.status === "fulfilled" ? d.value : null,
    stores: s.status === "fulfilled" ? s.value : null,
    offersRaw: o.status === "fulfilled" ? o.value : null,
    fxRes, fx: fxRes.fx,
    errors: [d, s, o, f].filter(x => x.status === "rejected").map(x => String(x.reason))
  };
  out.enriched = (out.offersRaw || []).map(x => enrichOffer(x, out.fx));
  out.byProduct = new Map(out.enriched.map(e => [String(e.offer.product_id), e]));
  out.dealById = new Map((out.deals || []).map(x => [String(x.id), x]));
  return out;
}

export const dealsForStore = (deals, s) => (deals || []).filter(d => d.store_slug === s.slug || d.store === s.name);
export const bestDiscount = (deals, s) => dealsForStore(deals, s).reduce((m, d) => Math.max(m, Number(d.discount_percent) || 0), -1);

/** Brand → stores index from stores.brands[] + crawled product brands. */
export function brandIndex(stores, enriched = []) {
  const m = new Map();
  const add = (name, store, kind) => {
    const k = name.trim().toLowerCase(); if (!k) return;
    if (!m.has(k)) m.set(k, { name: name.trim(), stores: new Map(), products: 0 });
    const e = m.get(k);
    if (store) e.stores.set(store.slug || store.name, store);
    if (kind === "product") e.products++;
  };
  (stores || []).forEach(s => (s.brands || []).forEach(b => add(b, s)));
  enriched.forEach(e => e.product.brand && add(e.product.brand, (stores || []).find(s => s.slug === e.store.slug) || e.store, "product"));
  return m;
}

/** Text used for unified search across a product offer. */
export const offerHaystack = e => [e.product.title, e.product.brand, e.product.sku, e.store.name, e.product.category, catLabel(e.product.category), countryName(e.store.country), e.store.country].join(" ").toLowerCase();
export const dealHaystack = d => [d.store, d.title, d.description, d.promo_code, d.category, catLabel(d.category), countryName(d.country), d.country, ...(d.tags || [])].join(" ").toLowerCase();
