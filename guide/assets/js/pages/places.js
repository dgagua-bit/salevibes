import { t, L } from "../i18n.js";
import { mountChrome, translateStatic, placeCard, bindToggles, regionName, $, $$, esc } from "../ui.js";
import { PLACES, REGIONS } from "../data/places.js";
import { makeMap, addPlace, fitTo } from "../map.js";

mountChrome("places"); translateStatic(); bindToggles();
const q = new URLSearchParams(location.search);
const st = { type: q.get("type") || "all", region: q.get("region") || "all", cat: q.get("cat") || "all", q: q.get("q") || "" };
const TYPES = ["all", "mountain", "sea", "city", "wine"];
const CATS = ["nature", "history", "religion", "museum", "viewpoint", "town", "architecture", "activity", "park"];
const COLORS = { nature: "#1f6f5f", history: "#b5651d", religion: "#c9a227", museum: "#6b2d5c", viewpoint: "#2a7f9e", town: "#d66a4a", architecture: "#777", activity: "#2d8c78", park: "#5a8f3c" };
$("#type-seg").innerHTML = TYPES.map(x => `<button type="button" data-type="${x}" aria-pressed="${x === st.type}">${esc(x === "all" ? t("filters.all") : t("types." + x))}</button>`).join("");
$("#region").innerHTML = `<option value="all">${esc(t("filters.region"))}: ${esc(t("filters.all"))}</option>` + Object.keys(REGIONS).map(k => `<option value="${k}" ${k === st.region ? "selected" : ""}>${esc(regionName(k))}</option>`).join("");
$("#cat").innerHTML = `<option value="all">${esc(t("filters.type"))}: ${esc(t("filters.all"))}</option>` + CATS.map(k => `<option value="${k}" ${k === st.cat ? "selected" : ""}>${esc(t("cats." + k))}</option>`).join("");
$("#q").value = st.q;
const map = makeMap($("#map")); let layer = map ? window.L.layerGroup().addTo(map) : null;
function render() {
  const needle = st.q.trim().toLowerCase();
  const list = PLACES.filter(p => (st.type === "all" || p.type.includes(st.type)) && (st.region === "all" || p.region === st.region) && (st.cat === "all" || p.cat === st.cat)
    && (!needle || [L(p.name), p.name.en, L(p.desc), regionName(p.region)].join(" ").toLowerCase().includes(needle)));
  $("#count").textContent = `${list.length} ${t("filters.results")}`;
  $("#list").innerHTML = list.length ? list.map(p => placeCard(p)).join("") : `<div class="empty">${esc(t("filters.noResults"))}</div>`;
  if (map) { layer.clearLayers(); list.forEach(p => { const m = addPlace(map, p, { color: COLORS[p.cat] }); layer.addLayer(m); }); fitTo(map, list.map(p => [p.lat, p.lng])); }
  const u = new URL(location.href); ["type", "region", "cat", "q"].forEach(k => st[k] && st[k] !== "all" ? u.searchParams.set(k, st[k]) : u.searchParams.delete(k)); history.replaceState(null, "", u);
}
$("#type-seg").addEventListener("click", e => { const b = e.target.closest("[data-type]"); if (!b) return; st.type = b.dataset.type; $$("#type-seg button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); render(); });
$("#region").addEventListener("change", e => { st.region = e.target.value; render(); });
$("#cat").addEventListener("change", e => { st.cat = e.target.value; render(); });
$("#q").addEventListener("input", e => { st.q = e.target.value; render(); });
$("#reset").addEventListener("click", () => { Object.assign(st, { type: "all", region: "all", cat: "all", q: "" }); $("#q").value = ""; $("#region").value = "all"; $("#cat").value = "all"; $$("#type-seg button").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.type === "all"))); render(); });
render();
