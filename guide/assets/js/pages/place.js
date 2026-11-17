import { t, L } from "../i18n.js";
import * as store from "../store.js";
import { mountChrome, translateStatic, routeCard, stopCard, bindToggles, typeChips, regionName, hoursText, feeText, mapsDir, $, esc } from "../ui.js";
import { placeById, PLACES } from "../data/places.js";
import { STOPS } from "../data/stops.js";
import { ROUTES } from "../data/routes.js";
import { makeMap, addPlace, addStop, fitTo } from "../map.js";

mountChrome("places"); translateStatic(); bindToggles();
const id = new URLSearchParams(location.search).get("id");
const p = placeById(id) || PLACES[0];
if (!placeById(id)) history.replaceState(null, "", `place.html?id=${p.id}`);
const on = store.hasPlace(p.id);
$("#head").innerHTML = `<p class="eyebrow">${esc(t("cats." + p.cat))} · ${esc(regionName(p.region))} ${typeChips(p.type)}</p><h1>${esc(L(p.name))}</h1>
  <p><button type="button" class="btn btn-small ${on ? "" : "btn-ghost"}" data-place-toggle="${p.id}" aria-pressed="${on}">${on ? "♥ " + esc(t("place.saved")) : "♡ " + esc(t("place.save"))}</button></p>
  <div class="facts"><div><b>${esc(t("place.visit"))}</b><span>${esc(hoursText(p.visit))}</span></div><div><b>${esc(t("place.fee"))}</b><span>${esc(feeText(p.fee))}</span></div><div><b>${esc(t("place.hoursLabel"))}</b><span>${esc(p.hours)}</span></div><div><b>${esc(t("place.bestTime"))}</b><span>${esc(p.season === "all" ? t("filters.all") : p.season)}</span></div>${p.alt ? `<div><b>${esc(t("place.altitude"))}</b><span>${p.alt} m</span></div>` : ""}</div>`;
document.title = `${L(p.name)} · ${t("appName")}`;
$("#body").innerHTML = `<p>${esc(L(p.desc))}</p><h2>${esc(t("place.tips"))}</h2><p>${esc(L(p.tips))}</p><h2>${esc(t("place.getThere"))}</h2><p>${esc(L(p.getThere))}</p><p class="fine">${esc(t("common.verifyNote"))}</p>`;
$("#gmaps").href = mapsDir(p.lat, p.lng);
document.addEventListener("click", e => { const b = e.target.closest("#head [data-place-toggle]"); if (!b) return; setTimeout(() => { const s = b.getAttribute("aria-pressed") === "true"; b.textContent = s ? "♥ " + t("place.saved") : "♡ " + t("place.save"); b.classList.toggle("btn-ghost", !s); }, 0); });
const dist = (a, b) => Math.hypot((a.lat - b.lat) * 111, (a.lng - b.lng) * 82);
const nearby = STOPS.map(s => ({ s, d: s.near === p.id ? 0 : dist(s, p) })).filter(x => x.d < 25).sort((a, b) => a.d - b.d).slice(0, 6).map(x => x.s);
$("#nearby").innerHTML = nearby.length ? nearby.map(stopCard).join("") : `<div class="empty">—</div>`;
const routes = ROUTES.filter(r => r.itinerary.some(d => d.stops.some(s => s.place === p.id)));
$("#routes").innerHTML = routes.length ? routes.map(routeCard).join("") : `<div class="empty">—</div>`;
const map = makeMap($("#map"));
if (map) { addPlace(map, p, { href: false }).openPopup(); nearby.forEach(s => addStop(map, s)); fitTo(map, [[p.lat, p.lng], ...nearby.map(s => [s.lat, s.lng])]); map.setZoom(Math.min(map.getZoom(), 12)); }
