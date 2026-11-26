/**
 * Product search engine, shared by search.html, the home-page price finder and tools.html.
 *
 * One query → every place we can see a price for it:
 *   - live store search (Edge Function live-search: stores whose sites have a public product search),
 *   - our crawled catalogue (offers),
 *   - cross-country brand prices (compare_items).
 * Every result is priced the same way — "≈ in Georgia" = goods + shipping + customs (estimate, pricing.js) —
 * and the cheapest in-stock exact match is the "best price".
 */
import { esc, safeUrl, money, gelText, flag, countryName } from "./format.js";
import { getFx, getOffers, getStores, searchCompare } from "./api.js";
import { landedCost, toGel } from "./pricing.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

/* ---------- text matching ---------- */
const KA = { ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i", კ: "k", ლ: "l", მ: "m", ნ: "n", ო: "o", პ: "p", ჟ: "zh", რ: "r", ს: "s", ტ: "t", უ: "u", ფ: "p", ქ: "k", ღ: "gh", ყ: "k", შ: "sh", ჩ: "ch", ც: "ts", ძ: "dz", წ: "ts", ჭ: "ch", ხ: "kh", ჯ: "j", ჰ: "h" };
// Georgian words people type → what store titles say
export const SYN = { "ფეხსაცმელი": "shoe", "სნიკერი": "sneaker", "სნიკერები": "sneaker", "სუნამო": "parfum", "ჩანთა": "bag", "საათი": "watch", "სათვალე": "sunglasses", "კაბა": "dress", "ქურთუკი": "jacket", "მაისური": "shirt", "ჯინსი": "jeans", "ქალის": "women", "კაცის": "men", "ბავშვის": "kids", "კრემი": "cream" };
const BRAND_KA = { "ნაიკი": "nike", "ადიდასი": "adidas", "პუმა": "puma", "გუჩი": "gucci", "პრადა": "prada", "დიორი": "dior", "შანელი": "chanel", "ზარა": "zara", "მანგო": "mango", "ლევისი": "levis", "ნიუ ბალანსი": "new balance", "ბალენსიაგა": "balenciaga", "ვერსაჩე": "versace", "არმანი": "armani", "კელვინ კლაინი": "calvin klein", "ტომი": "tommy", "ლაკოსტი": "lacoste", "სპიდო": "speedo" };
export const norm = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/['’`]/g, "").replace(/[^a-z0-9\u10d0-\u10ff]+/g, " ").trim();
// filler words in a query: "aventus by creed" means "aventus creed" (store titles rarely say "by")
const QSTOP = new Set("by for the and of with de du la le in a an to from pour et y e und".split(" "));
export function queryTerms(q) {
  let s = norm(q);
  for (const [k, v] of Object.entries(BRAND_KA)) s = s.replace(k, v);
  const all = s.split(" ").filter(Boolean).map(t => SYN[t] || (/[\u10d0-\u10ff]/.test(t) ? [...t].map(c => KA[c] || c).join("") : t));
  const kept = all.filter(t => !QSTOP.has(t));
  return kept.length ? kept : all;
}
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } }
  return d[b.length];
}
const ABBR = [[/eau de parfum/, " edp"], [/eau de toilette/, " edt"], [/eau de cologne/, " edc"], [/\bnew balance\b/, " nb"]];
/** share of query terms found in the item text (exact, inside a word, or 1–2 typos in longer words) */
export function relevance(terms, text) {
  let hay = norm(text); for (const [re, a] of ABBR) if (re.test(hay)) hay += a;
  const words = hay.split(" "), joined = hay.replace(/ /g, "");
  let hit = 0;
  for (const t of terms) {
    if (/^\d+$/.test(t)) { // a model number: whole number, may carry letters around it (9060 ↔ U9060, 1080 ↔ 1080v15) but no extra digits
      const re = new RegExp(`^[a-z]{0,3}${t}(?![0-9])`);
      if (words.some(w => re.test(w))) hit++;
      continue;
    }
    if (t.length <= 2) { if (words.includes(t)) hit++; continue; }
    if (hay.includes(t) || joined.includes(t)) { hit++; continue; }
    if (t.length >= 6 && !/\d/.test(t) && words.some(w => w.length >= 5 && lev(t, w) <= (t.length >= 9 ? 2 : 1))) hit++; // typos only in longer words — "lloyd" must not match "floyd"
  }
  return terms.length ? hit / terms.length : 0;
}

