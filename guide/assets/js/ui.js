/** Shared chrome and small components. */
import { t, L, lang, setLang, LANGS } from "./i18n.js";
import * as store from "./store.js";
import { REGIONS } from "./data/places.js";

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const EXT = 'target="_blank" rel="noopener noreferrer"';

const NAV = [
  { id: "home", href: "index.html", key: "nav.home", icon: "⌂" },
  { id: "arrival", href: "arrival.html", key: "nav.arrival", icon: "✈" },
  { id: "routes", href: "routes.html", key: "nav.routes", icon: "⤳" },
  { id: "places", href: "places.html", key: "nav.places", icon: "◎" },
  { id: "food", href: "food.html", key: "nav.food", icon: "🍽" },
  { id: "plan", href: "plan.html", key: "nav.plan", icon: "♥" }
];

let deferredInstall = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; $$("[data-install]").forEach(b => (b.hidden = false)); });

export function mountChrome(active) {
  const h = $("[data-gg-header]");
  if (h) {
    h.className = "site-header";
    h.innerHTML = `<div class="wrap header-row">
      <a class="brand" href="index.html" aria-label="${esc(t("appName"))}"><img src="assets/img/icon-48.png" alt="" width="32" height="32"><span>${esc(t("appName"))}</span></a>
      <nav class="main-nav" aria-label="${esc(t("nav.home"))}"><ul>${NAV.map(n => `<li><a href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}>${esc(t(n.key))}${n.id === "plan" ? ` <b class="count" data-plan-count>${store.count()}</b>` : ""}</a></li>`).join("")}</ul></nav>
      <div class="header-tools">
        <button type="button" class="btn btn-small" data-install hidden>${esc(t("install"))}</button>
        <div class="lang" role="group" aria-label="${esc(t("lang"))}">${LANGS.map(l => `<button type="button" data-lang="${l.code}" aria-pressed="${l.code === lang()}">${l.label}</button>`).join("")}</div>
      </div></div>`;
    $$("[data-lang]", h).forEach(b => b.addEventListener("click", () => { setLang(b.dataset.lang); location.reload(); }));
    $("[data-install]", h).addEventListener("click", async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $("[data-install]", h).hidden = true; });
    if (deferredInstall) $("[data-install]", h).hidden = false;
  }
  const tabs = $("[data-gg-tabs]");
  if (tabs) {
    tabs.className = "tabbar"; tabs.setAttribute("aria-label", t("nav.home"));
    tabs.innerHTML = NAV.map(n => `<a href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}><i aria-hidden="true">${n.icon}</i><span>${esc(t(n.key))}</span>${n.id === "plan" ? `<b class="count" data-plan-count>${store.count()}</b>` : ""}</a>`).join("");
  }
  const f = $("[data-gg-footer]");
  if (f) {
    f.className = "site-footer";
    f.innerHTML = `<div class="wrap footer-grid">
      <div><strong>${esc(t("appName"))}</strong><p>${esc(t("footer.about"))}</p></div>
      <nav><ul>${NAV.map(n => `<li><a href="${n.href}">${esc(t(n.key))}</a></li>`).join("")}<li><a href="qr.html">${esc(t("footer.qr"))}</a></li></ul></nav>
      <p class="fine">© ${new Date().getFullYear()} · Map data © OpenStreetMap contributors</p></div>`;
  }
  const off = document.createElement("div"); off.className = "offline-bar"; off.hidden = navigator.onLine; off.textContent = t("offline"); document.body.prepend(off);
  window.addEventListener("online", () => (off.hidden = true)); window.addEventListener("offline", () => (off.hidden = false));
  window.addEventListener("gg:plan", () => $$("[data-plan-count]").forEach(el => (el.textContent = store.count())));
  document.title = `${$("h1")?.textContent?.trim() || t("appName")} · ${t("appName")}`;
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* ---------- helpers ---------- */
export const regionName = id => L(REGIONS[id] || { en: id });
export const typeChips = types => (types || []).map(x => `<span class="chip chip-${x}">${esc(t("types." + x))}</span>`).join("");
export const mapsSearch = (q, lat, lng) => lat ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}&query_place_id=&center=${lat},${lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const mapsDir = (lat, lng, mode = "driving") => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${mode}`;
export const hoursText = h => h >= 24 ? t("route.overnight") : h >= 1 ? `${h} ${t("hours")}` : `${Math.round(h * 60)} min`;
export const feeText = f => (f === "0" ? t("place.free") : `~${f.replace(/^~/, "")} ${t("common.gel")}`);
export const minsText = m => (m >= 60 ? `${Math.floor(m / 60)} ${t("hours")} ${m % 60 ? (m % 60) + " min" : ""}`.trim() : `${m} min`);
export const priceDots = n => `<span class="price" aria-label="price level ${n}/3">${"₾".repeat(n)}<span class="dim">${"₾".repeat(3 - n)}</span></span>`;

/* ---------- cards ---------- */
export function placeCard(p, { compact = false } = {}) {
  const on = store.hasPlace(p.id);
  return `<article class="card place-card cat-${p.cat}">
    <a class="card-body" href="place.html?id=${encodeURIComponent(p.id)}">
      <div class="card-top"><span class="cat">${esc(t("cats." + p.cat))}</span><span class="region">${esc(regionName(p.region))}</span></div>
      <h3>${esc(L(p.name))}</h3>
      ${compact ? "" : `<p>${esc(L(p.desc)).split(". ")[0]}.</p>`}
      <div class="meta"><span>⏱ ${esc(hoursText(p.visit))}</span><span>🎟 ${esc(feeText(p.fee))}</span>${p.alt ? `<span>⛰ ${p.alt} m</span>` : ""}</div>
    </a>
    <button type="button" class="heart" data-place-toggle="${esc(p.id)}" aria-pressed="${on}" aria-label="${esc(on ? t("place.unsave") : t("place.save"))}">${on ? "♥" : "♡"}</button>
  </article>`;
}
export function routeCard(r) {
  const on = store.hasRoute(r.id);
  return `<article class="card route-card" style="--rc:${r.color}">
    <a class="card-body" href="route.html?id=${encodeURIComponent(r.id)}">
      <div class="card-top"><span class="icon" aria-hidden="true">${r.icon}</span>${typeChips(r.type)}</div>
      <h3>${esc(L(r.name))}</h3>
      <p>${esc(L(r.summary))}</p>
      <div class="meta"><span>📅 ${r.days} ${esc(t("days"))}</span><span>${esc(t("route." + r.difficulty))}</span><span>📍 ${esc(r.start)}</span></div>
    </a>
    <label class="plan-check"><input type="checkbox" data-route-toggle="${esc(r.id)}" ${on ? "checked" : ""}> <span>${esc(on ? t("route.inPlan") : t("route.addPlan"))}</span></label>
  </article>`;
}
export function stopCard(s) {
  const q = `${L(s.name)} ${L(s.area)}`;
  return `<article class="card stop-card kind-${s.kind}">
    <div class="card-top"><span class="cat">${esc(t("kinds." + s.kind))}</span>${priceDots(s.price)}</div>
    <h3>${esc(L(s.name))}</h3>
    <p class="muted small">${esc(L(s.area))}</p>
    <p>${esc(L(s.desc))}</p>
    <a class="link" href="${mapsSearch(q, s.lat, s.lng)}" ${EXT}>${esc(t("common.open"))} · Google Maps ↗</a>
  </article>`;
}
/** Wire heart buttons and route checkboxes inside a container. */
export function bindToggles(root = document) {
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-place-toggle]"); if (!b) return;
    const on = store.togglePlace(b.dataset.placeToggle);
    b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "♥" : "♡"; b.setAttribute("aria-label", on ? t("place.unsave") : t("place.save"));
  });
  root.addEventListener("change", e => {
    const c = e.target.closest("[data-route-toggle]"); if (!c) return;
    const on = store.toggleRoute(c.dataset.routeToggle);
    c.checked = on; const s = c.parentElement.querySelector("span"); if (s) s.textContent = on ? t("route.inPlan") : t("route.addPlan");
  });
}
export function toast(msg) {
  let el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 2200);
}
/** Apply data-t="key" translations in static HTML. */
export function translateStatic(root = document) {
  $$("[data-t]", root).forEach(el => (el.textContent = t(el.dataset.t)));
  $$("[data-t-placeholder]", root).forEach(el => (el.placeholder = t(el.dataset.tPlaceholder)));
}
