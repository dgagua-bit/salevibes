import { t, L } from "../i18n.js";
import * as store from "../store.js";
import { mountChrome, translateStatic, placeCard, stopCard, bindToggles, typeChips, minsText, hoursText, $, esc } from "../ui.js";
import { routeById, ROUTES } from "../data/routes.js";
import { placeById } from "../data/places.js";
import { stopById } from "../data/stops.js";
import { makeMap, addPlace, addStop, addLine, fitTo } from "../map.js";

mountChrome("routes"); translateStatic(); bindToggles();
const id = new URLSearchParams(location.search).get("id");
const r = routeById(id) || ROUTES[0];
if (!routeById(id)) history.replaceState(null, "", `route.html?id=${r.id}`);
document.documentElement.style.setProperty("--rc", r.color);
const on = store.hasRoute(r.id);
$("#head").innerHTML = `<p class="eyebrow">${r.icon} ${typeChips(r.type)}</p><h1>${esc(L(r.name))}</h1><p class="lead">${esc(L(r.summary))}</p>
  <div class="facts"><div><b>${esc(t("days"))}</b><span>${r.days}</span></div><div><b>${esc(t("route.difficulty"))}</b><span>${esc(t("route." + r.difficulty))}</span></div><div><b>${esc(t("route.season"))}</b><span>${esc(L(r.season))}</span></div><div><b>${esc(t("route.start"))}</b><span>${esc(r.start)}</span></div></div>
  <p><label class="plan-check" style="display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:8px 16px"><input type="checkbox" data-route-toggle="${r.id}" ${on ? "checked" : ""}> <span>${esc(on ? t("route.inPlan") : t("route.addPlan"))}</span></label></p>`;
document.title = `${L(r.name)} · ${t("appName")}`;

const allPlaces = [], allStops = new Set();
$("#itinerary").innerHTML = r.itinerary.map((d, i) => {
  const li = d.stops.map(s => { const p = placeById(s.place); if (!p) return ""; allPlaces.push(p);
    const leg = s.drive ? `🚗 ${minsText(s.drive)} ${t("drive")}` : s.walk ? `🚶 ${minsText(s.walk)} ${t("walk")}` : "";
    return `<li>${leg ? `<div class="leg">${esc(leg)}</div>` : ""}<a class="stop-name" href="place.html?id=${p.id}">${esc(L(p.name))}</a><div class="stop-meta">${esc(t("cats." + p.cat))} · ⏱ ${hoursText(p.visit)}${p.alt ? ` · ⛰ ${p.alt} m` : ""}</div>${s.note ? `<div class="stop-note">${esc(L(s.note))}</div>` : ""}</li>`; }).join("");
  const eat = [...(d.eat || []), ...(d.rest || [])].map(stopById).filter(Boolean); eat.forEach(s => allStops.add(s));
  return `<div class="day"><h3><span class="n">${i + 1}</span>${esc(t("day"))} ${i + 1}: ${esc(L(d.title))}</h3><ol class="timeline">${li}</ol>
    ${eat.length ? `<div class="eat-row"><h4>${esc(t("route.stopsEat"))}</h4><ul>${eat.map(s => `<li><b>${esc(L(s.name))}</b> <span class="muted">· ${esc(t("kinds." + s.kind))} · ${esc(L(s.area))}</span></li>`).join("")}</ul></div>` : ""}</div>`;
}).join("");
$("#practical").innerHTML = (r.practical || []).map(p => `<li>${esc(L(p))}</li>`).join("");
const uniq = [...new Map(allPlaces.map(p => [p.id, p])).values()];
$("#places").innerHTML = uniq.map(p => placeCard(p, { compact: true })).join("");
$("#stops").innerHTML = [...allStops].map(stopCard).join("");
const pts = uniq.map(p => [p.lat, p.lng]);
$("#gmaps").href = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(r.start + ", Georgia")}&destination=${pts.at(-1).join(",")}&waypoints=${pts.slice(0, -1).slice(0, 9).map(p => p.join(",")).join("|")}&travelmode=driving`;
const map = makeMap($("#map"));
if (map) { uniq.forEach((p, i) => addPlace(map, p, { color: r.color })); [...allStops].forEach(s => addStop(map, s)); addLine(map, pts, r.color); fitTo(map, pts); }