/* ---------- the same product across stores ----------
   Titles differ between stores ("Sauvage by Christian Dior 3.4 oz EDP Spray" vs "Dior Sauvage Eau de Parfum 100ml"),
   so each title is reduced to a key: brand/model words + canonical size, without colours, genders, style codes
   and filler words. Only identical keys count as the same product — never a fuzzy guess. */
const STOP = new Set("the and of for with by de la le du pour men mens man women womens woman ladies unisex adult shoes shoe sneaker sneakers trainer trainers spray vaporisateur vapo natural new size one og originals sale outlet running".split(" "));
const COLORS = new Set("white black blue red green grey gray pink brown beige cream navy silver gold yellow orange purple ivory tan khaki olive burgundy multi multicolor multicolour bianco bianca nero nera blu rosso rossa verde grigio rosa marrone argento oro giallo blanc noir bleu rouge vert gris weiss schwarz blau rot braun negro blanco azul rojo triple wolf cool dark light core cloud chalk gum metallic sail bone smoke platinum midnight".split(" "));
const PHRASES = [[/ eau de parfum /g, " edp "], [/ eau de toilette /g, " edt "], [/ eau de cologne /g, " edc "], [/ christian dior /g, " dior "], [/ yves saint laurent /g, " ysl "], [/ saint laurent /g, " ysl "], [/ dolce (and )?gabbana /g, " dg "], [/ new balance /g, " nb "], [/ air jordan /g, " jordan "]];
const SIZE_RE = /(\d+(?:[.,]\d+)?)\s*(fl\.?\s*oz|oz|ml|cl|kg|gr|g)\b/gi;
const CODE_RE = /\b(?:[a-z]{1,3}\d{3,5}|\d{6})-\d{3}\b|\b[a-z]{1,2}\d{4,6}\b/gi; // style codes: CN8490-100, 604133-050, IE3437
function sizes(title) {
  const out = [];
  String(title).replace(SIZE_RE, (_, n, u) => {
    let v = parseFloat(n.replace(",", ".")); u = u.toLowerCase().replace(/[^a-z]/g, "");
    if (u === "floz" || u === "oz") { v *= 29.5735; u = "ml"; } else if (u === "cl") { v *= 10; u = "ml"; } else if (u === "kg") { v *= 1000; u = "g"; } else if (u === "gr") u = "g";
    out.push((v < 20 ? Math.round(v) : Math.round(v / 5) * 5) + u);
  });
  return out;
}
const joinVersion = s => s.replace(/\b(\d{2,4}) (v\d{1,2})\b/g, "$1$2"); // "1080 v15" → "1080v15"
export function productKey(title) {
  let s = " " + joinVersion(norm(String(title).replace(SIZE_RE, " ").replace(CODE_RE, " "))) + " ";
  for (const [re, v] of PHRASES) s = s.replace(re, v);
  const words = s.split(" ").filter(w => w.length > 1 && !STOP.has(w) && !COLORS.has(w));
  return [...new Set([...words, ...sizes(title)])].sort().join(" ");
}
// kids' versions and side products (Sauvage deodorant, Samba laces) are not what people mean by the product name
const KIDS = /\b(kids?|junior|jr|baby|babies|infants?|toddlers?|child|children|boys|girls|youth|gs|ps|td)\b/;
const SIDE = /\b(deodorant|deo|shower gel|body lotion|lotion|aftershave|after shave|socks?|laces?|insoles?|cleaner|samples?|miniature|keyrings?|keychains?|bundle|gift ?sets?|coffret|discovery set|sampler|travel set|mini set|duo set|value set|vials?|combo|\d ?pcs)\b/;
export const secondary = (title, q) => { const t = norm(title), qq = norm(q); return (KIDS.test(t) && !KIDS.test(qq)) || (SIDE.test(t) && !SIDE.test(qq)); };

