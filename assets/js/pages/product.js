import { mountChrome, bindCardActions, statusBadge, recBadge, factorTable, heartBtn, errorState, toast, fxLine, breakdown, $ } from "../ui.js";
import { getOfferByProduct, getProduct, getHistory, getFx } from "../api.js";
import { enrichOffer } from "../intel.js";
import { esc, safeUrl, money, gelText, dateKa, ago, countryName, flag, catLabel, hostOf } from "../format.js";
import { ACTION_HINT } from "../score.js";
import * as wl from "../wishlist.js";

mountChrome("deals");
const root = $("#pd-root");
const id = new URLSearchParams(location.search).get("id");
let E;
bindCardActions(() => E, null);

if (!id) root.innerHTML = errorState("პროდუქტი მითითებული არ არის.");
else load().catch(e => { console.error(e); root.innerHTML = errorState(); });

async function load() {
  const [offer, fxRes, points] = await Promise.all([getOfferByProduct(id), getFx().catch(() => ({ fx: {}, date: null })), getHistory(id).catch(() => null)]);
  if (!offer) {
    // RLS hides expired / out-of-stock offers: say so instead of a blank page
    const p = await getProduct(id).catch(() => null);
    root.innerHTML = `<p class="crumbs"><a href="./">მთავარი</a> / <a href="deals.html">აქციები</a></p><div class="panel" style="margin:20px 0">${p ? `<h1>${esc(p.title)}</h1>` : ""}<p>${statusBadge("EXPIRED")} ეს შეთავაზება აღარ არის აქტიური ან მარაგში აღარ არის.</p>${p ? `<a class="btn btn-ghost" href="${esc(safeUrl(p.product_url))}" target="_blank" rel="noopener noreferrer sponsored">მაღაზიის გვერდი ↗</a>` : ""} <a class="btn btn-primary" href="deals.html">სხვა შეთავაზებები</a></div>`;
    return;
  }
  E = enrichOffer(offer, fxRes.fx, { points });
  render(E, points || [], fxRes);
}

