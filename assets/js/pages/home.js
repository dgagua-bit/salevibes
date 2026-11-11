import { mountChrome, offerCard, dealCard, bindCardActions, skeleton, emptyState, errorState, storeMark, $ } from "../ui.js";
import { loadAll, dealsForStore, brandIndex } from "../data.js";
import { WORLDS, FEATURED_BRANDS, SEASONAL } from "../config.js";
import { esc, countryName, flag } from "../format.js";

mountChrome("home");
$("#best").innerHTML = skeleton(4);
$("#deals").innerHTML = skeleton(3);
$("#cats").innerHTML = skeleton(5, "tile");

let data;
bindCardActions(id => data?.byProduct.get(String(id)), id => data?.dealById.get(String(id)));

try {
  data = await loadAll();
  render();
} catch (e) {
  console.error(e);
  $("#best").innerHTML = errorState();
}

function render() {
  const { deals, stores, enriched } = data;
  $("#stat-offers").textContent = enriched.length || "—";
  $("#stat-deals").textContent = deals ? deals.length : "—";
  $("#stat-stores").textContent = stores ? stores.length : "—";

  // Best today: only real, discounted product offers with a computable score
  const best = enriched
    .filter(e => e.scored.hasOriginal && e.scored.score !== null && e.status === "ACTIVE")
    .sort((a, b) => b.scored.score - a.scored.score || b.scored.discount - a.scored.discount)
    .slice(0, 4);
  $("#best").innerHTML = best.length ? best.map(offerCard).join("")
    : data.offersRaw === null ? errorState("პროდუქტების ჩატვირთვა ვერ მოხერხდა.")
    : emptyState("დღეს გადამოწმებული ფასდაკლების მქონე პროდუქტი ვერ ვიპოვეთ. ნახე მაღაზიების აქციები ქვემოთ.");

  // Categories with real counts
  $("#cats").innerHTML = WORLDS.map(w => {
    const nDeals = (deals || []).filter(d => String(d.category || "").toLowerCase() === w.key).length;
    const nStores = (stores || []).filter(s => (s.worlds || []).includes(w.key)).length;
    return `<a class="tile" href="deals.html?cat=${w.key}"><b>${esc(w.title)}</b><small>${esc(w.sub)}</small><span class="count">${nDeals ? `${nDeals} აქცია` : "აქცია ჯერ არ არის"} · ${nStores} მაღაზია</span></a>`;
  }).join("");

  // Active store promotions
  const topDeals = (deals || []).slice().sort((a, b) => (b.deal_score || 0) - (a.deal_score || 0)).slice(0, 6);
  $("#deals").innerHTML = deals === null ? errorState("აქციების ჩატვირთვა ვერ მოხერხდა.") : topDeals.length ? topDeals.map(dealCard).join("") : emptyState("მოქმედი აქციები ამჟამად არ არის.");

  // Brands
  const idx = brandIndex(stores, enriched);
  const feat = FEATURED_BRANDS.map(n => idx.get(n.toLowerCase())).filter(Boolean);
  const rest = [...idx.values()].filter(b => !feat.includes(b)).sort((a, b) => b.stores.size + b.products - (a.stores.size + a.products)).slice(0, 14 - feat.length);
  $("#brands").innerHTML = [...feat, ...rest].map(b => `<a class="chip" href="brands.html?b=${encodeURIComponent(b.name)}">${esc(b.name)} <small>${b.stores.size}</small></a>`).join("");

  // Stores that currently have a promotion
  const withDeal = (stores || []).map(s => ({ s, ds: dealsForStore(deals, s) })).filter(x => x.ds.length)
    .sort((a, b) => Math.max(...b.ds.map(d => d.discount_percent || 0)) - Math.max(...a.ds.map(d => d.discount_percent || 0))).slice(0, 8);
  $("#stores").innerHTML = withDeal.map(({ s, ds }) => {
    const best = Math.max(...ds.map(d => Number(d.discount_percent) || 0));
    return `<a class="tile store-tile" href="stores.html?s=${encodeURIComponent(s.slug)}">${storeMark(s.name)}<span class="grow"><b>${esc(s.name)}</b><small>${flag(s.country)} ${esc(countryName(s.country))}</small></span><span class="tag">${best ? `−${best}%-მდე` : "აქცია"}</span></a>`;
  }).join("") || emptyState("მაღაზიების სია ვერ ჩაიტვირთა.");

  // Search hints from real data (top brands + a category)
  $("#hero-hints").innerHTML = `<span>სცადე:</span>` + [...feat.slice(0, 3).map(b => b.name), "სახლი", "სილამაზე"].map(q => `<a href="deals.html?q=${encodeURIComponent(q)}">${esc(q)}</a>`).join("");

  renderSeason();
}

function renderSeason() {
  const now = Date.now();
  const s = SEASONAL.find(x => now >= Date.parse(x.showFrom) && now < Date.parse(x.end));
  if (!s) return;
  const n = (data.deals || []).filter(d => (d.tags || []).includes(s.tag)).length;
  if (!n) return; // no banner without real deals behind it
  const el = $("#season");
  const tick = () => {
    const t = Date.now(), live = t >= Date.parse(s.start);
    let sec = Math.max(0, Math.floor(((live ? Date.parse(s.end) : Date.parse(s.start)) - t) / 1000));
    const d = Math.floor(sec / 86400); sec -= d * 86400; const h = Math.floor(sec / 3600); sec -= h * 3600; const m = Math.floor(sec / 60);
    el.innerHTML = `<div class="season"><strong>${esc(s.title)}${live ? " — მიმდინარეობს" : ""}</strong><span class="timer">${live ? "დასრულებამდე" : "დაწყებამდე"} ${d} დღე ${h} სთ ${m} წთ</span><span>${n} აქცია უკვე მოქმედებს</span><a class="btn" href="deals.html?type=deals&tag=${encodeURIComponent(s.tag)}">ნახე აქციები →</a></div>`;
  };
  tick(); setInterval(tick, 60000);
}