/* brand names typed without spaces ("newbalance", "calvinklein") → the spaced form store titles use.
   Built from the brands our stores carry, plus a few model names. */
const MODEL_ALIASES = { airmax: "air max", airforce: "air force", airjordan: "air jordan", thenorthface: "the north face", northface: "the north face" };
let aliasPromise = null;
function brandAliases() {
  aliasPromise ||= getStores().then(rows => {
    const m = { ...MODEL_ALIASES };
    for (const st of rows || []) for (const b of [st.name, ...(st.brands || [])]) { const n = norm(b); if (n.includes(" ")) m[n.replace(/ /g, "")] = n; }
    return m;
  }).catch(() => ({ ...MODEL_ALIASES }));
  return aliasPromise;
}
const expandQuery = (q, aliases) => norm(q).split(" ").map(t => aliases[t] || t).join(" ");

/** The query is just a brand ("new balance", "nike") when every word is part of most results' brand. Returns the brand or null. */
export function brandOf(items, terms) {
  const withBrand = items.filter(x => x.brand);
  if (withBrand.length < 3 || !terms.length) return null;
  const hits = withBrand.filter(x => { const b = norm(x.brand); return terms.every(t => b.includes(t)); });
  if (hits.length / withBrand.length < 0.6) return null;
  const c = {}; hits.forEach(x => { c[x.brand] = (c[x.brand] || 0) + 1; });
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
}
// model numbers: 9060, 550, 1906R, T500, 1080v15, 990v6 (not sizes, not long style codes)
const MODEL_RE = /^(?:[a-z]{0,2}\d{3,4}[a-z]{0,2}|\d{3,4}v\d{1,2})$/;
/** The models that appear in at least two results — for a "which model?" picker after a brand-only search. */
export function modelsOf(items, brand) {
  const bw = new Set(norm(brand).split(" ")), c = new Map();
  for (const it of items) {
    const seen = new Set();
    for (const t of joinVersion(norm(String(it.title).replace(SIZE_RE, " "))).split(" ")) {
      if (bw.has(t) || seen.has(t) || !MODEL_RE.test(t) || /^(19|20)\d\d$/.test(t)) continue;
      seen.add(t); c.set(t, (c.get(t) || 0) + 1);
    }
  }
  return [...c.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([model, n]) => ({ model, n }));
}
/** After a brand-only search: buttons that re-run the search for one model (each carries the full new query in data-q),
    plus a hint to type the model. Empty when the query was not just a brand. */
export function modelChipsHTML(models, baseQuery, brand) {
  if (!brand) return "";
  return `<div class="srch-models"><p>რომელი მოდელი? <small>აირჩიე — შევადარებთ ზუსტად მის ფასებს სხვადასხვა მაღაზიაში</small></p>
    ${models.map(m => `<button type="button" class="srch-mchip" data-q="${esc(`${baseQuery} ${m.model}`)}">${esc(m.model.toUpperCase())} <b>${m.n}</b></button>`).join("")}
    <small class="srch-hint">${models.length ? "სხვა მოდელი? " : ""}ჩაწერე ძიებაში ბრენდი და მოდელი ერთად, მაგ. „${esc(brand)} ${esc(models[0]?.model.toUpperCase() || "…")}“ — ასე შევადარებთ ზუსტად იმ პროდუქტს.</small></div>`;
}

/* ---------- brand focus ----------
   "creed" should not rank a Funko figure called "… Gage Creed" first, and "lloyd" means LLOYD shoes, not Milton-Lloyd.
   When the query names a brand, results of other brands are only "similar". When it names none but one brand clearly
   dominates the matches ("aventus" → Creed), knock-offs from other brands are "similar" too. */
