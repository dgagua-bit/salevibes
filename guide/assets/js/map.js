/** Thin Leaflet wrapper. Leaflet is vendored (assets/vendor/leaflet) so the app shell works offline; tiles need a network. */
import { t, L as Lz } from "./i18n.js";
const GEORGIA = [[41.0, 40.0], [43.6, 46.8]];
const Lf = () => window.L;

export function makeMap(el, { bounds = GEORGIA, zoomControl = true } = {}) {
  if (!el || !Lf()) { if (el) el.innerHTML = `<p class="map-fallback">${t("common.mapOffline")}</p>`; return null; }
  const map = Lf().map(el, { zoomControl, scrollWheelZoom: false, attributionControl: true });
  Lf().tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
  map.fitBounds(bounds, { padding: [10, 10] });
  const btn = Lf().control({ position: "topleft" });
  btn.onAdd = () => { const d = Lf().DomUtil.create("div", "leaflet-bar locate"); d.innerHTML = `<a href="#" role="button" title="${t("map.locate")}" aria-label="${t("map.locate")}">⌖</a>`; Lf().DomEvent.on(d, "click", e => { Lf().DomEvent.stop(e); locate(map); }); return d; };
  btn.addTo(map);
  return map;
}
function locate(map) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    const ll = [pos.coords.latitude, pos.coords.longitude];
    Lf().circleMarker(ll, { radius: 8, color: "#fff", weight: 2, fillColor: "#2a7f9e", fillOpacity: 1 }).addTo(map).bindPopup(t("map.you")).openPopup();
    map.setView(ll, 12);
  }, () => {}, { timeout: 8000 });
}
export const icon = (color, glyph = "") => Lf().divIcon({ className: "pin", html: `<span style="--c:${color}"><i>${glyph}</i></span>`, iconSize: [28, 36], iconAnchor: [14, 34], popupAnchor: [0, -30] });
export function addPlace(map, p, { color = "#9f2529", href = true } = {}) {
  const m = Lf().marker([p.lat, p.lng], { icon: icon(color) }).addTo(map);
  m.bindPopup(`<b>${Lz(p.name)}</b><br>${href ? `<a href="place.html?id=${encodeURIComponent(p.id)}">${t("common.open")} →</a>` : ""}`);
  return m;
}
export function addStop(map, s) {
  const m = Lf().marker([s.lat, s.lng], { icon: icon("#b5651d", s.kind === "winery" ? "🍷" : s.kind === "market" ? "🧺" : s.kind === "rest" || s.kind === "viewpoint" ? "☕" : "🍽") }).addTo(map);
  m.bindPopup(`<b>${Lz(s.name)}</b><br><small>${Lz(s.area)}</small>`);
  return m;
}
export function addLine(map, points, color) { return Lf().polyline(points, { color, weight: 4, opacity: .8, dashArray: "2 8", lineCap: "round" }).addTo(map); }
export function fitTo(map, points) { if (points.length) map.fitBounds(points, { padding: [30, 30], maxZoom: 13 }); }
