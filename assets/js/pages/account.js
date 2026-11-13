import { mountChrome, offerCard, dealCard, bindCardActions, emptyState, errorState, skeleton, toast, $, $$ } from "../ui.js";
import { loadAll } from "../data.js";
import { sb } from "../api.js";
import { compareItem, compareCard, COMPARE_CSS } from "../compare.js";
import { esc, safeUrl, money, dateKa, ago, hostOf, countryName, flag } from "../format.js";
import { WORLDS, EMAIL_ALERTS_LIVE } from "../config.js";
import * as wl from "../wishlist.js";
import * as A from "../auth.js";

mountChrome("account");
document.head.insertAdjacentHTML("beforeend", `<style>${COMPARE_CSS}</style>`);
let data = null, interests = [], saved = [], fyCount = 0, svFilter = "";
const histories = new Map();
bindCardActions(id => data?.byProduct.get(String(id)), id => data?.dealById.get(String(id)));

const say = (t, kind = "") => { const el = $("#acct-msg"); el.textContent = t; el.className = "form-status acct-msg wrap " + kind; };
const emailOk = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

/* ================= signed out ================= */
function showAuth(tab = "in") {
  $("#cab").hidden = true; $("#auth-box").hidden = false;
  $("#acct-h").textContent = { up: "ანგარიშის შექმნა", reset: "პაროლის აღდგენა", newpass: "ახალი პაროლი" }[tab] || "შესვლა";
  ["in", "up", "reset", "newpass"].forEach(t => ($(`#f-${t}`).hidden = t !== tab));
  $$("#auth-box .seg [data-tab]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tab === tab)));
  $("#auth-box .seg").hidden = tab === "reset" || tab === "newpass";
}
$$("#auth-box [data-tab]").forEach(b => b.addEventListener("click", () => { say(""); showAuth(b.dataset.tab); }));

async function busy(form, fn) {
  const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
  try { await fn(); } catch (e) { say(e.message, "err"); } finally { btn.disabled = false; }
}
$("#f-in").addEventListener("submit", e => { e.preventDefault(); busy(e.target, async () => {
  const em = $("#in-email").value.trim().toLowerCase(), pw = $("#in-pass").value;
  if (!emailOk(em) || pw.length < 8) throw new Error("ჩაწერე სწორი ელფოსტა და პაროლი (მინიმუმ 8 სიმბოლო).");
  await A.signIn(em, pw); say(""); await showCabinet();
}); });
$("#f-up").addEventListener("submit", e => { e.preventDefault(); busy(e.target, async () => {
  const em = $("#up-email").value.trim().toLowerCase(), pw = $("#up-pass").value;
  if (!emailOk(em)) throw new Error("ჩაწერე სწორი ელფოსტა.");
  if (pw.length < 8) throw new Error("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო.");
  if (!$("#up-consent").checked) throw new Error("რეგისტრაციისთვის საჭიროა თანხმობა.");
  const r = await A.signUp(em, pw);
  if (r.session) { await showCabinet(); return; }
  say(`✓ დადასტურების ბმული გამოგიგზავნეთ: ${em}. გახსენი წერილი და დააჭირე ბმულს — შემდეგ აქ შეხვალ.`, "ok");
  showAuth("in"); $("#in-email").value = em;
}); });
$("#f-reset").addEventListener("submit", e => { e.preventDefault(); busy(e.target, async () => {
  const em = $("#re-email").value.trim().toLowerCase();
  if (!emailOk(em)) throw new Error("ჩაწერე სწორი ელფოსტა.");
  await A.resetPassword(em); say("✓ თუ ეს ელფოსტა დარეგისტრირებულია, აღდგენის ბმული გამოგიგზავნეთ.", "ok");
}); });
$("#f-newpass").addEventListener("submit", e => { e.preventDefault(); busy(e.target, async () => {
  const pw = $("#np-pass").value; if (pw.length < 8) throw new Error("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო.");
  await A.updatePassword(pw); say("✓ პაროლი შეიცვალა.", "ok"); await showCabinet();
}); });

/* ================= tabs ================= */
const PANES = ["for-you", "saved", "add-link", "interests", "settings"];
function showPane(id) {
  if (!PANES.includes(id)) id = "for-you";
  PANES.forEach(p => ($("#" + p).hidden = p !== id));
  $$(".cab-tabs [data-pane]").forEach(a => a.setAttribute("aria-selected", String(a.dataset.pane === id)));
}
window.addEventListener("hashchange", () => { if (!$("#cab").hidden) showPane(location.hash.slice(1)); });

/* ================= cabinet ================= */
async function showCabinet() {
  const user = await A.currentUser();
  if (!user) return showAuth();
  $("#auth-box").hidden = true; $("#cab").hidden = false;
  const name = user.email.split("@")[0];
  $("#cab-hello").textContent = `გამარჯობა, ${name}`;
  $("#me-email").textContent = user.email; $("#me-email-top").textContent = user.email;
  showPane(location.hash.slice(1));
  $("#fy").innerHTML = `<div class="grid">${skeleton(4)}</div>`;
  $("#sv").innerHTML = `<div class="sv-grid">${skeleton(3, "sv-card skeleton")}</div>`;
  try { const moved = await A.syncLocalWishlist(wl.load()); if (moved) toast(`ამ ბრაუზერის რჩეულები (${moved}) კაბინეტში გადავიდა`); } catch { /* keep going */ }
  try { [data, interests, saved] = await Promise.all([loadAll(), A.getInterests(), A.listSaved()]); }
  catch (e) { console.error(e); $("#fy").innerHTML = errorState(); return; }
  renderInterests(); await renderForYou(); renderSaved(); renderSettings(); loadHistories();
  const next = new URLSearchParams(location.search).get("next");
  if (next && /^[a-z]+\.html/.test(next)) { say("შესული ხარ. ", "ok"); $("#acct-msg").insertAdjacentHTML("beforeend", `<a class="link" href="${esc(next)}">დაბრუნება წინა გვერდზე →</a>`); }
}

/* ---- stats ---- */
function currentOf(it) {
  if (it.kind === "offer") { const e = data.byProduct.get(String(it.ref)); return e ? { price: Number(e.offer.current_price), currency: e.offer.currency, title: e.product.title, url: `product.html?id=${encodeURIComponent(it.ref)}`, image: e.product.image_url, store: e.store.name } : null; }
  if (it.kind === "deal") { const d = data.dealById.get(String(it.ref)); return d ? { price: null, title: d.title, url: d.sale_url, image: d.image_url, store: d.store } : null; }
  return { price: it.last_price != null ? Number(it.last_price) : null, currency: it.currency, title: it.title, url: it.url, image: it.image_url, store: it.store || (it.url ? hostOf(it.url) : "") };
}
const isHit = it => { const c = currentOf(it); return c && c.price != null && it.target_price && c.price <= Number(it.target_price); };
function renderStats() {
  $("#st-saved").textContent = saved.length;
  $("#st-track").textContent = saved.filter(it => it.kind !== "deal" && (it.kind !== "link" || it.track_status === "tracking")).length;
  $("#st-hit").textContent = saved.filter(isHit).length;
  $("#st-fy").textContent = fyCount;
  $("#tab-saved-n").textContent = saved.length || "";
}

/* ---- interests ---- */
const has = (kind, v) => interests.some(i => i.kind === kind && i.value.toLowerCase() === String(v).toLowerCase());
const storeName = slug => (data.stores || []).find(s => s.slug === slug)?.name || slug;
function renderInterests() {
  $("#int-cat").innerHTML = WORLDS.map(w => { const on = has("category", w.key); return `<button type="button" class="int-tile" data-int-kind="category" data-int-value="${w.key}" aria-pressed="${on}"><b>${esc(w.title)}</b><small>${esc(w.sub)}</small><span class="tick">${on ? "✓ მონიშნულია" : "+ მონიშვნა"}</span></button>`; }).join("");
  const chip = (kind, value, label) => `<button type="button" class="chip" data-int-kind="${kind}" data-int-value="${esc(value)}" aria-pressed="true" aria-label="${esc(label)} — მოხსნა">${esc(label)} ×</button>`;
  const brands = interests.filter(i => i.kind === "brand"), stores = interests.filter(i => i.kind === "store");
  $("#int-brand").innerHTML = brands.map(b => chip("brand", b.value, b.value)).join("") || `<span class="fine">ჯერ არცერთი</span>`;
  $("#int-store").innerHTML = stores.map(s => chip("store", s.value, storeName(s.value))).join("") || `<span class="fine">ჯერ არცერთი</span>`;
  const allBrands = new Set(["Speedo", "KIKO Milano"]); (data.stores || []).forEach(s => (s.brands || []).forEach(b => allBrands.add(b))); data.enriched.forEach(e => e.product.brand && allBrands.add(e.product.brand));
  $("#br-list").innerHTML = [...allBrands].sort((a, b) => a.localeCompare(b)).map(b => `<option value="${esc(b)}">`).join("");
  $("#st-list").innerHTML = (data.stores || []).map(s => `<option value="${esc(s.name)}">`).join("");
  const labels = [...interests.filter(i => i.kind === "category").map(i => WORLDS.find(w => w.key === i.value)?.title || i.value), ...brands.map(b => b.value), ...stores.map(s => storeName(s.value))];
  $("#int-strip").innerHTML = labels.length ? `შენი ინტერესები: ${labels.map(l => `<span>${esc(l)}</span>`).join("")}<a href="#interests">შეცვლა</a>` : "";
}
async function toggleInterest(kind, value, on) {
  try { await A.setInterest(kind, value, on); interests = on ? [...interests, { kind, value }] : interests.filter(i => !(i.kind === kind && i.value === value)); renderInterests(); renderForYou(); }
  catch (err) { toast(err.message); }
}
document.addEventListener("click", e => { const c = e.target.closest("[data-int-kind]"); if (c) toggleInterest(c.dataset.intKind, c.dataset.intValue, c.getAttribute("aria-pressed") !== "true"); });
$("#f-brand").addEventListener("submit", e => { e.preventDefault(); const v = $("#br-in").value.trim(); if (!v) return; $("#br-in").value = ""; toggleInterest("brand", v, true); });
$("#f-store").addEventListener("submit", e => { e.preventDefault(); const v = $("#st-in").value.trim().toLowerCase(); const s = (data.stores || []).find(x => x.name.toLowerCase() === v || x.slug === v); if (!s) { toast("ასეთი მაღაზია სიაში არ არის"); return; } $("#st-in").value = ""; toggleInterest("store", s.slug, true); });

/* ---- for you ---- */
async function renderForYou() {
  const cats = interests.filter(i => i.kind === "category").map(i => i.value);
  const brands = interests.filter(i => i.kind === "brand").map(i => i.value.toLowerCase());
  const stores = interests.filter(i => i.kind === "store").map(i => i.value);
  if (!cats.length && !brands.length && !stores.length) {
    fyCount = 0; renderStats();
    $("#fy").innerHTML = emptyState("აირჩიე ინტერესები — აქ გამოჩნდება მხოლოდ შენთვის საინტერესო შეთავაზებები.", ` <a class="btn btn-dark" href="#interests">ინტერესების არჩევა</a>`);
    return;
  }
  const storeOf = d => (data.stores || []).find(s => s.slug === d.store_slug);
  const deals = (data.deals || []).filter(d => cats.includes(String(d.category || "").toLowerCase()) || stores.includes(d.store_slug) || (storeOf(d)?.brands || []).some(b => brands.includes(b.toLowerCase())))
    .sort((a, b) => (b.deal_score || 0) - (a.deal_score || 0)).slice(0, 6);
  const offers = data.enriched.filter(e => brands.includes(String(e.product.brand || "").toLowerCase()) || cats.includes(String(e.product.category || "").toLowerCase()) || stores.includes(e.store.slug))
    .filter(e => e.scored.hasOriginal).sort((a, b) => (b.scored.score ?? -1) - (a.scored.score ?? -1)).slice(0, 8);
  let cmp = [], cmpBrands = [];
  if (brands.length) {
    cmpBrands = await sb("compare_items?select=brand&limit=1000").then(r => [...new Set(r.map(x => x.brand))].filter(b => brands.includes(b.toLowerCase()))).catch(() => []);
    if (cmpBrands.length) {
      const rows = await sb(`compare_items?select=id,brand,code,title,title_en,image_url,category,weight_g,updated_at,compare_prices(country,currency,price,original_price,in_stock,url,checked_at)&brand=in.(${cmpBrands.map(b => `"${encodeURIComponent(b)}"`).join(",")})&limit=300`).catch(() => []);
      cmp = rows.filter(it => (it.compare_prices || []).length > 1).map(it => ({ it, c: compareItem(it, data.fx) })).filter(x => x.c.best).sort((a, b) => b.c.saving - a.c.saving).slice(0, 3);
    }
  }
  fyCount = deals.length + offers.length + cmp.length; renderStats();
  let html = "";
  if (cmp.length) html += `<div class="subhead"><h3>სად ჯობს ყიდვა — ${esc(cmpBrands.join(", "))}</h3><p>ყველაზე დიდი დანაზოგი ქვეყნებს შორის</p></div><div class="cmp-list">${cmp.map(x => compareCard(x.it, data.fx)).join("")}</div>`;
  if (offers.length) html += `<div class="subhead"><h3>პროდუქტები ფასდაკლებით</h3><p>ქულით დალაგებული</p></div><div class="grid">${offers.map(offerCard).join("")}</div>`;
  if (deals.length) html += `<div class="subhead"><h3>მაღაზიების აქციები</h3></div><div class="grid deals">${deals.map(dealCard).join("")}</div>`;
  $("#fy").innerHTML = html || emptyState("შენი ინტერესებით ამჟამად აქტიური შეთავაზება ვერ ვიპოვეთ. დაამატე სხვა ბრენდი ან კატეგორია.", ` <a class="btn btn-ghost" href="#interests">ინტერესების შეცვლა</a>`);
}

/* ---- saved ---- */
const KIND = { offer: "პროდუქტი", deal: "აქცია", compare: "შედარება", link: "ბმული" };
const TRACK = { tracking: ["ფასს ვაკონტროლებთ", "ok"], bookmark: ["სანიშნე — ფასი ვერ ამოვიკითხეთ", ""], pending: ["მოწმდება…", ""], error: ["მაღაზია ვერ გაიხსნა", "err"] };
function sparkline(points, target) {
  if (!points || points.length < 2) return "";
  const ps = points.map(p => Number(p.price)), W = 260, H = 38, lo = Math.min(...ps, target || Infinity) * 0.98, hi = Math.max(...ps) * 1.02;
  const x = i => (i / (ps.length - 1)) * W, y = v => H - ((v - lo) / (hi - lo || 1)) * (H - 4) - 2;
  const d = ps.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="ფასის ისტორია: ${ps.length} დაკვირვება"><path class="a" d="${d}L${W},${H}L0,${H}Z"/><path class="l" d="${d}"/>${target && target >= lo && target <= hi ? `<line x1="0" x2="${W}" y1="${y(target).toFixed(1)}" y2="${y(target).toFixed(1)}"/>` : ""}</svg>`;
}
function savedCard(it) {
  const cur = currentOf(it);
  const gone = !cur && (it.kind === "offer" || it.kind === "deal");
  const price = cur?.price, ccy = cur?.currency || it.currency || "";
  const ch = price != null && Number(it.price_at_save) > 0 ? ((price - it.price_at_save) / it.price_at_save) * 100 : null;
  const hit = isHit(it);
  const tr = it.kind === "link" ? TRACK[it.track_status] || TRACK.pending : null;
  const url = cur?.url || it.url, internal = url && url.startsWith("product.html");
  const img = cur?.image || it.image_url;
  const href = url ? `href="${esc(internal ? url : safeUrl(url))}"${internal ? "" : ' target="_blank" rel="noopener noreferrer sponsored"'}` : "";
  return `<article class="sv-card${hit ? " hit" : ""}">
    <a class="sv-media" ${href} tabindex="-1" aria-hidden="true">${img ? `<img src="${esc(safeUrl(img))}" alt="" loading="lazy" onerror="this.remove()">` : ""}<span class="ph">${esc((cur?.store || cur?.title || "?").charAt(0).toUpperCase())}</span></a>
    <span class="sv-kind">${esc(KIND[it.kind])}</span>
    <button type="button" class="sv-x" data-remove="${it.id}" aria-label="წაშლა">×</button>
    <div class="sv-body">
      <span class="sv-store">${esc(cur?.store || "")}${gone ? " · აღარ არის აქტიური" : ""}</span>
      <h3 class="sv-title">${url ? `<a ${href}>${esc(cur?.title || it.title || it.url)}</a>` : esc(cur?.title || it.title || "—")}</h3>
      ${hit ? `<span><span class="hit-badge">🎯 სამიზნე ფასს მიაღწია</span></span>` : ""}
      ${price != null ? `<div class="sv-price"><b>${money(price, ccy)}</b>${it.price_at_save != null && Number(it.price_at_save) !== price ? `<s>${money(it.price_at_save, ccy)}</s>` : ""}${ch != null && Math.abs(ch) >= 0.5 ? `<em class="${ch < 0 ? "down" : "up"}">${ch > 0 ? "+" : ""}${ch.toFixed(1)}%</em>` : ""}</div>` : ""}
      ${sparkline(histories.get(it.id), Number(it.target_price) || null)}
      <span class="sv-meta">შენახულია ${esc(dateKa(it.created_at))}${tr ? ` · <span class="${tr[1]}">${tr[0]}</span>${it.last_checked_at ? ` (${esc(ago(it.last_checked_at))})` : ""}` : ""}</span>
      ${it.kind !== "deal" ? `<div class="sv-target"><label for="tg-${it.id}">სამიზნე</label><input id="tg-${it.id}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="${esc(ccy)}" value="${it.target_price ?? ""}" data-target="${it.id}">${it.kind === "link" ? `<button type="button" class="btn btn-ghost" data-retrack="${it.id}">შემოწმება</button>` : ""}</div>` : ""}
    </div></article>`;
}
function renderSaved() {
  renderStats();
  $("#sv-sub").textContent = EMAIL_ALERTS_LIVE
    ? "მიუთითე სამიზნე ფასი — როცა ფასი მას მიაღწევს, ელფოსტით შეგატყობინებთ."
    : "მიუთითე სამიზნე ფასი — როცა ფასი მას მიაღწევს, ბარათი მწვანედ მოინიშნება. ელფოსტით გაგზავნა მალე ჩაირთვება.";
  if (!saved.length) { $("#sv").innerHTML = emptyState("ჯერ არაფერი შეგინახავს. დააჭირე ♡-ს პროდუქტზე, „კაბინეტში შენახვა“-ს შედარებაზე, ან დაამატე ბმული.", ` <a class="btn btn-dark" href="#add-link">+ ბმულის დამატება</a>`); return; }
  let list = saved.filter(it => !svFilter || it.kind === svFilter);
  const sort = $("#sv-sort").value, chg = it => { const c = currentOf(it); return c?.price != null && it.price_at_save ? (c.price - it.price_at_save) / it.price_at_save : 0; };
  const gap = it => { const c = currentOf(it); return c?.price != null && it.target_price ? c.price / it.target_price : Infinity; };
  if (sort === "drop") list = list.slice().sort((a, b) => chg(a) - chg(b));
  if (sort === "target") list = list.slice().sort((a, b) => gap(a) - gap(b));
  $("#sv").innerHTML = list.length ? `<div class="sv-grid">${list.map(savedCard).join("")}</div>` : emptyState("ამ ტიპის შენახული ჯერ არ გაქვს.");
}
$("#sv-filter").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (!b) return; svFilter = b.dataset.f; $$("#sv-filter [data-f]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); renderSaved(); });
$("#sv-sort").addEventListener("change", renderSaved);
async function loadHistories() {
  const links = saved.filter(it => it.kind === "link" && it.track_status === "tracking");
  await Promise.all(links.map(async it => { try { histories.set(it.id, await A.linkHistory(it.id)); } catch { /* none */ } }));
  if (links.length) renderSaved();
}
document.addEventListener("change", async e => {
  const t = e.target.closest("[data-target]"); if (!t) return;
  try { await A.setTarget(Number(t.dataset.target), Number(t.value)); const it = saved.find(x => x.id === Number(t.dataset.target)); if (it) it.target_price = Number(t.value) > 0 ? Number(t.value) : null; renderSaved(); toast("სამიზნე ფასი შენახულია"); }
  catch (err) { toast(err.message); }
});
document.addEventListener("click", async e => {
  const r = e.target.closest("[data-remove]");
  if (r) { try { await A.removeItem(Number(r.dataset.remove)); const it = saved.find(x => x.id === Number(r.dataset.remove)); saved = saved.filter(x => x !== it); if (it && (it.kind === "offer" || it.kind === "deal") && wl.has(it.kind, it.ref)) wl.toggle(it.kind, it.ref); renderSaved(); toast("წაიშალა"); } catch (err) { toast(err.message); } return; }
  const t = e.target.closest("[data-retrack]");
  if (t) { t.disabled = true; t.textContent = "მოწმდება…"; try { await A.trackLink(Number(t.dataset.retrack)); saved = await A.listSaved(); await loadHistories(); renderSaved(); } catch (err) { toast(err.message); t.disabled = false; t.textContent = "შემოწმება"; } }
});

/* ---- add link ---- */
$("#f-link").addEventListener("submit", e => { e.preventDefault(); const st = $("#ln-msg"); st.className = "form-status"; busy(e.target, async () => {
  let url; try { url = A.normalizeLink($("#ln-url").value); } catch (err) { st.textContent = err.message || "ბმული არასწორია."; st.classList.add("err"); return; }
  const target = Number($("#ln-target").value) || null;
  st.textContent = "ვინახავ და ფასს ვამოწმებ…";
  const row = await A.saveItem({ kind: "link", item_key: url, url, target_price: target, track_status: "pending" });
  let res = {}; try { res = await A.trackLink(row.id); } catch { /* the hourly job retries */ }
  saved = await A.listSaved(); await loadHistories(); renderSaved();
  if (res.price) st.textContent = `✓ შენახულია: ${res.title || "პროდუქტი"} — ${money(res.price, res.currency || "")}. ყოველდღე შევამოწმებთ.`;
  else if (res.error) st.textContent = "✓ ბმული შენახულია, მაგრამ მაღაზიამ ახლა არ გვიპასუხა — მოგვიანებით ხელახლა ვცდით.";
  else st.textContent = "✓ ბმული სანიშნედ შეინახა — ამ გვერდზე ფასი ავტომატურად ვერ ამოვიკითხეთ.";
  st.classList.add("ok"); e.target.reset();
}); });

/* ---- settings ---- */
async function renderSettings() {
  try { const p = await A.getProfile(); $("#set-alerts").checked = !!p.email_alerts; } catch { /* default */ }
  $("#alerts-note").textContent = EMAIL_ALERTS_LIVE ? "ყოველ წერილში იქნება გამოწერის გაუქმების ბმული." : "ელფოსტით გაგზავნა ჯერ არ არის ჩართული — სამიზნეს მიღწევა ამ დროისთვის კაბინეტში ჩანს.";
}
$("#set-alerts").addEventListener("change", async e => { try { await A.updateProfile({ email_alerts: e.target.checked }); toast("შენახულია"); } catch (err) { toast(err.message); e.target.checked = !e.target.checked; } });
$("#f-pass").addEventListener("submit", e => { e.preventDefault(); busy(e.target, async () => { const pw = $("#ch-pass").value; if (pw.length < 8) throw new Error("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო."); await A.updatePassword(pw); $("#ch-pass").value = ""; toast("პაროლი შეიცვალა"); }); });
$("#btn-out").addEventListener("click", async () => { await A.signOut(); location.href = "./"; });
$("#btn-del").addEventListener("click", () => { $("#del-confirm").hidden = false; });
$("#btn-del-no").addEventListener("click", () => { $("#del-confirm").hidden = true; });
$("#btn-del-yes").addEventListener("click", async e => { e.target.disabled = true; try { await A.deleteAccount(); location.href = "./"; } catch (err) { say(err.message, "err"); e.target.disabled = false; } });

/* ================= boot ================= */
A.supa.auth.onAuthStateChange(ev => { if (ev === "PASSWORD_RECOVERY") { showAuth("newpass"); say("ჩაწერე ახალი პაროლი.", ""); } });
const params = new URLSearchParams(location.search);
if (/error_description=/.test(location.hash)) say("ბმული ვადაგასულია ან უკვე გამოყენებულია. სცადე ხელახლა.", "err");
(await A.currentUser()) && !/type=recovery/.test(location.hash) ? showCabinet() : showAuth(/type=recovery/.test(location.hash) ? "newpass" : params.get("tab") === "up" ? "up" : "in");
