import { mountChrome, offerCard, dealCard, bindCardActions, skeleton, emptyState, errorState, $, $$ } from "../ui.js";
import { loadAll, offerHaystack, dealHaystack } from "../data.js";
import { esc, catLabel, countryName } from "../format.js";
import * as wl from "../wishlist.js";

mountChrome("deals");
const PAGE = 12;
const params = new URLSearchParams(location.search);
const S = {
  q: params.get("q") || "", type: params.get("type") || "all", cat: params.get("cat") || "", store: params.get("store") || "",
  country: params.get("country") || "", brand: params.get("brand") || "", min: params.get("min") || "", max: params.get("max") || "",
  disc: params.get("disc") || "0", score: params.get("score") || "0", sort: params.get("sort") || "score", tag: params.get("tag") || "",
  onlyDisc: params.get("od") === "1", saved: params.get("saved") === "1", limitP: PAGE, limitD: PAGE
};
let data;
bindCardActions(id => data?.byProduct.get(String(id)), id => data?.dealById.get(String(id)));
$("#results").innerHTML = `<div class="grid">${skeleton(6)}</div>`;
if (matchMedia("(max-width: 900px)").matches) $("#filters").open = false;

try { data = await loadAll(); init(); } catch (e) { console.error(e); $("#results").innerHTML = errorState(); }

function init() {
  const { deals, enriched } = data;
  const uniq = arr => [...new Set(arr.filter(Boolean))];
  const cats = uniq([...(deals || []).map(d => String(d.category || "").toLowerCase()), ...enriched.map(e => String(e.product.category || "").toLowerCase())]).sort((a, b) => catLabel(a).localeCompare(catLabel(b), "ka"));
  const stores = uniq([...(deals || []).map(d => d.store), ...enriched.map(e => e.store.name)]).sort((a, b) => a.localeCompare(b));
  const countries = uniq([...(deals || []).map(d => String(d.country || "").toUpperCase()), ...enriched.map(e => String(e.store.country || "").toUpperCase())]).sort((a, b) => countryName(a).localeCompare(countryName(b), "ka"));
  const brands = uniq(enriched.map(e => e.product.brand)).sort((a, b) => a.localeCompare(b));
  const opt = (v, l) => `<option value="${esc(v)}">${esc(l)}</option>`;
  $("#f-cat").innerHTML += cats.map(c => opt(c, catLabel(c))).join("");
  $("#f-store").innerHTML += stores.map(s => opt(s, s)).join("");
  $("#f-country").innerHTML += countries.map(c => opt(c, countryName(c))).join("");
  $("#f-brand").innerHTML += brands.map(b => opt(b, b)).join("");
  if (!brands.length) $("#f-brand").closest(".fgroup").hidden = true;

  // state → controls
  $("#q").value = S.q;
  [["#f-cat", "cat"], ["#f-store", "store"], ["#f-country", "country"], ["#f-brand", "brand"], ["#f-min", "min"], ["#f-max", "max"], ["#f-disc", "disc"], ["#f-score", "score"], ["#sort", "sort"]].forEach(([sel, k]) => { $(sel).value = S[k]; });
  $("#f-only-disc").checked = S.onlyDisc; $("#f-saved").checked = S.saved;

  const bind = (sel, k, ev = "change", conv = x => x) => $(sel).addEventListener(ev, e => { S[k] = conv(e.target.type === "checkbox" ? e.target.checked : e.target.value); S.limitP = S.limitD = PAGE; update(); });
  bind("#f-cat", "cat"); bind("#f-store", "store"); bind("#f-country", "country"); bind("#f-brand", "brand");
  bind("#f-min", "min", "input"); bind("#f-max", "max", "input"); bind("#f-disc", "disc"); bind("#f-score", "score"); bind("#sort", "sort");
  bind("#f-only-disc", "onlyDisc"); bind("#f-saved", "saved");
  $("#q-form").addEventListener("submit", e => { e.preventDefault(); S.q = $("#q").value.trim(); S.limitP = S.limitD = PAGE; update(); });
  $("#q").addEventListener("input", debounce(() => { S.q = $("#q").value.trim(); S.limitP = S.limitD = PAGE; update(); }, 250));
  $$(".seg [data-type]").forEach(b => b.addEventListener("click", () => { S.type = b.dataset.type; update(); }));
  $("#f-reset").addEventListener("click", () => { Object.assign(S, { q: "", cat: "", store: "", country: "", brand: "", min: "", max: "", disc: "0", score: "0", tag: "", onlyDisc: false, saved: false }); init.sync(); update(); });
  init.sync = () => { $("#q").value = S.q; [["#f-cat", "cat"], ["#f-store", "store"], ["#f-country", "country"], ["#f-brand", "brand"], ["#f-min", "min"], ["#f-max", "max"], ["#f-disc", "disc"], ["#f-score", "score"]].forEach(([sel, k]) => { $(sel).value = S[k]; }); $("#f-only-disc").checked = S.onlyDisc; $("#f-saved").checked = S.saved; };
  $("#chips").addEventListener("click", e => { const b = e.target.closest("[data-clear]"); if (!b) return; const k = b.dataset.clear; S[k] = k === "disc" || k === "score" ? "0" : typeof S[k] === "boolean" ? false : ""; init.sync(); update(); });
  $("#results").addEventListener("click", e => {
    if (e.target.id === "more-p") { S.limitP += PAGE; render(); }
    if (e.target.id === "more-d") { S.limitD += PAGE; render(); }
  });
  window.addEventListener("sv:wishlist", () => { if (S.saved) render(); });
  update();
}

