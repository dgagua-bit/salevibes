/**
 * Product search: one query → every place we can see a price for it.
 * Sources: live store search (Edge Function live-search), our crawled catalogue,
 * cross-country brand prices (compare_items). Every result is priced the same way —
 * "≈ in Georgia" = goods + shipping + customs (estimate, see pricing.js) — and the
 * cheapest in-stock exact match is shown first.
 */
import { mountChrome, $, emptyState, dealCard, bindCardActions } from "../ui.js";
import { esc, safeUrl, money, gelText, flag, countryName, hostOf, catLabel } from "../format.js";
import { getFx, getOffers, getStores, getDeals, searchCompare } from "../api.js";
import { landedCost, toGel } from "../pricing.js";
import { SUPABASE_URL, SUPABASE_KEY, CATEGORIES } from "../config.js";

mountChrome("search");
const params = new URLSearchParams(location.search);
const S = { q: (params.get("q") || "").trim(), sort: "landed", stock: true, items: [], similar: [], fx: {}, live: null, group: null, deals: [], cats: [], browse: false };
const dealById = new Map();
bindCardActions(null, id => dealById.get(String(id)));

/* ---------- text matching ---------- */
const KA = { ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i", კ: "k", ლ: "l", მ: "m", ნ: "n", ო: "o", პ: "p", ჟ: "zh", რ: "r", ს: "s", ტ: "t", უ: "u", ფ: "p", ქ: "k", ღ: "gh", ყ: "k", შ: "sh", ჩ: "ch", ც: "ts", ძ: "dz", წ: "ts", ჭ: "ch", ხ: "kh", ჯ: "j", ჰ: "h" };
// Georgian words people type → what store titles say
const SYN = { "ფეხსაცმელი": "shoe", "სნიკერი": "sneaker", "სნიკერები": "sneaker", "სუნამო": "parfum", "ჩანთა": "bag", "საათი": "watch", "სათვალე": "sunglasses", "კაბა": "dress", "ქურთუკი": "jacket", "მაისური": "shirt", "ჯინსი": "jeans", "ქალის": "women", "კაცის": "men", "ბავშვის": "kids", "კრემი": "cream" };
const BRAND_KA = { "ნაიკი": "nike", "ადიდასი": "adidas", "პუმა": "puma", "გუჩი": "gucci", "პრადა": "prada", "დიორი": "dior", "შანელი": "chanel", "ზარა": "zara", "მანგო": "mango", "ლევისი": "levis", "ნიუ ბალანსი": "new balance", "ბალენსიაგა": "balenciaga", "ვერსაჩე": "versace", "არმანი": "armani", "კელვინ კლაინი": "calvin klein", "ტომი": "tommy", "ლაკოსტი": "lacoste", "სპიდო": "speedo" };
const norm = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/['’`]/g, "").replace(/[^a-z0-9ა-ჿ]+/g, " ").trim();
function queryTerms(q) {
  let s = norm(q);
  for (const [k, v] of Object.entries(BRAND_KA)) s = s.replace(k, v);
  return s.split(" ").filter(Boolean).map(t => SYN[t] || (/[ა-ჿ]/.test(t) ? [...t].map(c => KA[c] || c).join("") : t));
}
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } }
  return d[b.length];
}
/** share of query terms found in the item text (exact, prefix, or 1–2 typos for longer words) */
const ABBR = [[/eau de parfum/, " edp"], [/eau de toilette/, " edt"], [/eau de cologne/, " edc"], [/\bnew balance\b/, " nb"]];
function relevance(terms, text) {
  let hay = norm(text); for (const [re, a] of ABBR) if (re.test(hay)) hay += a;
  const words = hay.split(" "), joined = hay.replace(/ /g, "");
  let hit = 0;
  for (const t of terms) {
    if (hay.includes(t) || joined.includes(t)) { hit++; continue; }
    if (t.length >= 5 && !/\d/.test(t) && words.some(w => w.length >= 4 && lev(t, w) <= (t.length >= 8 ? 2 : 1))) hit++; // typos only in longer words — "zara" must not match "yara"
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
function productKey(title) {
  let s = " " + norm(String(title).replace(SIZE_RE, " ").replace(CODE_RE, " ")) + " ";
  for (const [re, v] of PHRASES) s = s.replace(re, v);
  const words = s.split(" ").filter(w => w.length > 1 && !STOP.has(w) && !COLORS.has(w));
  return [...new Set([...words, ...sizes(title)])].sort().join(" ");
}
// kids' versions and side products (Sauvage deodorant, Samba laces) are not what people mean by the product name
const KIDS = /\b(kids?|junior|jr|baby|babies|infants?|toddlers?|child|children|boys|girls|youth|gs|ps|td)\b/;
const SIDE = /\b(deodorant|deo|shower gel|body lotion|lotion|aftershave|after shave|socks?|laces?|insoles?|cleaner|samples?|miniature|keyrings?|keychains?)\b/;
const secondary = (title, q) => { const t = norm(title), qq = norm(q); return (KIDS.test(t) && !KIDS.test(qq)) || (SIDE.test(t) && !SIDE.test(qq)); };

function groupItems(list) {
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
async function liveSearch(q) {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/live-search`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ q }), signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error("live " + r.status);
  return r.json();
}
function fromOffers(rows) {
  return (rows || []).map(o => { const p = o.products || {}, s = p.stores || {};
    return { src: "catalogue", store: s.name, country: s.country, currency: o.currency || s.currency, title: p.title, brand: p.brand, price: Number(o.current_price), original_price: Number(o.original_price) > Number(o.current_price) ? Number(o.original_price) : null, url: p.product_url, image: p.image_url, in_stock: o.in_stock !== false, category: p.category, detail: `product.html?id=${encodeURIComponent(o.product_id)}` }; });
}
function fromCompare(rows) {
  return (rows || []).flatMap(c => (c.compare_prices || []).map(p => ({ src: "compare", store: `${c.brand} ${p.country}`, country: p.country, currency: p.currency, title: c.title_en || c.title, brand: c.brand, price: Number(p.price), original_price: Number(p.original_price) > Number(p.price) ? Number(p.original_price) : null, url: p.url, image: c.image_url, in_stock: p.in_stock !== false, category: c.category, kg: c.weight_g ? c.weight_g / 1000 : null })));
}

function price(it) {
  const l = landedCost({ price: it.price, currency: it.currency, fx: S.fx, kg: it.kg || undefined, category: it.category || guessCat(it.title) });
  return { ...it, gel: toGel(it.price, it.currency, S.fx), landed: l.total, taxable: !!(l.customs && l.customs.taxable), disc: it.original_price ? Math.round((1 - it.price / it.original_price) * 100) : 0 };
}

/* ---------- render ---------- */
const buyBtn = it => `<a class="btn btn-dark" href="${esc(safeUrl(it.url))}" target="_blank" rel="noopener noreferrer sponsored">მაღაზიაში ნახვა ↗</a>`;
const saveBtn = it => `<button type="button" class="btn btn-ghost" data-save-link="${esc(safeUrl(it.url))}" data-title="${esc(it.title)}" data-store="${esc(it.store)}" data-image="${esc(it.image || "")}" data-currency="${esc(it.currency)}" data-price="${esc(it.price)}">♡ შენახვა</button>`;
const img = it => it.image ? `<img src="${esc(safeUrl(it.image))}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg');this.remove()">` : "";

function bestCard(best) {
  const byStore = new Map();
  for (const x of best.group ? best.group.items : []) if (x.store !== best.store && x.in_stock && x.landed != null) byStore.set(x.store, Math.min(byStore.get(x.store) ?? Infinity, x.landed));
  const dearer = [...byStore.values()].filter(v => v > best.landed);
  const save = dearer.length ? Math.max(...dearer) - best.landed : 0;
  return `<article class="srch-best">
    <div class="srch-best-img${best.image ? "" : " noimg"}">${img(best)}</div>
    <div class="srch-best-body">
      <p class="eyebrow">საუკეთესო ფასი საქართველოში</p>
      <h2>${esc(best.title)}</h2>
      <p class="srch-meta">${flag(best.country)} <b>${esc(best.store)}</b> · ${esc(countryName(best.country))}${best.in_stock ? "" : " · არ არის მარაგში"}</p>
      <div class="srch-price"><b>≈ ${gelText(best.landed)}</b><span>საქართველოში მიტანით${best.taxable ? " და საბაჟოთი" : ""}</span></div>
      <p class="srch-sub">მაღაზიის ფასი ${money(best.price, best.currency)}${best.original_price ? ` <s>${money(best.original_price, best.currency)}</s> <em>−${best.disc}%</em>` : ""} · ≈ ${gelText(best.gel)}</p>
      ${save >= 1 ? `<p class="srch-save">იგივე პროდუქტი კიდევ ${dearer.length} მაღაზიაშია და იქ უფრო ძვირია — აქ დაზოგავ ≈ ${gelText(save)}-მდე</p>` : ""}
      <p class="srch-actions">${buyBtn(best)} ${saveBtn(best)}</p>
    </div></article>`;
}
function row(it, i) {
  return `<li class="srch-row${it.in_stock ? "" : " is-out"}">
    <span class="srch-rank">${i + 1}</span>
    <span class="srch-thumb${it.image ? "" : " noimg"}">${img(it)}</span>
    <span class="srch-info"><a href="${esc(safeUrl(it.url))}" target="_blank" rel="noopener noreferrer sponsored">${esc(it.title)}</a>
      <small>${flag(it.country)} ${esc(it.store)} · ${esc(countryName(it.country))}${it.in_stock ? "" : " · <b>არ არის მარაგში</b>"}</small></span>
    <span class="srch-p"><b>${money(it.price, it.currency)}</b>${it.disc ? ` <em>−${it.disc}%</em>` : ""}<small>≈ ${gelText(it.gel)}</small></span>
    <span class="srch-l"><b>${it.landed != null ? "≈ " + gelText(it.landed) : "—"}</b><small>საქართველოში</small></span>
    <span class="srch-act">${saveBtn(it)}</span></li>`;
}
/* store promotions and categories that match the query (e.g. "Zara", "ფეხსაცმელი") */
function matchDeals(deals, terms) {
  const qWords = norm(S.q).split(" ").filter(Boolean);
  return (deals || []).filter(d => {
    const hay = norm(`${d.store} ${d.title} ${d.description || ""} ${catLabel(d.category)} ${countryName(d.country)}`);
    if (qWords.every(w => hay.includes(w))) return true;
    const storeWords = norm(d.store).split(" ");
    return terms.some(t => t.length >= 3 && storeWords.includes(t));
  }).sort((a, b) => (b.deal_score || 0) - (a.deal_score || 0));
}
function matchCats() {
  const qn = norm(S.q); if (qn.length < 3) return [];
  return Object.entries(CATEGORIES).filter(([, label]) => { const l = norm(label); return l.includes(qn) || qn.includes(l); }).map(([k, label]) => ({ k, label }));
}
function dealsBlock(primary) {
  if (!S.deals.length) return "";
  const list = S.deals.slice(0, primary ? 9 : 3);
  return `<section class="srch-deals"><h2 class="srch-h">${primary ? "აქციები ამ ძიებაზე" : "ამ ბრენდის მაღაზიების აქციები"} <small>— ფასდაკლება მთელ მაღაზიაში ან კოლექციაზე</small></h2>
    <div class="grid deals">${list.map(dealCard).join("")}</div>
    ${S.deals.length > list.length ? `<p class="more"><a class="btn btn-ghost" href="deals.html?q=${encodeURIComponent(S.q)}">ყველა აქცია (${S.deals.length}) →</a></p>` : ""}</section>`;
}
const catBlock = () => S.cats.length ? `<p class="srch-cats">${S.cats.map(c => `<a class="chip" href="deals.html?cat=${esc(c.k)}">კატეგორია: <b>${esc(c.label)}</b> — ყველა აქცია და პროდუქტი →</a>`).join("")}</p>` : "";

function sorted(list) {
  const k = { landed: (a, b) => (a.landed ?? 1e12) - (b.landed ?? 1e12), discount: (a, b) => b.disc - a.disc || (a.landed ?? 1e12) - (b.landed ?? 1e12) }[S.sort];
  return list.filter(x => !S.stock || x.in_stock).sort((a, b) => (b.in_stock - a.in_stock) || k(a, b));
}

function render() {
  const out = $("#s-out"), list = sorted(S.items);
  const stores = new Set(S.items.map(x => x.store));
  $("#s-count").textContent = [S.items.length ? `${S.items.length} პროდუქტი · ${stores.size} მაღაზია` : "", S.deals.length ? `${S.deals.length} აქცია` : ""].filter(Boolean).join(" · ");
  if (!list.length) {
    out.innerHTML = catBlock()
      + (S.deals.length ? dealsBlock(true) : emptyState(S.items.length ? "მარაგში ვერ ვიპოვეთ — მოხსენი „მხოლოდ მარაგში“." : `„${esc(S.q)}“ ჩვენს მაღაზიებში ვერ ვიპოვეთ. სცადე უფრო მოკლედ (მაგ. მხოლოდ ბრენდი და მოდელი) ან ინგლისურად.`))
      + (S.similar.length ? `<h2 class="srch-h">შეიძლება ეძებდი</h2><ol class="srch-list">${sorted(S.similar).slice(0, 12).map(row).join("")}</ol>` : "");
    $("#s-elsewhere").hidden = false;
    return;
  }
  if (S.browse) {
    out.innerHTML = catBlock() + dealsBlock(true)
      + `<h2 class="srch-h">პროდუქტები <small>— დალაგებულია ${S.sort === "landed" ? "საქართველოში ჯამური ფასით" : "ფასდაკლებით"}</small></h2><ol class="srch-list">${list.slice(0, 40).map((x, i) => row(x, i)).join("")}</ol>`;
    $("#s-elsewhere").hidden = false;
    return;
  }
  const groups = groupItems(list);
  const sel = S.group != null ? groups.find(g => g.key === S.group) : null;
  const shown = sel ? sel.items : list;
  const pool = sorted(shown);
  const best = pool.find(x => x.in_stock && x.landed != null) || pool[0];
  const rest = pool.filter(x => x !== best);
  const multi = groups.filter(g => g.items.length > 1).slice(0, 8);
  const chips = multi.length && groups.length > 1 ? `<div class="srch-variants"><p>ზუსტად რომელი? <small>აირჩიე — შევადარებთ მხოლოდ ამ პროდუქტის ფასებს</small></p><div class="chips">
      <button type="button" class="chip" data-g="" aria-pressed="${S.group == null}">ყველა (${list.length})</button>
      ${multi.map(g => `<button type="button" class="chip" data-g="${esc(g.key)}" aria-pressed="${S.group === g.key}">${esc(g.label.length > 44 ? g.label.slice(0, 42) + "…" : g.label)} <b>${g.stores > 1 ? g.stores + " მაღაზია" : g.items.length}</b></button>`).join("")}</div></div>` : "";
  out.innerHTML = catBlock() + chips + bestCard(best)
    + (rest.length ? `<h2 class="srch-h">ალტერნატივები <small>— დალაგებულია ${S.sort === "landed" ? "საქართველოში ჯამური ფასით" : "ფასდაკლებით"}</small></h2>
      <div class="srch-head" aria-hidden="true"><span></span><span></span><span>პროდუქტი</span><span>მაღაზიაში</span><span>საქართველოში</span><span></span></div>
      <ol class="srch-list">${rest.slice(0, 60).map((x, i) => row(x, i + 1)).join("")}</ol>` : "")
    + (S.similar.length ? `<details class="srch-more"><summary>მსგავსი პროდუქტები — საბავშვო, აქსესუარები და ნაწილობრივი დამთხვევები (${S.similar.length})</summary><ol class="srch-list">${sorted(S.similar).slice(0, 30).map(row).join("")}</ol></details>` : "")
    + dealsBlock(false);
  $("#s-elsewhere").hidden = false;
}

function elsewhere(stores) {
  const q = S.q;
  const g = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q)}`;
  const big = (stores || []).filter(s => s.platform !== "shopify").slice(0, 400);
  const terms = queryTerms(q);
  const brandHit = big.filter(s => (s.brands || []).some(b => terms.some(t => t.length > 2 && norm(b).includes(t))));
  const pick = [...brandHit, ...big.filter(s => !brandHit.includes(s) && /fashion|shoes|beauty|luxury/.test(s.category || ""))].slice(0, 10);
  $("#s-elsewhere").innerHTML = `<h2 class="srch-h">სხვა მაღაზიებშიც შეამოწმე</h2>
    <p class="fine">ამ მაღაზიების საიტები ავტომატურ ძიებას არ გვაძლევს, ამიტომ მათ ფასებს აქ ვერ ვაჩვენებთ. დააჭირე — Google-ში ამ მაღაზიის საიტზე მოიძებნება.</p>
    <div class="chips">${pick.map(s => `<a class="chip" href="https://www.google.com/search?q=${encodeURIComponent(q + " site:" + hostOf(s.base_url))}" target="_blank" rel="noopener noreferrer">${flag(s.country)} ${esc(s.name)} ↗</a>`).join("")}
    <a class="chip" href="${g}" target="_blank" rel="noopener noreferrer">Google Shopping ↗</a></div>`;
}

async function run() {
  $("#s-q").value = S.q;
  if (!S.q) { $("#s-out").innerHTML = emptyState("ჩაწერე პროდუქტის სახელი, მაგ. „Adidas Samba“ ან „Dior Sauvage 100ml“."); return; }
  document.title = `${S.q} — ძიება — SaleVibes`;
  $("#s-out").innerHTML = `<div class="srch-loading"><span class="spin" aria-hidden="true"></span> ვეძებთ „${esc(S.q)}“ მაღაზიებში… (რამდენიმე წამი)</div>`;
  const terms = queryTerms(S.q);
  const [fx, live, offers, cmp, stores, deals] = await Promise.allSettled([getFx(), liveSearch(terms.join(" ")), getOffers(), searchCompare(terms.join(" ")), getStores(), getDeals()]);
  const allDeals = deals.status === "fulfilled" ? deals.value || [] : [];
  allDeals.forEach(d => dealById.set(String(d.id), d));
  S.deals = matchDeals(allDeals, terms); S.cats = matchCats();
  const synWords = new Set(Object.values(SYN));
  S.browse = S.cats.length > 0 && terms.every(t => synWords.has(t) || S.cats.some(c => norm(c.label).includes(t)));
  S.fx = fx.status === "fulfilled" ? fx.value.fx : {};
  const all = [
    ...(live.status === "fulfilled" ? live.value.items || [] : []).map(x => ({ ...x, src: "live" })),
    ...fromOffers(offers.status === "fulfilled" ? offers.value : []),
    ...fromCompare(cmp.status === "fulfilled" ? cmp.value : [])
  ].filter(x => x.price > 0 && x.url && x.title);
  const seen = new Set(), scored = [];
  for (const it of all) {
    const key = (it.url || "").split("?")[0] + "|" + it.currency; if (seen.has(key)) continue; seen.add(key);
    const r = relevance(terms, `${it.brand || ""} ${it.title}`);
    if (r > 0) scored.push({ ...price(it), rel: r });
  }
  S.items = scored.filter(x => x.rel === 1 && !secondary(x.title, S.q));
  S.similar = scored.filter(x => (x.rel === 1 && secondary(x.title, S.q)) || (terms.length > 1 && x.rel < 1 && x.rel >= 0.5));
  S.live = live.status === "fulfilled" ? live.value : null;
  $("#s-src").textContent = S.live ? `ძიება ${S.live.stores_answered} მაღაზიის საიტზე ახლავე + ჩვენი კატალოგი. ფასები: ${new Date(S.live.at).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}.` : "მაღაზიების პირდაპირი ძიება ახლა მიუწვდომელია — ნაჩვენებია მხოლოდ ჩვენი კატალოგი.";
  elsewhere(stores.status === "fulfilled" ? stores.value : []);
  render();
}

$("#s-form").addEventListener("submit", e => {
  e.preventDefault(); const q = $("#s-q").value.trim(); if (!q) return;
  S.q = q; S.group = null; history.replaceState(null, "", `?q=${encodeURIComponent(q)}`); run();
});
$("#s-out").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (!b) return; S.group = b.dataset.g || null; render(); $("#s-out").scrollIntoView({ block: "start", behavior: "smooth" }); });
$("#s-sort").addEventListener("change", e => { S.sort = e.target.value; render(); });
$("#s-stock").addEventListener("change", e => { S.stock = e.target.checked; render(); });
run();
