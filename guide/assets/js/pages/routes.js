import { t, L } from "../i18n.js";
import { mountChrome, translateStatic, routeCard, bindToggles, $, $$, esc } from "../ui.js";
import { ROUTES } from "../data/routes.js";

mountChrome("routes"); translateStatic(); bindToggles();
const q = new URLSearchParams(location.search);
let type = q.get("type") || "all", days = "all";
const TYPES = ["all", "mountain", "sea", "city", "wine"];
$("#type-seg").innerHTML = TYPES.map(x => `<button type="button" data-type="${x}" aria-pressed="${x === type}">${esc(x === "all" ? t("filters.all") : t("types." + x))}</button>`).join("");
$("#days").innerHTML = [["all", t("filters.days") + ": " + t("filters.all")], ["1", "≤ 1 " + t("days")], ["2", "2 " + t("days")], ["3", "3+ " + t("days")]].map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join("");
function render() {
  const list = ROUTES.filter(r => (type === "all" || r.type.includes(type)) && (days === "all" || (days === "1" ? r.days <= 1 : days === "2" ? r.days === 2 : r.days >= 3)));
  $("#count").textContent = `${list.length} ${t("filters.results")}`;
  $("#list").innerHTML = list.length ? list.map(routeCard).join("") : `<div class="empty">${esc(t("filters.noResults"))}</div>`;
}
$("#type-seg").addEventListener("click", e => { const b = e.target.closest("[data-type]"); if (!b) return; type = b.dataset.type; $$("#type-seg button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); render(); });
$("#days").addEventListener("change", e => { days = e.target.value; render(); });
render();