function terms(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }
function matchQ(hay, q) { return terms(q).every(t => hay.includes(t)); }

function filterOffers() {
  const st = wl.load();
  return data.enriched.filter(e => {
    const o = e.offer, p = e.product;
    if (S.q && !matchQ(offerHaystack(e), S.q)) return false;
    if (S.cat && String(p.category || "").toLowerCase() !== S.cat) return false;
    if (S.store && e.store.name !== S.store) return false;
    if (S.country && String(e.store.country || "").toUpperCase() !== S.country) return false;
    if (S.brand && p.brand !== S.brand) return false;
    if (S.min && Number(o.current_price) < Number(S.min)) return false;
    if (S.max && Number(o.current_price) > Number(S.max)) return false;
    if (Number(S.disc) && e.scored.discount < Number(S.disc)) return false;
    if (S.onlyDisc && !e.scored.hasOriginal) return false;
    if (Number(S.score) && !(e.scored.score >= Number(S.score))) return false;
    if (S.saved && !st.items[`offer:${o.product_id}`]) return false;
    if (S.tag) return false; // tags exist only on store promotions
    return true;
  }).sort(offerSorter(S.sort));
}
function offerSorter(k) {
  const n = v => (v === null || v === undefined ? -Infinity : v);
  return {
    score: (a, b) => n(b.scored.score) - n(a.scored.score) || b.scored.discount - a.scored.discount,
    discount: (a, b) => b.scored.discount - a.scored.discount || n(b.scored.score) - n(a.scored.score),
    price: (a, b) => (a.landed.goodsGel ?? Infinity) - (b.landed.goodsGel ?? Infinity),
    landed: (a, b) => (a.landed.total ?? Infinity) - (b.landed.total ?? Infinity),
    new: (a, b) => new Date(b.offer.first_seen_at) - new Date(a.offer.first_seen_at)
  }[k] || (() => 0);
}
function filterDeals() {
  const st = wl.load();
  return (data.deals || []).filter(d => {
    if (S.q && !matchQ(dealHaystack(d), S.q)) return false;
    if (S.cat && String(d.category || "").toLowerCase() !== S.cat) return false;
    if (S.store && d.store !== S.store) return false;
    if (S.country && String(d.country || "").toUpperCase() !== S.country) return false;
    if (S.brand) return false; // promotions have no brand data
    if (Number(S.disc) && !(Number(d.discount_percent) >= Number(S.disc))) return false;
    if (S.tag && !(d.tags || []).includes(S.tag)) return false;
    if (S.saved && !st.items[`deal:${d.id}`]) return false;
    return true;
  }).sort({
    score: (a, b) => (b.deal_score || 0) - (a.deal_score || 0),
    discount: (a, b) => (b.discount_percent || 0) - (a.discount_percent || 0),
    new: (a, b) => new Date(b.created_at) - new Date(a.created_at)
  }[S.sort] || ((a, b) => (b.deal_score || 0) - (a.deal_score || 0)));
}