const BRAND_GENERIC = new Set("the co company inc ltd llc spa gmbh official store shop christian maison parfums parfum perfumes fragrances beauty cosmetics studio atelier house paris london milano milan".split(" "));
const BRAND_SUFFIX_RE = /\b(running|sportswear|originals|performance|kids|men|women|official|inc|ltd|llc|spa|gmbh)\b/g;
const withPhrases = s => { let x = " " + s + " "; for (const [re, v] of PHRASES) x = x.replace(re, v); return x.replace(/\s+/g, " ").trim(); };
export const brandCore = b => withPhrases(norm(b).replace(BRAND_SUFFIX_RE, " "));
const sigWords = core => core.split(" ").filter(w => (w.length >= 3 || w === "nb" || w === "dg") && !BRAND_GENERIC.has(w));
/** The set of brand cores the results should focus on, or null (no brand preference). */
export function brandFocus(items, terms) {
  const q = new Set(withPhrases(terms.join(" ")).split(" ").concat(terms));
  const info = new Map();
  for (const it of items) {
    if (!it.brand) continue;
    const c = brandCore(it.brand); if (!c || info.has(c)) continue;
    const sw = sigWords(c); if (!sw.length) continue;
    const matched = sw.filter(w => q.has(w)).length;
    info.set(c, { matched, extra: sw.length - matched });
  }
  const named = [...info].filter(([, v]) => v.matched > 0);
  if (named.length) { const least = Math.min(...named.map(([, v]) => v.extra)); return new Set(named.filter(([, v]) => v.extra === least).map(([c]) => c)); }
  const counts = new Map(); let withBrand = 0;
  for (const it of items) if (it.brand) { withBrand++; const c = brandCore(it.brand); counts.set(c, (counts.get(c) || 0) + 1); }
  const top = [...counts].sort((a, b) => b[1] - a[1])[0];
  return top && top[1] >= 2 && top[1] / withBrand >= 0.5 ? new Set([top[0]]) : null;
}

/** Clusters items by productKey; sets it.group on each item. Groups sold by the most stores first. */
export function groupItems(list) {
  const m = new Map();
  for (const it of list) { const k = productKey(it.title); if (!m.has(k)) m.set(k, { key: k, items: [] }); const g = m.get(k); g.items.push(it); it.group = g; }
  const groups = [...m.values()];
  for (const g of groups) {
    g.label = g.items.map(x => x.title).sort((a, b) => a.length - b.length)[0];
    g.stores = new Set(g.items.map(x => x.store)).size;
    g.min = Math.min(...g.items.map(x => x.landed ?? Infinity));
  }
  return groups.sort((a, b) => b.stores - a.stores || b.items.length - a.items.length || a.min - b.min);
}
const guessCat = t => /sneaker|shoe|boot|loafer|sandal|trainer|heel|mule/i.test(t) ? "shoes" : /parfum|eau de|perfume|cream|serum|lipstick|mascara/i.test(t) ? "beauty" : /watch/i.test(t) ? "watches" : /bag|wallet|sunglass|belt/i.test(t) ? "accessories" : "fashion";

