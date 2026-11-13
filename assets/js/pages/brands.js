import { mountChrome, offerCard, bindCardActions, storeMark, skeleton, errorState, emptyState, $ } from "../ui.js";
import { loadAll, brandIndex, dealsForStore, bestDiscount } from "../data.js";
import { FEATURED_BRANDS } from "../config.js";
import { esc, countryName, flag, hostOf, safeUrl } from "../format.js";

mountChrome("brands");
$("#b-chips").innerHTML = skeleton(1, "tile");
let data, idx, BRAND = "";
bindCardActions(id => data?.byProduct.get(String(id)), null);

try {
  data = await loadAll();
  idx = brandIndex(data.stores, data.enriched);
  $("#b-list").innerHTML = [...idx.values()].map(b => b.name).sort((a, b) => a.localeCompare(b)).map(n => `<option value="${esc(n)}"></option>`).join("");
  const q = new URLSearchParams(location.search).get("b");
  chips();
  if (q) { $("#b-q").value = q; select(q); }
} catch (e) { console.error(e); $("#b-chips").innerHTML = errorState(); }

function chips() {
  const feat = FEATURED_BRANDS.map(n => idx.get(n.toLowerCase())).filter(Boolean);
  const rest = [...idx.values()].filter(b => !feat.includes(b)).sort((a, b) => b.stores.size + b.products - (a.stores.size + a.products)).slice(0, 30);
  $("#b-chips").innerHTML = [...feat, ...rest].map(b => `<button type="button" class="chip" data-brand="${esc(b.name)}" aria-pressed="${BRAND.toLowerCase() === b.name.toLowerCase()}">${esc(b.name)} <small>${b.stores.size}${b.products ? ` · ${b.products} პროდ.` : ""}</small></button>`).join("");
}

function select(name) {
  const q = String(name || "").trim();
  const box = $("#b-result");
  if (!q) { BRAND = ""; box.hidden = true; chips(); history.replaceState(null, "", location.pathname); return; }
  let e = idx.get(q.toLowerCase());
  if (!e) { const m = [...idx.values()].filter(b => b.name.toLowerCase().includes(q.toLowerCase())); if (m.length === 1) e = m[0]; }
  BRAND = e ? e.name : q;
  history.replaceState(null, "", `${location.pathname}?b=${encodeURIComponent(BRAND)}`);
  chips();
  const stores = e ? [...e.stores.values()].sort((a, b) => bestDiscount(data.deals, b) - bestDiscount(data.deals, a) || a.name.localeCompare(b.name)) : [];
  const products = data.enriched.filter(x => String(x.product.brand || "").toLowerCase() === BRAND.toLowerCase()).sort((a, b) => (b.scored.score ?? -1) - (a.scored.score ?? -1));
  box.innerHTML = `<div class="section-head"><div><h2>${esc(BRAND)}</h2><p>${stores.length} მაღაზია · ${products.length} პროდუქტი ფასის კონტროლით</p></div><button type="button" class="btn btn-ghost" id="b-clear">გასუფთავება</button></div>
    ${stores.length ? `<p class="fine">ბრენდისა და მაღაზიის კავშირი მიახლოებითია — მოდელი, ფასი და მარაგი მაღაზიის საიტზე გადაამოწმე.</p><div class="tiles store-tiles">${stores.map(s => {
      const ds = dealsForStore(data.deals, s), best = ds.reduce((m, d) => Math.max(m, Number(d.discount_percent) || 0), 0);
      return `<a class="tile store-tile" href="${esc(safeUrl(ds[0]?.sale_url || s.base_url))}" target="_blank" rel="noopener noreferrer sponsored">${storeMark(s.name, s.logo_url)}<span class="grow"><b>${esc(s.name)}</b><small>${flag(s.country)} ${esc(countryName(s.country))} · ${esc(hostOf(s.base_url))}</small></span>${ds.length ? `<span class="tag">${best ? `−${best}%-მდე` : "აქცია"}</span>` : `<span class="tag off">აქცია არ არის</span>`}</a>`;
    }).join("")}</div>` : emptyState("ამ ბრენდს ჯერ არცერთ მაღაზიასთან არ ვაკავშირებთ.")}
    ${products.length ? `<div class="subhead"><h2>პროდუქტები</h2><p>ფასი, შეთავაზების ქულა, სავარაუდო ფასი საქართველოში</p></div><div class="grid">${products.slice(0, 12).map(offerCard).join("")}</div>${products.length > 12 ? `<div class="more"><a class="btn btn-ghost" href="deals.html?type=products&brand=${encodeURIComponent(BRAND)}">ყველა ${products.length} პროდუქტი →</a></div>` : ""}` : ""}`;
  box.hidden = false;
}

$("#b-form").addEventListener("submit", e => { e.preventDefault(); select($("#b-q").value); });
document.addEventListener("click", e => {
  const c = e.target.closest("[data-brand]");
  if (c) { const same = BRAND.toLowerCase() === c.dataset.brand.toLowerCase(); $("#b-q").value = same ? "" : c.dataset.brand; select(same ? "" : c.dataset.brand); return; }
  if (e.target.id === "b-clear") { $("#b-q").value = ""; select(""); }
});
