import { t, L, lang } from "../i18n.js";
import { mountChrome, translateStatic, stopCard, $, $$, esc } from "../ui.js";
import { DISHES, DRINKS, SUPRA, PHRASES, PRICES } from "../data/food.js";
import { STOPS } from "../data/stops.js";

mountChrome("food"); translateStatic();
let veg = false;
$("#veg-seg").innerHTML = `<button type="button" data-veg="0" aria-pressed="true">${esc(t("food.allDishes"))}</button><button type="button" data-veg="1" aria-pressed="false">🌱 ${esc(t("food.filterVeg"))}</button>`;
function render() {
  $("#dishes").innerHTML = DISHES.filter(d => !veg || d.veg).map(d => `<article class="card dish"><div class="ic" aria-hidden="true">${d.icon}</div><div>
    <h3>${esc(L(d.name))}${lang() !== "ka" ? ` <span class="muted small">${esc(d.name.ka)}</span>` : ""}</h3>
    <div class="tags">${d.veg ? `<span class="chip chip-mountain">🌱 ${esc(t("food.veg"))}</span>` : ""}${d.spicy ? `<span class="chip chip-city">🌶 ${esc(t("food.spicy"))}</span>` : ""}<span class="chip">${esc(d.price)} ${esc(t("common.gel"))}</span></div>
    <p class="small muted">${esc(t("food.region"))}: ${esc(L(d.region))}</p><p>${esc(L(d.desc))}</p>
    <details><summary>${esc(t("food.howToEat"))}</summary><p>${esc(L(d.how))}</p></details></div></article>`).join("");
}
$("#veg-seg").addEventListener("click", e => { const b = e.target.closest("[data-veg]"); if (!b) return; veg = b.dataset.veg === "1"; $$("#veg-seg button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); render(); });
render();
$("#drinks").innerHTML = DRINKS.map(d => `<article class="card dish"><div class="ic" aria-hidden="true">${d.icon}</div><div><h3>${esc(L(d.name))}</h3><p>${esc(L(d.desc))}</p></div></article>`).join("");
$("#supra").innerHTML = (SUPRA[lang()] || SUPRA.en).map(s => `<li>${esc(s)}</li>`).join("");
$("#phrases").innerHTML = PHRASES.map(p => `<tr><td>${esc(lang() === "ru" ? p.ru : p.en)}</td><td class="ka">${esc(p.ka)}</td><td class="tr">${esc(p.tr)}</td></tr>`).join("");
$("#prices").innerHTML = PRICES.map(p => `<tr><td>${esc(L(p.item))}</td><td>${esc(p.gel)} ${esc(t("common.gel"))}</td></tr>`).join("");
$("#where").innerHTML = STOPS.filter(s => ["restaurant", "winery", "market", "bakery"].includes(s.kind)).map(stopCard).join("");
