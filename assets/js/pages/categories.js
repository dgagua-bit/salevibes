import { mountChrome, storeMark, skeleton, errorState, emptyState, $, $$ } from "../ui.js";
import { loadAll, dealsForStore, bestDiscount } from "../data.js";
import { WORLDS, AUDIENCE_WORLDS } from "../config.js";
import { esc, countryName, flag, hostOf, safeUrl } from "../format.js";

mountChrome("categories");
$("#worlds").innerHTML = skeleton(5, "tile");
const params = new URLSearchParams(location.search);
let COUNTRY = params.get("country") || "", AUD = "", OPEN = params.get("w") || null, data;

try { data = await loadAll({ offers: false }); render(); if (OPEN) openWorld(OPEN, false); }
catch (e) { console.error(e); $("#worlds").innerHTML = errorState(); }

function inWorld(s, key, useAud = true) { return (s.worlds || []).includes(key) && (!COUNTRY || String(s.country || "").toUpperCase() === COUNTRY) && (!useAud || !AUD || !AUDIENCE_WORLDS.has(key) || (s.audience || []).includes(AUD)); }

function render() {
  const stores = data.stores || [];
  const counts = {};
  stores.filter(s => (s.worlds || []).length).forEach(s => { const c = String(s.country || "").toUpperCase(); if (c) counts[c] = (counts[c] || 0) + 1; });
  $("#countries").innerHTML = [["", "ყველა ქვეყანა", stores.filter(s => (s.worlds || []).length).length], ...Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map(c => [c, `${flag(c)} ${countryName(c)}`, counts[c]])]
    .map(([c, l, n]) => `<button type="button" class="chip" data-country="${esc(c)}" aria-pressed="${COUNTRY === c}">${esc(l)} <small>${n}</small></button>`).join("");
  $("#worlds").innerHTML = WORLDS.map(w => {
    const n = stores.filter(s => inWorld(s, w.key, false)).length;
    const nd = stores.filter(s => inWorld(s, w.key, false) && dealsForStore(data.deals, s).length).length;
    return `<button type="button" class="tile" data-world="${w.key}" aria-pressed="${OPEN === w.key}" aria-controls="world-panel"><b>${esc(w.title)}</b><small>${esc(w.sub)}</small><span class="count">${n} მაღაზია · ${nd} აქციით</span></button>`;
  }).join("");
  if (OPEN) renderWorld();
}

function renderWorld() {
  const w = WORLDS.find(x => x.key === OPEN);
  if (!w) return;
  const list = (data.stores || []).filter(s => inWorld(s, OPEN)).sort((a, b) => bestDiscount(data.deals, b) - bestDiscount(data.deals, a) || (a.sort_order || 0) - (b.sort_order || 0));
  $("#world-title").textContent = `${w.title}${COUNTRY ? " · " + countryName(COUNTRY) : ""}`;
  $("#world-sub").textContent = `${list.length} მაღაზია, დალაგებული მიმდინარე საუკეთესო ფასდაკლებით`;
  $("#world-deals").href = `deals.html?cat=${OPEN}${COUNTRY ? "&country=" + COUNTRY : ""}`;
  const aud = $("#audience");
  if (AUDIENCE_WORLDS.has(OPEN)) {
    const base = (data.stores || []).filter(s => inWorld(s, OPEN, false));
    aud.innerHTML = [["", "ყველა"], ["women", "ქალი"], ["men", "მამაკაცი"], ["kids", "ბავშვი"]].map(([a, l]) => `<button type="button" class="chip" data-aud="${a}" aria-pressed="${AUD === a}">${l} <small>${a ? base.filter(s => (s.audience || []).includes(a)).length : base.length}</small></button>`).join("");
    aud.hidden = false;
  } else aud.hidden = true;
  $("#world-stores").innerHTML = list.map(s => {
    const ds = dealsForStore(data.deals, s), best = ds.reduce((m, d) => Math.max(m, Number(d.discount_percent) || 0), 0);
    return `<a class="tile store-tile" href="${esc(safeUrl(ds[0]?.sale_url || s.base_url))}" target="_blank" rel="noopener noreferrer sponsored">${storeMark(s.name)}<span class="grow"><b>${esc(s.name)}</b><small>${flag(s.country)} ${esc(countryName(s.country))} · ${esc(hostOf(s.base_url))}</small></span>${ds.length ? `<span class="tag">${best ? `−${best}%-მდე` : "აქცია"}</span>` : `<span class="tag off">აქცია არ არის</span>`}</a>`;
  }).join("") || emptyState("ამ ფილტრით მაღაზია ვერ მოიძებნა.");
}

function openWorld(key, toggle = true) {
  OPEN = toggle && OPEN === key ? null : key;
  $("#world-panel").hidden = !OPEN;
  render();
  if (OPEN) $("#world-panel").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

document.addEventListener("click", e => {
  const w = e.target.closest("[data-world]"); if (w) return openWorld(w.dataset.world);
  const c = e.target.closest("[data-country]"); if (c) { COUNTRY = c.dataset.country; render(); return; }
  const a = e.target.closest("[data-aud]"); if (a) { AUD = a.dataset.aud; renderWorld(); }
});