/* ---------- sources ---------- */
// searches from local tests are not written to the admin panel's search statistics
const IS_TEST = typeof location === "undefined" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
async function liveSearch(q) {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/live-search`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(IS_TEST ? { q, test: true } : { q }), signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error("live " + r.status);
  return r.json();
}
/** A store's "brand" field, or null when it is a code or filler rather than a brand name. */
export function cleanBrand(b) {
  const t = String(b || "").trim();
  if (!t || /^[a-z]{0,2}[-\s]?\d+[a-z]?$/i.test(t) || (t.match(/[a-z\u00c0-\u024f]/gi) || []).length < 2) return null;
  if (/\b(bundle|save|sale|gift|default|vendor|unknown|various|n\/a)\b/i.test(t)) return null;
  return t;
}
function fromOffers(rows) {
  return (rows || []).map(o => { const p = o.products || {}, s = p.stores || {};
    return { src: "catalogue", store: s.name, country: s.country, currency: o.currency || s.currency, title: p.title, brand: p.brand, price: Number(o.current_price), original_price: Number(o.original_price) > Number(o.current_price) ? Number(o.original_price) : null, url: p.product_url, image: p.image_url, in_stock: o.in_stock !== false, category: p.category }; });
}
function fromCompare(rows) {
  return (rows || []).flatMap(c => (c.compare_prices || []).map(p => ({ src: "compare", store: `${c.brand} ${p.country}`, country: p.country, currency: p.currency, title: c.title_en || c.title, brand: c.brand, price: Number(p.price), original_price: Number(p.original_price) > Number(p.price) ? Number(p.original_price) : null, url: p.url, image: c.image_url, in_stock: p.in_stock !== false, category: c.category, kg: c.weight_g ? c.weight_g / 1000 : null })));
}
function priceItem(it, fx) {
  const l = landedCost({ price: it.price, currency: it.currency, fx, kg: it.kg || undefined, category: it.category || guessCat(it.title) });
  return { ...it, gel: toGel(it.price, it.currency, fx), landed: l.total, taxable: !!(l.customs && l.customs.taxable), disc: it.original_price ? Math.round((1 - it.price / it.original_price) * 100) : 0 };
}

/**
 * Runs the search. Returns { q, terms, fx, items, similar, close, live }:
 *   items   — every query word matches, not a kids'/side product (unless asked for), of the brand the query is about
 *   similar — kids'/side products, other brands, partial matches (≥ half of the words)
 *   close   — when nothing matches exactly: the nearest partial matches (≥ 2/3 of the words)
 *   live    — live-search meta ({ stores_answered, at }) or null when it was unavailable
 */
export async function findProducts(q, { fx } = {}) {
  const terms = queryTerms(expandQuery(q, await brandAliases()));
  const [fxr, live, offers, cmp] = await Promise.allSettled([fx && Object.keys(fx).length ? Promise.resolve({ fx }) : getFx(), liveSearch(terms.join(" ")), getOffers(), searchCompare(terms.join(" "))]);
  const FX = fxr.status === "fulfilled" ? fxr.value.fx || {} : {};
  const all = [
    ...(live.status === "fulfilled" ? live.value.items || [] : []).map(x => ({ ...x, brand: cleanBrand(x.brand), side: /bundle|gift|\bset\b/i.test(x.brand || ""), src: "live" })),
    ...fromOffers(offers.status === "fulfilled" ? offers.value : []),
    ...fromCompare(cmp.status === "fulfilled" ? cmp.value : [])
  ];
  return { q, terms, fx: FX, ...rankResults(all, q, terms, FX), live: live.status === "fulfilled" ? live.value : null };
}

/** Matching, pricing and sorting into main results / similar / closest. Pure — the unit tests call it directly. */
export function rankResults(all, q, terms, fx) {
  const seen = new Set(), scored = [];
  for (const it of all) {
    if (!(it.price > 0 && it.url && it.title)) continue;
    const key = (it.url || "").split("?")[0] + "|" + it.currency; if (seen.has(key)) continue; seen.add(key);
    const r = relevance(terms, `${it.brand || ""} ${it.title}`);
    if (r > 0) scored.push({ ...priceItem(it, fx), rel: r });
  }
  const exact = scored.filter(x => x.rel === 1);
  const focus = brandFocus(exact.filter(x => !x.side && !secondary(x.title, q)), terms);
  // no brand field: the title must lead with the brand ("Creed Aventus…", "Men's Nike…") or credit it ("Sauvage by Christian Dior");
  // a brand word further along is something else ("Funko Pop … Gage Creed", "Dumont … (Creed Aventus Twist)")
  const LEAD = new Set("mens men womens women kids unisex the new sale".split(" "));
  const titleNames = t => {
    const w = withPhrases(norm(t)).split(" "); let i = 0;
    while (i < w.length - 1 && (LEAD.has(w[i]) || /^\d+$/.test(w[i]))) i++;
    return [...focus].some(c => { const sw = sigWords(c); if (!sw.length) return true;
      const at = k => sw.every((x, j) => w[k + j] === x);
      return at(i) || w.some((x, k) => x === "by" && at(k + 1)); });
  };
  const inFocus = x => !focus || (x.brand ? focus.has(brandCore(x.brand)) : titleNames(x.title));
  const main = x => !x.side && !secondary(x.title, q) && inFocus(x);
  const partial = terms.length > 1 ? scored.filter(x => x.rel < 1 && x.rel >= 0.5) : [];
  return {
    items: exact.filter(main),
    similar: [...exact.filter(x => !main(x)), ...partial],
    // nothing exact? the nearest matches (≥ 2/3 of the words) are better than an empty page
    close: partial.filter(x => x.rel >= 0.66 && !x.side && !secondary(x.title, q)).sort((a, b) => b.rel - a.rel)
  };
}

/** In-stock first, then by total price in Georgia (or by discount). */
export function sortItems(list, { sort = "landed", stock = true } = {}) {
  const k = { landed: (a, b) => (a.landed ?? 1e12) - (b.landed ?? 1e12), discount: (a, b) => b.disc - a.disc || (a.landed ?? 1e12) - (b.landed ?? 1e12) }[sort];
  return list.filter(x => !stock || x.in_stock).sort((a, b) => (b.in_stock - a.in_stock) || k(a, b));
}
export const pickBest = sorted => sorted.find(x => x.in_stock && x.landed != null) || sorted[0];
export const storeCount = list => new Set(list.map(x => x.store)).size;

/* ---------- rendering ---------- */
/** Some stores leave the brand out of the title ("Sneakers T500 Drift Red") — put it back in front. */
const BRAND_SUFFIX = /\b(running|sportswear|originals|performance|kids|men|women|official|inc|ltd|llc|spa|gmbh)\b/g;
const tidyBrand = b => { const t = String(b || "").trim(); return t === t.toUpperCase() && t.replace(/[^A-Za-z]/g, "").length > 4 ? t.toLowerCase().replace(/(^|[\s-])\p{L}/gu, m => m.toUpperCase()) : t; };
export const displayTitle = it => {
  if (!it.brand) return it.title;
  const core = norm(it.brand).replace(BRAND_SUFFIX, " ").replace(/\s+/g, " ").trim();
  return core && !norm(it.title).includes(core) ? `${tidyBrand(it.brand).replace(/\s+(Running|Sportswear|Originals|Performance)$/i, "")} ${it.title}` : it.title;
};
const buyBtn = it => `<a class="srch-btn" href="${esc(safeUrl(it.url))}" target="_blank" rel="noopener noreferrer sponsored">მაღაზიაში ნახვა ↗</a>`;
const saveBtn = (it, cls = "") => `<button type="button" class="srch-btn ghost${cls}" data-save-link="${esc(safeUrl(it.url))}" data-title="${esc(displayTitle(it))}" data-store="${esc(it.store)}" data-image="${esc(it.image || "")}" data-currency="${esc(it.currency)}" data-price="${esc(it.price)}">♡ შენახვა</button>`;
const img = it => it.image ? `<img src="${esc(safeUrl(it.image))}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg');this.remove()">` : "";

/** The "best price in Georgia" card. Savings are claimed only against the same product at other stores (call groupItems first). */
export function bestCardHTML(best, { label = "საუკეთესო ფასი საქართველოში" } = {}) {
  const byStore = new Map();
  for (const x of best.group ? best.group.items : []) if (x.store !== best.store && x.in_stock && x.landed != null) byStore.set(x.store, Math.min(byStore.get(x.store) ?? Infinity, x.landed));
  const dearer = [...byStore.values()].filter(v => v > best.landed);
  const save = dearer.length ? Math.max(...dearer) - best.landed : 0;
  return `<article class="srch-best">
    <div class="srch-best-img${best.image ? "" : " noimg"}">${img(best)}</div>
    <div class="srch-best-body">
      <p class="srch-eyebrow">${esc(label)}</p>
      <h3>${esc(displayTitle(best))}</h3>
      <p class="srch-meta">${flag(best.country)} <b>${esc(best.store)}</b> · ${esc(countryName(best.country))}${best.in_stock ? "" : " · არ არის მარაგში"}</p>
      <div class="srch-price"><b>≈ ${gelText(best.landed)}</b><span>საქართველოში მიტანით${best.taxable ? " და საბაჟოთი" : ""}</span></div>
      <p class="srch-sub">მაღაზიის ფასი ${money(best.price, best.currency)}${best.original_price ? ` <s>${money(best.original_price, best.currency)}</s> <em>−${best.disc}%</em>` : ""} · ≈ ${gelText(best.gel)}</p>
      ${save >= 1 ? `<p class="srch-save">იგივე პროდუქტი კიდევ ${dearer.length} მაღაზიაშია და იქ უფრო ძვირია — აქ დაზოგავ ≈ ${gelText(save)}-მდე</p>` : ""}
      <p class="srch-actions">${buyBtn(best)} ${saveBtn(best)}</p>
    </div></article>`;
}
/** Nothing matched every word: the nearest results, cheapest in Georgia first — never an empty page when something is close. */
export function closestHTML(close, q, limit = 8) {
  const list = sortItems(close).slice(0, limit);
  if (!list.length) return "";
  return `<h3 class="srch-h">„${esc(q)}“ ზუსტად ვერ ვიპოვეთ <small>— ყველაზე ახლოს მყოფი შედეგები, დალაგებული საქართველოში ჯამური ფასით</small></h3><ol class="srch-list">${list.map((x, i) => rowHTML(x, i)).join("")}</ol>`;
}
/** A warning when some stores did not answer (rate limits, outages), so an incomplete result is not taken as complete. */
export const liveNote = live => !live ? " მაღაზიების პირდაპირი ძიება ახლა მიუწვდომელია — ნაჩვენებია მხოლოდ ჩვენი კატალოგი, სცადე წუთში."
  : live.partial ? ` ${live.stores_searched - live.stores_answered} მაღაზიამ ახლა არ გვიპასუხა — შედეგი შეიძლება არასრული იყოს, სცადე წუთში.` : "";
export const listHeadHTML = () => `<div class="srch-head" aria-hidden="true"><span></span><span></span><span>პროდუქტი</span><span>მაღაზიაში</span><span>საქართველოში</span><span></span></div>`;
export function rowHTML(it, i) {
  return `<li class="srch-row${it.in_stock ? "" : " is-out"}">
    <span class="srch-rank">${i + 1}</span>
    <span class="srch-thumb${it.image ? "" : " noimg"}">${img(it)}</span>
    <span class="srch-info"><a href="${esc(safeUrl(it.url))}" target="_blank" rel="noopener noreferrer sponsored">${esc(displayTitle(it))}</a>
      <small>${flag(it.country)} ${esc(it.store)} · ${esc(countryName(it.country))}${it.in_stock ? "" : " · <b>არ არის მარაგში</b>"}</small></span>
    <span class="srch-p"><b>${money(it.price, it.currency)}</b>${it.disc ? ` <em>−${it.disc}%</em>` : ""}<small>≈ ${gelText(it.gel)}</small></span>
    <span class="srch-l"><b>${it.landed != null ? "≈ " + gelText(it.landed) : "—"}</b><small>საქართველოში</small></span>
    <span class="srch-act">${saveBtn(it, " sm")}</span></li>`;
}

/** Styles for everything rendered above. Self-contained (fallback colours), so pages without main.css can use it. */
export const SEARCH_CSS = `
.srch-best{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:32px;background:var(--paper,#f6f4ef);border:1px solid var(--ink,#181614);padding:26px;margin:8px 0 30px;text-align:left;color:var(--ink,#181614)}
.srch-best-img{background:#fff;display:flex;align-items:center;justify-content:center;aspect-ratio:1;overflow:hidden}
.srch-best-img img{width:100%;height:100%;object-fit:contain}
.srch-best-img.noimg::after,.srch-thumb.noimg::after{content:"SV";font-family:var(--serif,"Noto Serif Georgian",Georgia,serif);color:#c9c3b9;font-size:2rem}
.srch-eyebrow{margin:0 0 6px;color:var(--accent,#9f2529);font-size:11px;letter-spacing:2px}
.srch-best h3{font-family:var(--serif,"Noto Serif Georgian",Georgia,serif);font-weight:500;font-size:clamp(1.3rem,2.4vw,1.9rem);line-height:1.25;margin:0 0 8px}
.srch-meta{margin:0 0 16px;color:#3a3532}
.srch-price b{display:block;font-size:clamp(2rem,4.4vw,2.9rem);font-weight:600;line-height:1.05}
.srch-price span{color:var(--muted,#6f665d);font-size:13px}
.srch-sub{margin:12px 0 0}.srch-sub s{color:var(--muted,#6f665d)}
.srch-sub em,.srch-p em{color:var(--accent,#9f2529);font-style:normal;font-weight:600}
.srch-save{margin:10px 0 0;color:var(--good,#3f6b4a);font-weight:600}
.srch-actions{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 0}
.srch-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:11px 20px;background:var(--ink,#181614);color:#fff;border:1px solid var(--ink,#181614);font:inherit;font-size:12.5px;letter-spacing:.6px;text-decoration:none;cursor:pointer;transition:background .2s,color .2s}
.srch-btn:hover{background:var(--accent,#9f2529);border-color:var(--accent,#9f2529);color:#fff}
.srch-btn.ghost{background:transparent;color:var(--ink,#181614)}
.srch-btn.ghost:hover{background:var(--ink,#181614);border-color:var(--ink,#181614);color:#fff}
.srch-btn.sm{min-height:0;padding:6px 10px;font-size:12px}
.srch-btn:disabled{opacity:.6;cursor:default}
.srch-h{font-family:var(--serif,"Noto Serif Georgian",Georgia,serif);font-weight:500;font-size:1.4rem;margin:30px 0 10px;text-align:left}
.srch-h small{font-family:var(--sans,"Noto Sans Georgian",Arial,sans-serif);font-size:13px;color:var(--muted,#6f665d)}
.srch-list{list-style:none;margin:0;padding:0;text-align:left}
.srch-head,.srch-row{display:grid;grid-template-columns:26px 64px minmax(0,1fr) 130px 130px 110px;gap:14px;align-items:center}
.srch-head{font-size:11.5px;color:var(--muted,#6f665d);letter-spacing:.5px;padding:0 0 6px;border-bottom:1px solid var(--ink,#181614)}
.srch-head span:nth-child(4),.srch-head span:nth-child(5){text-align:right}
.srch-row{padding:12px 0;border-bottom:1px solid var(--line-soft,#d6cfc4)}
.srch-row.is-out{opacity:.55}
.srch-rank{color:var(--muted,#6f665d);font-size:12px;text-align:center}
.srch-thumb{width:64px;height:64px;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}
.srch-thumb img{width:100%;height:100%;object-fit:contain}
.srch-thumb.noimg::after{font-size:1rem}
.srch-info{min-width:0}
.srch-info a{color:var(--ink,#181614);text-decoration:none;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.srch-info a:hover{color:var(--accent,#9f2529)}
.srch-info small,.srch-p small,.srch-l small{display:block;color:var(--muted,#6f665d);font-size:12px}
.srch-p,.srch-l{text-align:right}.srch-l b{font-size:1.05rem}
.srch-link{color:inherit;border-bottom:1px solid currentColor;text-decoration:none}
.srch-models{margin:4px 0 18px;text-align:left}.srch-models p{margin:0 0 8px;font-weight:600}.srch-models small{font-weight:400;color:var(--muted,#6f665d)}
.srch-mchip{display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:7px 13px;margin:0 6px 6px 0;border:1px solid #c9c3b9;background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer}
.srch-mchip:hover{border-color:var(--ink,#181614);background:var(--ink,#181614);color:#fff}.srch-hint{display:block;margin-top:4px;color:var(--muted,#6f665d);font-size:12.5px}.srch-mchip b{font-weight:500;color:var(--muted,#6f665d)}.srch-mchip:hover b{color:#ddd}
.spin{display:inline-block;vertical-align:middle;width:18px;height:18px;border:2px solid #c9c3b9;border-top-color:var(--accent,#9f2529);border-radius:50%;animation:srchspin .8s linear infinite}
@keyframes srchspin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.spin{animation:none}}
@media (max-width:820px){
  .srch-best{grid-template-columns:1fr;padding:18px;gap:18px}
  .srch-best-img{aspect-ratio:auto;height:240px}
  .srch-head{display:none}
  .srch-row{grid-template-columns:56px minmax(0,1fr) auto;grid-template-areas:"t i l" "t p a";gap:4px 12px}
  .srch-rank{display:none}.srch-thumb{grid-area:t;width:56px;height:56px}.srch-info{grid-area:i}
  .srch-p{grid-area:p;text-align:left}.srch-l{grid-area:l}.srch-act{grid-area:a;text-align:right}
}`;