function render(e, points, fxRes) {
  const { offer: o, product: p, store: st } = e;
  const cur = o.currency || "EUR";
  const hasOrig = e.scored.hasOriginal;
  const disc = Math.round(e.scored.discount);
  document.title = `${p.title} — SaleVibes`;
  const r = e.rec, s = e.scored.score;
  const saved = wl.load().items[`offer:${o.product_id}`];

  root.innerHTML = `
  <p class="crumbs"><a href="./">მთავარი</a> / <a href="deals.html">აქციები</a> / <a href="deals.html?cat=${esc(p.category || "")}">${esc(catLabel(p.category))}</a></p>
  <div class="pd">
    <div><div class="pd-media"><span class="media-fallback">${esc(String(p.brand || st.name || "?").charAt(0))}</span>${p.image_url ? `<img src="${esc(safeUrl(p.image_url))}" alt="${esc(p.title)}" width="600" height="600" onerror="this.remove()">` : ""}${heartBtn("offer", o.product_id, p.title, { title: p.title, priceAtSave: o.current_price, currency: cur })}</div></div>
    <div>
      <div class="pd-meta"><span>${esc(st.name || "")} · ${esc(hostOf(p.product_url))}</span><span>${flag(st.country)} ${esc(countryName(st.country))}</span>${p.brand ? `<span>ბრენდი: <b>${esc(p.brand)}</b></span>` : ""}${p.sku ? `<span>SKU: ${esc(p.sku)}</span>` : ""}</div>
      <h1>${esc(p.title)}</h1>
      <div class="card-foot">${statusBadge(e.status)}<span>ბოლო შემოწმება: ${esc(ago(o.last_seen_at))} (${esc(dateKa(o.last_seen_at))}) · წყარო: მაღაზიის საიტის ავტომატური სკანირება</span></div>
      <div class="price-box">
        <div><span>საწყისი ფასი</span><b>${hasOrig ? `<s>${money(o.original_price, cur)}</s>` : "<span class='muted' style='font-size:15px'>მაღაზია არ უთითებს</span>"}</b></div>
        <div><span>${hasOrig ? "ფასი ფასდაკლებით" : "მიმდინარე ფასი"}</span><b>${money(o.current_price, cur)}</b>${hasOrig ? ` <span style="color:var(--accent);font-weight:700">−${disc}%</span>` : ""}</div>
        <div class="hl"><span>${e.landed.isFinal ? "საბოლოო ფასი საქართველოში" : "სავარაუდო ფასი საქართველოში"}</span><b>${e.landed.total ? `≈ ${gelText(e.landed.total)}` : "—"}</b></div>
      </div>
      <div class="decision">
        <div class="ring" style="--v:${s ?? 0}"><span>${s ?? "—"}</span></div>
        <div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${recBadge(r)}<span class="muted">${esc(ACTION_HINT[r.action])}</span></div><ul>${r.reasons.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <button type="button" class="link" style="background:none;border:0;padding:0;margin-top:8px" data-score="1">რატომ ეს ქულა? →</button></div>
      </div>
      <div class="card-actions" style="margin-top:16px"><a class="btn btn-primary" href="${esc(safeUrl(p.product_url))}" target="_blank" rel="noopener noreferrer sponsored">მაღაზიაში ნახვა ↗</a><a class="btn btn-ghost" href="tools.html?price=${encodeURIComponent(o.current_price)}&cur=${encodeURIComponent(cur)}&origin=${encodeURIComponent(st.country || "")}&cat=${encodeURIComponent(p.category || "")}#calc">ზუსტი გამოთვლა →</a></div>
      <form class="panel" id="target-form" style="margin-top:16px"><label class="field">სამიზნე ფასი (${esc(cur)}) <span class="hint">— შეგატყობინებთ ამ ბრაუზერში, როცა ფასი ჩამოვა</span><span class="form-row"><input id="target" type="number" min="0" step="0.01" inputmode="decimal" value="${saved?.targetPrice ?? ""}" placeholder="მაგ. ${Math.round(o.current_price * 0.85)}"><button class="btn btn-dark" type="submit">შენახვა</button></span></label></form>
    </div>
  </div>

  <section class="panel" aria-labelledby="hist-h">
    <div class="panel-head"><h2 id="hist-h">ფასის ისტორია</h2><div class="seg" role="group" aria-label="პერიოდი"><button type="button" data-range="30" aria-pressed="true">30 დღე</button><button type="button" data-range="90" aria-pressed="false">90 დღე</button></div></div>
    <div id="hist"></div>
  </section>

  <section class="panel" aria-labelledby="land-h">
    <div class="panel-head"><h2 id="land-h">ღირებულება საქართველოში</h2>${e.landed.isFinal ? `<span class="label-final">დადასტურებული</span>` : `<span class="label-est">შეფასება — არა გარანტირებული ფასი</span>`}</div>
    <p class="fine">${esc(fxLine(fxRes))}</p>
    ${breakdown(e.landed)}
  </section>

  <section class="panel" aria-labelledby="score-h">
    <div class="panel-head"><h2 id="score-h">Deal Score — ფაქტორები</h2></div>
    ${factorTable(e.scored)}
  </section>`;

  const target = $("#target-form");
  target.addEventListener("submit", ev => {
    ev.preventDefault();
    const v = Number($("#target").value);
    if (!wl.has("offer", o.product_id)) wl.toggle("offer", o.product_id, { title: p.title, priceAtSave: o.current_price, currency: cur });
    wl.setTarget("offer", o.product_id, v);
    document.querySelectorAll("[data-heart]").forEach(b => { b.setAttribute("aria-pressed", "true"); b.textContent = "♥"; });
    toast(v > 0 ? `სამიზნე ფასი შენახულია: ${money(v, cur)}` : "სამიზნე ფასი წაიშალა");
  });

  const hist = $("#hist");
  const draw = days => { hist.innerHTML = historyView(points, o, days); root.querySelectorAll("[data-range]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.range === String(days)))); };
  root.querySelectorAll("[data-range]").forEach(b => b.addEventListener("click", () => draw(Number(b.dataset.range))));
  draw(30);
}

function historyView(points, o, days) {
  const now = Date.now(), from = now - days * 864e5;
  const all = (points || []).map(p => ({ t: new Date(p.observed_at).getTime(), v: Number(p.price) })).filter(p => p.v > 0);
  // the current price is a real observation too (last_seen_at)
  if (o.last_seen_at) all.push({ t: new Date(o.last_seen_at).getTime(), v: Number(o.current_price) });
  all.sort((a, b) => a.t - b.t);
  const inRange = all.filter(p => p.t >= from);
  const cur = o.currency || "EUR";
  const firstSeen = all[0]?.t;
  const spanDays = firstSeen ? Math.round((now - firstSeen) / 864e5) : 0;
  if (inRange.length < 2) {
    return `<p class="empty">ამ პერიოდში საკმარისი ისტორიული მონაცემი ჯერ არ გვაქვს${firstSeen ? ` — პროდუქტს ${esc(dateKa(firstSeen))}-დან ვაკვირდებით` : ""}. ხელოვნურ ისტორიას არ ვაჩენთ.</p>`;
  }
  const min = Math.min(...inRange.map(p => p.v)), max = Math.max(...inRange.map(p => p.v));
  const first = inRange[0].v, last = inRange[inRange.length - 1].v;
  const change = first ? ((last - first) / first) * 100 : 0;
  const W = 720, H = 220, pl = 52, pr = 12, pt = 12, pb = 28;
  const lo = min === max ? min * 0.95 : min - (max - min) * 0.15, hi = min === max ? max * 1.05 : max + (max - min) * 0.15;
  const x = t => pl + ((t - Math.max(from, firstSeen)) / Math.max(1, now - Math.max(from, firstSeen))) * (W - pl - pr);
  const y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  // step line: a price holds until the next observation
  let d = `M${x(inRange[0].t).toFixed(1)},${y(inRange[0].v).toFixed(1)}`;
  for (let i = 1; i < inRange.length; i++) d += ` H${x(inRange[i].t).toFixed(1)} V${y(inRange[i].v).toFixed(1)}`;
  d += ` H${x(now).toFixed(1)}`;
  const area = `${d} V${H - pb} H${x(inRange[0].t).toFixed(1)} Z`;
  const ticks = [lo + (hi - lo) * 0.1, (lo + hi) / 2, hi - (hi - lo) * 0.1];
  const dates = [Math.max(from, firstSeen), now];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="ფასის ისტორია ბოლო ${days} დღე: მინიმუმი ${money(min, cur)}, მიმდინარე ${money(last, cur)}">
      ${ticks.map(v => `<line class="axis" x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}"/><text class="lbl" x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${esc(money(Math.round(v * 100) / 100, cur))}</text>`).join("")}
      <path class="area" d="${area}"/><path class="line" d="${d}"/>
      <line class="min" x1="${pl}" x2="${W - pr}" y1="${y(min)}" y2="${y(min)}"/>
      ${inRange.map(p => `<circle cx="${x(p.t).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3"><title>${esc(dateKa(p.t))}: ${esc(money(p.v, cur))}</title></circle>`).join("")}
      ${dates.map((t, i) => `<text class="lbl" x="${i ? W - pr : pl}" y="${H - 8}" text-anchor="${i ? "end" : "start"}">${esc(dateKa(t))}</text>`).join("")}
    </svg>
    <div class="kpis"><div><span>მიმდინარე ფასი</span><b>${money(last, cur)}</b></div><div><span>ისტორიული მინიმუმი</span><b>${money(min, cur)}</b></div><div><span>ცვლილება ${days} დღეში</span><b>${change > 0 ? "+" : ""}${change.toFixed(1)}%</b></div><div><span>ბოლო განახლება</span><b>${esc(dateKa(all[all.length - 1].t))}</b></div></div>
    <p class="fine">${inRange.length} დაკვირვება. პროდუქტს ვაკვირდებით ${spanDays} დღეა${spanDays < days ? ` — ${days} დღის სრული ისტორია ჯერ არ არსებობს` : ""}. ისტორია ჩაიწერება მხოლოდ ფასის ცვლილებისას ან ახალი პროდუქტის აღმოჩენისას.</p>`;
}
