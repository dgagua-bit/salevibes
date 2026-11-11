import { mountChrome, storeMark, skeleton, errorState, emptyState, $, $$ } from "../ui.js";
import { loadAll, dealsForStore } from "../data.js";
import { esc, countryName, flag, hostOf, safeUrl, catLabel, ago } from "../format.js";

mountChrome("stores");
$("#s-list").innerHTML = skeleton(6, "tile");
const params = new URLSearchParams(location.search);
let data, LIMIT = 30, F = "";
if (params.get("s")) $("#s-q").value = params.get("s");

try { data = await loadAll({ offers: false }); render(); }
catch (e) { console.error(e); $("#s-list").innerHTML = errorState(); }

/** Where does this store's data come from? Never claims automation that doesn't run. */
function source(s, ds) {
  if (s.active && s.last_crawled_at) return { k: "auto", html: `<span class="tag auto" title="სკანერი ბოლოს: ${esc(ago(s.last_crawled_at))}">AUTO</span>` };
  if (ds.length) return { k: "manual", html: `<span class="tag" title="აქციას რედაქცია ხელით ამოწმებს">MANUAL</span>` };
  return { k: "pending", html: `<span class="tag off" title="მონაცემთა ინტეგრაცია ჯერ არ არის">PENDING</span>` };
}

function render() {
  const q = $("#s-q").value.trim().toLowerCase();
  const list = (data.stores || []).map(s => ({ s, ds: dealsForStore(data.deals, s) })).map(x => ({ ...x, src: source(x.s, x.ds) }))
    .filter(({ s, ds, src }) => (!q || [s.name, s.slug, hostOf(s.base_url), countryName(s.country), catLabel(s.category), ...(s.brands || [])].join(" ").toLowerCase().includes(q))
      && (!F || (F === "deal" ? ds.length : src.k === "auto")))
    .sort((a, b) => b.ds.length - a.ds.length || (a.s.sort_order || 0) - (b.s.sort_order || 0));
  $("#s-count").textContent = `${list.length} მაღაზია`;
  $("#s-list").innerHTML = list.slice(0, LIMIT).map(({ s, ds, src }) => {
    const best = ds.reduce((m, d) => Math.max(m, Number(d.discount_percent) || 0), 0);
    return `<a class="tile store-tile" href="${esc(safeUrl(ds[0]?.sale_url || s.base_url))}" target="_blank" rel="noopener noreferrer sponsored">${storeMark(s.name)}<span class="grow"><b>${esc(s.name)}</b><small>${flag(s.country)} ${esc(countryName(s.country))} · ${esc(catLabel(s.category))} · ${esc(hostOf(s.base_url))}</small></span>${src.html}${ds.length ? `<span class="tag">${best ? `−${best}%` : "აქცია"}</span>` : ""}</a>`;
  }).join("") || emptyState("მაღაზია ვერ მოიძებნა.");
  const more = $("#s-more");
  more.hidden = list.length <= LIMIT;
  more.textContent = `მეტის ნახვა (+${Math.max(0, list.length - LIMIT)})`;
}

$("#s-q").addEventListener("input", () => { LIMIT = 30; render(); });
$("#s-more").addEventListener("click", () => { LIMIT += 60; render(); });
$$(".seg [data-f]").forEach(b => b.addEventListener("click", () => { F = b.dataset.f; $$(".seg [data-f]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); LIMIT = 30; render(); }));
