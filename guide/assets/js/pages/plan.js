import { t, L } from "../i18n.js";
import * as store from "../store.js";
import { mountChrome, translateStatic, routeCard, placeCard, stopCard, bindToggles, toast, $, esc } from "../ui.js";
import { ROUTES } from "../data/routes.js";
import { placeById } from "../data/places.js";
import { stopById } from "../data/stops.js";
import { makeMap, addPlace, addStop, addLine, fitTo } from "../map.js";

mountChrome("plan"); translateStatic(); bindToggles();
if (store.importFromUrl()) history.replaceState(null, "", "plan.html");
let map = makeMap($("#map")), layer = map ? window.L.layerGroup().addTo(map) : null;
function render() {
  const p = store.plan();
  const routes = p.routes.map(id => ROUTES.find(r => r.id === id)).filter(Boolean);
  const saved = p.places.map(placeById).filter(Boolean);
  const empty = !routes.length && !saved.length;
  $("#empty").hidden = !empty; $("#empty").textContent = t("plan.empty"); $("#content").hidden = empty;
  if (empty) return;
  const stops = new Map(), routePlaces = new Map(), pts = [];
  routes.forEach(r => r.itinerary.forEach(d => { d.stops.forEach(s => { const pl = placeById(s.place); if (pl) routePlaces.set(pl.id, pl); }); [...(d.eat || []), ...(d.rest || [])].forEach(id => { const s = stopById(id); if (s) stops.set(s.id, s); }); }));
  const days = routes.reduce((n, r) => n + r.days, 0);
  $("#routes").innerHTML = routes.length ? routes.map(routeCard).join("") + `<p class="muted" style="grid-column:1/-1">${esc(t("plan.totalDays"))}: ${days} ${esc(t("days"))}</p>` : `<div class="empty">—</div>`;
  $("#places").innerHTML = saved.length ? saved.map(pl => placeCard(pl, { compact: true })).join("") : `<div class="empty">—</div>`;
  $("#stops").innerHTML = stops.size ? [...stops.values()].map(stopCard).join("") : `<div class="empty">—</div>`;
  if (map) {
    layer.clearLayers();
    routes.forEach(r => { const rp = []; r.itinerary.forEach(d => d.stops.forEach(s => { const pl = placeById(s.place); if (pl) { rp.push([pl.lat, pl.lng]); layer.addLayer(addPlace(map, pl, { color: r.color })); } })); layer.addLayer(addLine(map, rp, r.color)); pts.push(...rp); });
    saved.forEach(pl => { layer.addLayer(addPlace(map, pl, { color: "#9f2529" })); pts.push([pl.lat, pl.lng]); });
    stops.forEach(s => layer.addLayer(addStop(map, s)));
    fitTo(map, pts);
  }
}
render();
window.addEventListener("gg:plan", render);
$("#share").addEventListener("click", async () => { const u = store.shareUrl(); try { await navigator.clipboard.writeText(u); toast(t("plan.copied")); } catch { prompt(t("plan.share"), u); } });
$("#print").addEventListener("click", () => window.print());
$("#clear").addEventListener("click", () => { if (confirm(t("plan.clearConfirm"))) { store.clear(); render(); } });