function update() { syncUrl(); render(); }

function render() {
  $$(".seg [data-type]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.type === S.type)));
  $$("[data-only=products]").forEach(g => (g.style.opacity = S.type === "deals" ? ".45" : ""));
  const showP = S.type !== "deals", showD = S.type !== "products";
  const P = showP ? filterOffers() : [], D = showD ? filterDeals() : [];
  const priceSort = S.sort === "price" || S.sort === "landed";

  let html = "";
  if (showP) {
    html += `<div class="subhead"><h2>პროდუქტები</h2><p>${P.length} პროდუქტი · ფასი, ისტორია, ქულა</p></div>`;
    html += P.length ? `<div class="grid">${P.slice(0, S.limitP).map(offerCard).join("")}</div>${P.length > S.limitP ? `<div class="more"><button class="btn btn-ghost" id="more-p" type="button">მეტის ნახვა (+${P.length - S.limitP})</button></div>` : ""}`
      : data.offersRaw === null ? errorState("პროდუქტები ვერ ჩაიტვირთა.") : emptyState(S.tag ? "ეს ფილტრი მხოლოდ მაღაზიის აქციებს ეხება." : "ამ პირობებით პროდუქტი ვერ მოიძებნა.");
  }
  if (showD) {
    html += `<div class="subhead"><h2>მაღაზიის აქციები</h2><p>${D.length} აქცია${priceSort ? " · ფასით დალაგება აქციებზე არ ვრცელდება" : ""}</p></div>`;
    html += D.length ? `<div class="grid deals">${D.slice(0, S.limitD).map(dealCard).join("")}</div>${D.length > S.limitD ? `<div class="more"><button class="btn btn-ghost" id="more-d" type="button">მეტის ნახვა (+${D.length - S.limitD})</button></div>` : ""}`
      : data.deals === null ? errorState("აქციები ვერ ჩაიტვირთა.") : emptyState(S.brand ? "აქციებს ბრენდის მონაცემი არ აქვს — ბრენდით ძიება მხოლოდ პროდუქტებზე მუშაობს." : "ამ პირობებით აქცია ვერ მოიძებნა.");
  }
  $("#results").innerHTML = html;
  $("#live").textContent = `${P.length} პროდუქტი, ${D.length} აქცია`;

  const labels = { q: `„${S.q}“`, cat: catLabel(S.cat), store: S.store, country: countryName(S.country), brand: S.brand, min: `≥ ${S.min}`, max: `≤ ${S.max}`, disc: `${S.disc}%+`, score: `ქულა ${S.score}+`, tag: S.tag, onlyDisc: "ფასდაკლებით", saved: "რჩეულები" };
  const active = Object.keys(labels).filter(k => S[k] && S[k] !== "0");
  $("#chips").innerHTML = active.map(k => `<button type="button" data-clear="${k}" aria-label="ფილტრის მოხსნა: ${esc(labels[k])}">${esc(labels[k])} ×</button>`).join("");
  $("#f-count").textContent = active.length ? `(${active.length})` : "";
}

function syncUrl() {
  const p = new URLSearchParams();
  const def = { type: "all", disc: "0", score: "0", sort: "score" };
  ["q", "type", "cat", "store", "country", "brand", "min", "max", "disc", "score", "sort", "tag"].forEach(k => { if (S[k] && S[k] !== def[k]) p.set(k, S[k]); });
  if (S.onlyDisc) p.set("od", "1"); if (S.saved) p.set("saved", "1");
  history.replaceState(null, "", `${location.pathname}${p.toString() ? "?" + p : ""}`);
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
