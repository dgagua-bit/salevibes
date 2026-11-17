import { t, L, lang } from "../i18n.js";
import { mountChrome, translateStatic, $, $$, esc, EXT } from "../ui.js";
import { AIRPORTS, SIM, MONEY, EMERGENCY, ESSENTIALS } from "../data/arrival.js";

mountChrome("arrival"); translateStatic();
const MODE_ICON = { bus: "🚌", taxi: "🚕", shuttle: "🚐", train: "🚆", car: "🚗" };
const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
$("#bolt").href = ios ? "https://apps.apple.com/app/id675033630" : "https://play.google.com/store/apps/details?id=ee.mtakso.client";
$("#yandex").href = ios ? "https://apps.apple.com/app/id472650686" : "https://play.google.com/store/apps/details?id=ru.yandex.taxi";

let current = (new URLSearchParams(location.search).get("airport") || (localStorage.getItem("gg:airport") || "TBS")).toUpperCase();
if (!AIRPORTS.some(a => a.id === current)) current = "TBS";
function render() {
  const a = AIRPORTS.find(x => x.id === current);
  try { localStorage.setItem("gg:airport", current); } catch {}
  $("#airports").innerHTML = AIRPORTS.map(x => `<button type="button" data-airport="${x.id}" aria-pressed="${x.id === current}">✈ ${esc(L(x.name))}<br><small>${x.distance} km → ${esc(L(x.city))}</small></button>`).join("");
  $("#options").innerHTML = a.options.map(o => `<article class="option"><span class="mode" aria-hidden="true">${MODE_ICON[o.mode] || "•"}</span><h3>${esc(L(o.title))}</h3>
    <dl><dt>${esc(t("arrival.cost"))}</dt><dd>${esc(o.cost)}</dd><dt>${esc(t("arrival.time"))}</dt><dd>${esc(L(o.time))}</dd><dt>${esc(t("arrival.runs"))}</dt><dd>${esc(L(o.runs))}</dd></dl>
    <p class="tip"><b>${esc(t("arrival.tip"))}:</b> ${esc(L(o.tip))}</p></article>`).join("");
  $("#intercity").textContent = L(a.intercity);
}
render();
$("#airports").addEventListener("click", e => { const b = e.target.closest("[data-airport]"); if (b) { current = b.dataset.airport; render(); } });
$("#hotel-form").addEventListener("submit", e => {
  e.preventDefault();
  const a = AIRPORTS.find(x => x.id === current), hotel = $("#hotel").value.trim(); if (!hotel) return;
  const mode = e.submitter?.dataset.mode || "transit";
  const dest = /,/.test(hotel) ? hotel : `${hotel}, ${L(a.city)}, Georgia`;
  const u = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a.mapsName)}&destination=${encodeURIComponent(dest)}&travelmode=${mode}`;
  window.open(u, "_blank", "noopener");
});
const list = arr => `<ul>${arr.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`;
$("#sim").innerHTML = list(SIM[lang()] || SIM.en);
$("#money").innerHTML = list(MONEY[lang()] || MONEY.en);
$("#emergency").innerHTML = EMERGENCY.map(x => `<a href="tel:${x.number.replace(/\s/g, "")}"><b>${esc(x.number)}</b><span>${esc(L(x.label))}</span></a>`).join("");
$("#essentials").innerHTML = (ESSENTIALS[lang()] || ESSENTIALS.en).map(x => `<div><b>${esc(x.k)}</b><span>${esc(x.v)}</span></div>`).join("");
