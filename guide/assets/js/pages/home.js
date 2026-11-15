import { t, L } from "../i18n.js";
import { mountChrome, translateStatic, routeCard, bindToggles, $, esc } from "../ui.js";
import { ROUTES } from "../data/routes.js";
import { PLACES } from "../data/places.js";
import { makeMap, addPlace } from "../map.js";

mountChrome("home"); translateStatic(); bindToggles();
$("#quick").innerHTML = [
  ["arrival.html", "✈", "quick.arrival", "quick.arrivalSub"], ["routes.html", "⤳", "quick.routes", "quick.routesSub"],
  ["places.html", "◎", "quick.places", "quick.placesSub"], ["food.html", "🍽", "quick.food", "quick.foodSub"]
].map(([h, i, a, b]) => `<a href="${h}"><i aria-hidden="true">${i}</i><b>${esc(t(a))}</b><span>${esc(t(b))}</span></a>`).join("");
$("#regions").innerHTML = [
  ["mountain", "#1f6f5f"], ["sea", "#2a7f9e"], ["city", "#d66a4a"], ["wine", "#6b2d5c"]
].map(([k, c]) => `<a href="places.html?type=${k}" style="--c:${c}"><b>${esc(t("regions." + k))}</b><span>${esc(t("regions." + k + "Sub"))}</span></a>`).join("");
$("#featured").innerHTML = ["tbilisi-1day", "kazbegi-2day", "kakheti-2day", "batumi-3day", "svaneti-4day", "imereti-2day"].map(id => routeCard(ROUTES.find(r => r.id === id))).join("");
const map = makeMap($("#map"));
if (map) { const colors = { nature: "#1f6f5f", history: "#b5651d", religion: "#c9a227", museum: "#6b2d5c", viewpoint: "#2a7f9e", town: "#d66a4a", architecture: "#777", activity: "#2d8c78", park: "#5a8f3c" }; PLACES.forEach(p => addPlace(map, p, { color: colors[p.cat] })); }
