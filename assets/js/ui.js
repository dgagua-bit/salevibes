/** Shared UI: header, footer, cards, dialogs, state messages. */
import { esc, safeUrl, money, gelText, ago, dateKa, countryName, flag, catLabel, hostOf } from "./format.js";
import { ACTION_LABEL, ACTION_HINT, STATUS_LABEL, STATUS_HINT, dealStatus } from "./score.js";
import * as wl from "./wishlist.js";

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const NAV = [
  { href: "deals.html", label: "აქციები", id: "deals" },
  { href: "categories.html", label: "კატეგორიები", id: "categories" },
  { href: "brands.html", label: "ბრენდები", id: "brands" },
  { href: "stores.html", label: "მაღაზიები", id: "stores" },
  { href: "tools.html", label: "ინსტრუმენტები", id: "tools" }
];
const EXT = 'target="_blank" rel="noopener noreferrer sponsored"';

/* ---------- header / footer ---------- */
export function mountChrome(active) {
  const h = $("[data-sv-header]");
  if (h) {
    h.className = "site-header" + (active === "home" ? " over" : "");
    h.innerHTML = `<div class="wrap header-row">
      <a class="logo" href="./" aria-label="Sale Vibes — მთავარი"><img class="logo-img" src="assets/img/logo-dark.png" alt="Sale Vibes" width="425" height="281"></a>
      <nav class="main-nav" id="main-nav" aria-label="მთავარი ნავიგაცია"><ul><li class="nav-search"><form action="deals.html" role="search"><label class="sr-only" for="mq">ძიება</label><input id="mq" name="q" type="search" placeholder="ძიება: პროდუქტი, ბრენდი, SKU…"></form></li>${NAV.map(n => `<li><a href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("")}</ul></nav>
      <div class="header-tools">
        <form class="header-search" action="deals.html" role="search"><label class="sr-only" for="hq">ძიება</label><input id="hq" name="q" type="search" placeholder="პროდუქტი, ბრენდი, SKU…" autocomplete="off"><button type="submit" aria-label="ძიება">⌕</button></form>
        <a class="saved-link" href="saved.html"${active === "saved" ? ' aria-current="page"' : ""} aria-label="რჩეულები"><span aria-hidden="true">♡</span><span class="saved-txt">რჩეულები</span> <b data-saved-count>${wl.count()}</b></a>
        <button class="nav-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="მენიუ"><i></i><i></i><i></i></button>
      </div></div>`;
    const btn = $(".nav-toggle", h), nav = $("#main-nav", h);
    btn.addEventListener("click", () => { const open = btn.getAttribute("aria-expanded") !== "true"; btn.setAttribute("aria-expanded", String(open)); nav.classList.toggle("open", open); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); } });
    const q = new URLSearchParams(location.search).get("q");
    if (q && active === "deals") $("#hq", h).value = q;
  }
  const f = $("[data-sv-footer]");
  if (f) {
    f.className = "site-footer";
    f.innerHTML = `<div class="wrap footer-grid">
      <div><a class="logo" href="./" aria-label="Sale Vibes — მთავარი"><img class="logo-img" src="assets/img/logo-light.png" alt="Sale Vibes" width="425" height="281"></a>
      <p>Shopping Intelligence საქართველოსთვის: რეალური აქციები, რეალური ფასები, ჩამოტანის ღირებულება და ჭკვიანი გადაწყვეტილება. SaleVibes არ ყიდის პროდუქტს.</p></div>
      <nav aria-label="ქვედა ნავიგაცია"><ul>${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}<li><a href="saved.html">რჩეულები და შეტყობინებები</a></li></ul></nav>
      <div class="footer-note"><p>ფასები და პირობები ყიდვამდე მაღაზიის საიტზე გადაამოწმე. „სავარაუდო ფასი საქართველოში“ შეფასებაა და არა გარანტია.</p><p>ზოგიერთი ბმული შეიძლება იყოს პარტნიორული.</p><p>© ${new Date().getFullYear()} SaleVibes</p></div></div>`;
  }
  window.addEventListener("sv:wishlist", () => $$("[data-saved-count]").forEach(el => (el.textContent = wl.count())));
}

/* ---------- small pieces ---------- */
export const statusBadge = s => `<span class="status status-${s.toLowerCase()}" title="${esc(STATUS_HINT[s])}">${esc(STATUS_LABEL[s])}</span>`;
export const recBadge = r => `<span class="rec rec-${r.action.toLowerCase()}" title="${esc(ACTION_HINT[r.action])}">${esc(ACTION_LABEL[r.action])}</span>`;
export function scorePill(score, attrs = "") {
  if (score === null || score === undefined) return `<button type="button" class="score-pill na" ${attrs}><span>შეთავაზების ქულა</span><b>—</b></button>`;
  return `<button type="button" class="score-pill" ${attrs} aria-label="შეთავაზების ქულა ${score} — ნახე რატომ"><span>შეთავაზების ქულა</span><b>${score}</b><i style="--w:${score}%"></i></button>`;
}
export function heartBtn(type, id, label, snapshot) {
  const on = wl.has(type, id);
  return `<button type="button" class="heart" data-heart="${esc(type)}:${esc(id)}" data-snap="${esc(JSON.stringify(snapshot || {}))}" aria-pressed="${on}" aria-label="${esc(label)} — რჩეულებში შენახვა">${on ? "♥" : "♡"}</button>`;
}
export const storeMark = (name, logo) => logo
  ? `<span class="store-mark has-logo" aria-hidden="true"><img src="${esc(safeUrl(logo))}" alt="" loading="lazy" onerror="this.remove()"></span>`
  : `<span class="store-mark" aria-hidden="true">${esc(String(name || "?").trim().charAt(0).toUpperCase())}</span>`;
let STORE_LOGOS = new Map();
/** Pages call this once stores are loaded so deal cards can show store logos. */
export function setStoreLogos(stores) { STORE_LOGOS = new Map((stores || []).filter(s => s.logo_url).flatMap(s => [[s.slug, s.logo_url], [s.name, s.logo_url]])); }
const logoForDeal = d => STORE_LOGOS.get(d.store_slug) || STORE_LOGOS.get(d.store) || null;

/* ---------- product offer card ---------- */
export function offerCard(e) {
  const { offer: o, product: p, store: st } = e;
  const cur = o.currency || "EUR";
  const hasOrig = Number(o.original_price) > Number(o.current_price);
  const disc = hasOrig ? Math.round((1 - o.current_price / o.original_price) * 100) : 0;
  const href = `product.html?id=${encodeURIComponent(o.product_id)}`;
  const l = e.landed;
  return `<article class="card offer-card">
    <a class="card-media" href="${href}" tabindex="-1" aria-hidden="true">
      ${p.image_url ? `<img src="${esc(safeUrl(p.image_url))}" alt="" loading="lazy" decoding="async" width="400" height="400" onerror="this.remove()">` : ""}
      <span class="media-fallback">${esc(String(p.brand || st.name || "?").charAt(0))}</span>
      ${disc ? `<span class="disc-badge">−${disc}%</span>` : ""}
    </a>
    ${heartBtn("offer", o.product_id, p.title, { title: p.title, priceAtSave: o.current_price, currency: cur })}
    <div class="card-body">
      <div class="card-meta">${storeMark(st.name, st.logo_url)}<span>${esc(st.name || "")}</span><span class="dot">·</span><span>${flag(st.country)} ${esc(countryName(st.country))}</span></div>
      ${p.brand ? `<div class="brand-line">${esc(p.brand)}</div>` : ""}
      <h3 class="card-title"><a href="${href}">${esc(p.title || "")}</a></h3>
      <dl class="prices">
        ${hasOrig ? `<div><dt>საწყისი ფასი</dt><dd><s>${money(o.original_price, cur)}</s></dd></div>` : ""}
        <div class="now"><dt>${hasOrig ? "ფასი ფასდაკლებით" : "ფასი"}</dt><dd>${money(o.current_price, cur)} ${disc ? `<em>−${disc}%</em>` : ""}</dd></div>
        <div class="ge"><dt>${l.isFinal ? "საბოლოო ფასი საქართველოში" : "სავარაუდო ფასი საქართველოში"}</dt><dd>${l.total ? `≈ ${gelText(l.total)}` : "<span class='muted'>კურსი მიუწვდომელია</span>"}</dd></div>
      </dl>
      <div class="card-intel">${scorePill(e.scored.score, `data-score="${esc(o.product_id)}"`)}${recBadge(e.rec)}</div>
      <div class="card-foot">${statusBadge(e.status)}<span class="checked">შემოწმდა ${esc(ago(o.last_seen_at))}</span></div>
      <div class="card-actions"><a class="btn btn-ghost" href="${href}">ანალიზი</a><a class="btn btn-primary" href="${esc(safeUrl(p.product_url))}" ${EXT}>მაღაზიაში ↗</a></div>
    </div></article>`;
}

/* ---------- store-level promotion card ---------- */
const PHOTOS = {
  fashion: ["photo-1542272604-787c3835535d", "photo-1483985988355-763728e1935b"],
  luxury: ["photo-1539109136881-3be0616acf4b", "photo-1483985988355-763728e1935b"],
  shoes: ["photo-1542291026-7eec264c27ff"], accessories: ["photo-1511499767150-a48a237f0083"],
  watches: ["photo-1511499767150-a48a237f0083"], beauty: ["photo-1516257984-b1b4d707412e"],
  home: ["photo-1483985988355-763728e1935b"], other: ["photo-1483985988355-763728e1935b", "photo-1539109136881-3be0616acf4b"]
};
export const photoFor = (cat, i = 0) => { const l = PHOTOS[String(cat || "").toLowerCase()] || PHOTOS.other; return `https://images.unsplash.com/${l[i % l.length]}?auto=format&fit=crop&w=800&q=75`; };

export function dealCard(d, i = 0) {
  const st = dealStatus(d);
  const url = safeUrl(d.sale_url);
  const disc = d.discount_percent ? Math.round(d.discount_percent) : null;
  const logo = logoForDeal(d);
  return `<article class="card deal-card">
    <a class="card-media" href="${esc(url)}" ${EXT} tabindex="-1" aria-hidden="true">
      <span class="media-fallback">${logo ? `<img class="fallback-logo" src="${esc(safeUrl(logo))}" alt="" loading="lazy" onerror="this.remove()">` : esc(String(d.store || "?").charAt(0))}</span>
      ${d.image_url ? `<img src="${esc(safeUrl(d.image_url))}" alt="${esc(d.store)} — აქციის ფოტო" loading="lazy" decoding="async" onerror="this.remove()">` : ""}
      <span class="disc-badge">${disc ? `−${disc}%` : "SALE"}</span>
    </a>
    ${heartBtn("deal", d.id, d.store, { title: `${d.store}: ${d.title}` })}
    <div class="card-body">
      <div class="card-meta"><span>${flag(d.country)} ${esc(countryName(d.country))}</span><span>↗ ${esc(catLabel(d.category))}</span></div>
      <h3 class="deal-store with-logo">${logo ? storeMark(d.store, logo) : ""}${esc(d.store)}</h3>
      <p class="deal-line">${esc(d.title)}</p>
      ${d.description ? `<p class="deal-desc">${esc(d.description)}</p>` : ""}
      ${d.promo_code ? `<button class="code" type="button" data-code="${esc(d.promo_code)}"><span>კოდი</span><b>${esc(d.promo_code)}</b><i aria-hidden="true">⧉</i></button>` : ""}
      <div class="card-intel"><button type="button" class="score-pill promo" data-deal-score="${esc(d.id)}" aria-label="აქციის ქულა ${Math.round(d.deal_score || 0)} — განმარტება"><span>აქციის ქულა</span><b>${Math.round(d.deal_score || 0)}</b><i style="--w:${Math.round(d.deal_score || 0)}%"></i></button><span class="rec rec-insufficient" title="მაღაზიის საერთო აქციაა — კონკრეტული პროდუქტის ფასი არ გვაქვს">რეკომენდაციისთვის მონაცემები არასაკმარისია</span></div>
      <div class="card-foot">${statusBadge(st)}<span class="checked">${d.end_date ? `მთავრდება ${esc(dateKa(d.end_date))} · ` : ""}შემოწმდა ${esc(ago(d.last_checked) || "—")}</span></div>
      <div class="card-actions"><a class="btn btn-primary" href="${esc(url)}" ${EXT}>შეთავაზების ნახვა ↗</a></div>
    </div>
  </article>`;
}

/* ---------- dialog ---------- */
let dlg;
export function openDialog(title, html) {
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.className = "sv-dialog";
    dlg.setAttribute("aria-labelledby", "dlg-title");
    dlg.innerHTML = `<div class="dlg-head"><h2 id="dlg-title"></h2><button type="button" class="icon-btn" data-close aria-label="დახურვა">×</button></div><div class="dlg-body"></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  }
  $("#dlg-title", dlg).textContent = title;
  $(".dlg-body", dlg).innerHTML = html;
  dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
}

export function factorTable(scored) {
  const rows = scored.factors.map(f => `<tr class="${f.available ? "" : "na"}"><th scope="row">${esc(f.label)}<small>${esc(f.note || "")}</small></th><td>${f.available ? `${Math.round(f.points * 10) / 10} / ${f.max}` : "—"}</td></tr>`).join("");
  return `<table class="factor-table"><caption class="sr-only">ქულის ფაქტორები</caption><tbody>${rows}
    ${scored.suspicious ? `<tr class="neg"><th scope="row">საეჭვო ფასდაკლება<small>ფასი ცოტა ხნის წინ მნიშვნელოვნად დაბალი იყო</small></th><td>−25</td></tr>` : ""}</tbody></table>
    <p class="fine">ქულა = მიღებული ქულების წილი იმ ფაქტორებში, რომლებზეც მონაცემი გვაქვს (დაფარვა ${Math.round(scored.coverage * 100)}%). „—“ ნიშნავს, რომ მონაცემი ჯერ არ არსებობს და ქულაში არ ითვლება. თუ დაფარვა 60%-ზე ნაკლებია, ქულას არ ვაჩვენებთ.</p>`;
}
export function scoreDialog(e) {
  openDialog(e.scored.score === null ? "შეთავაზების ქულა — მონაცემები არასაკმარისია" : `შეთავაზების ქულა ${e.scored.score}/100`,
    `<p class="dlg-sub">${esc(e.product.title || "")}</p><div class="rec-box">${recBadge(e.rec)}<ul>${e.rec.reasons.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>${factorTable(e.scored)}<p><a class="btn btn-ghost" href="product.html?id=${encodeURIComponent(e.offer.product_id)}">სრული ანალიზი და ფასის ისტორია →</a></p>`);
}
export function dealScoreDialog(d) {
  const disc = d.discount_percent == null ? null : Number(d.discount_percent);
  const rows = [["ბაზა: აქტიური, ხელით გადამოწმებული აქცია", 60]];
  let sum = 60;
  if (disc == null) { rows.push(["ფასდაკლების % მითითებული არ არის", 5]); sum += 5; } else { const p = Math.round(disc / 2.5); rows.push([`ფასდაკლება −${disc}%`, p]); sum += p; }
  if (d.promo_code && disc != null) { rows.push(["დამატებითი პრომოკოდი", 4]); sum += 4; }
  if (sum > 95) { rows.push(["ზედა ზღვარი 95", 95 - sum]); sum = 95; }
  const a = Math.round(Number(d.deal_score) || 0);
  if (a !== sum) rows.push(["რედაქციის კორექტირება", a - sum]);
  openDialog(`${d.store} — აქციის ქულა ${a}/100`, `<p class="dlg-sub">${esc(d.title)}</p>
    <table class="factor-table"><tbody>${rows.map(([l, p]) => `<tr><th scope="row">${esc(l)}</th><td>${p > 0 ? "+" : ""}${p}</td></tr>`).join("")}<tr class="sum"><th scope="row">სულ</th><td>${a}</td></tr></tbody></table>
    <p class="fine">ეს არის მაღაზიის <b>საერთო აქციის</b> ქულა და ეყრდნობა მხოლოდ ფასდაკლების სიდიდეს და პრომოკოდს. კონკრეტული ნივთის ფასი, ისტორია და ჩამოტანის ღირებულება აქ არ ვიცით, ამიტომ „იყიდე / მოიცადე / გამოტოვე“ რეკომენდაციას არ ვაძლევთ.</p>`);
}

/* ---------- global card interactions ---------- */
export function bindCardActions(getEnriched, getDeal) {
  document.addEventListener("click", async ev => {
    const t = ev.target;
    const h = t.closest("[data-heart]");
    if (h) {
      const [type, ...rest] = h.dataset.heart.split(":"); const id = rest.join(":");
      let snap = {}; try { snap = JSON.parse(h.dataset.snap || "{}"); } catch { /* ignore */ }
      const on = wl.toggle(type, id, snap);
      $$(`[data-heart="${CSS.escape(h.dataset.heart)}"]`).forEach(b => { b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "♥" : "♡"; });
      toast(on ? "შენახულია რჩეულებში" : "ამოღებულია რჩეულებიდან");
      return;
    }
    const sc = t.closest("[data-score]");
    if (sc && getEnriched) { const e = getEnriched(sc.dataset.score); if (e) scoreDialog(e); return; }
    const ds = t.closest("[data-deal-score]");
    if (ds && getDeal) { const d = getDeal(ds.dataset.dealScore); if (d) dealScoreDialog(d); return; }
    const code = t.closest(".code[data-code]");
    if (code) {
      try { await navigator.clipboard.writeText(code.dataset.code); code.classList.add("copied"); $("i", code).textContent = "✓"; toast("კოდი დაკოპირდა"); setTimeout(() => { code.classList.remove("copied"); $("i", code).textContent = "⧉"; }, 1600); }
      catch { toast("კოპირება ვერ მოხერხდა — მონიშნე კოდი ხელით"); }
    }
  });
}

let toastTimer;
export function toast(msg) {
  let el = $("#sv-toast");
  if (!el) { el = document.createElement("div"); el.id = "sv-toast"; el.className = "toast"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

export const skeleton = (n = 4, cls = "card") => Array.from({ length: n }, () => `<div class="${cls} skeleton" aria-hidden="true"></div>`).join("");
export const emptyState = (msg, action = "") => `<div class="empty">${msg}${action}</div>`;
export const errorState = (msg = "მონაცემები ვერ ჩაიტვირთა. შეამოწმე ინტერნეტი და განაახლე გვერდი.") => `<div class="empty error" role="alert">${esc(msg)} <button type="button" class="btn btn-ghost" onclick="location.reload()">თავიდან ცდა</button></div>`;

export function fxLine(fxRes) {
  if (!fxRes || !Object.keys(fxRes.fx).length) return "კურსი მიუწვდომელია";
  return `ეროვნული ბანკის კურსი${fxRes.date ? ` (${dateKa(fxRes.date)})` : ""}: ` + ["EUR", "USD", "GBP"].filter(c => fxRes.fx[c]).map(c => `1 ${c} = ${fxRes.fx[c].toFixed(4)} ₾`).join(" · ");
}

/* ---------- landed-cost breakdown table ---------- */
export function breakdown(l) {
  if (!l.total) return `<p class="empty">გამოთვლა ვერ მოხერხდა: ${esc(l.missing.join(", ") || "მონაცემი აკლია")}.</p>`;
  return `<div class="table-scroll"><table class="breakdown"><tbody>${l.lines.map(x => `<tr><th scope="row">${esc(x.label)}</th><td>${gelText(x.gel)}</td></tr>`).join("")}
    <tr class="total"><th scope="row">სულ ${l.isFinal ? "" : "დაახლოებით"}</th><td>${gelText(l.total)}</td></tr></tbody></table></div>
    ${l.customs?.taxable ? `<p class="fine">განბაჟდება, რადგან: ${esc(l.customs.reasons.join(", "))}.</p>` : ""}
    ${l.assumptions.length ? `<ul class="assume">${l.assumptions.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}`;
}

