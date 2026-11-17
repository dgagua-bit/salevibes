/**
 * Admin panel. Everything here goes through the admin's own Supabase session;
 * Row Level Security (is_admin()) decides what may be read or changed.
 */
import { mountChrome, toast, emptyState, $, $$ } from "../ui.js";
import { esc, safeUrl, dateKa, ago, countryName, flag, catLabel, hostOf } from "../format.js";
import { COUNTRIES, CATEGORIES, WORLDS } from "../config.js";
import { supa, currentUser } from "../auth.js";

mountChrome("admin");
const say = (t, k = "") => { const el = $("#adm-msg"); el.textContent = t; el.className = "form-status " + k; };
let deals = [], stores = [], dealFilter = "active";
const FRESH_DAYS = 7;

async function q(p) { const { data, error } = await p; if (error) throw new Error(error.message); return data; }
const daysSince = v => (v ? (Date.now() - new Date(v)) / 864e5 : Infinity);
const needsAttention = d => d.status === "active" && (daysSince(d.last_checked) > FRESH_DAYS || /^HTTP 4|redirected/.test(d.last_check_status || "") || (d.end_date && new Date(d.end_date) < new Date()));
const scoreFor = (disc, code) => { let s = 60 + (disc == null || disc === "" ? 5 : Math.round(Number(disc) / 2.5)); if (code && disc) s += 4; return Math.min(95, s); };

/* ---------- gate ---------- */
async function boot() {
  const user = await currentUser();
  if (!user) { $("#adm-gate").hidden = false; $("#adm-gate-t").textContent = "ადმინ-პანელის სანახავად შედი შენი ანგარიშით."; return; }
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) { $("#adm-gate").hidden = false; $("#adm-gate-t").textContent = `ანგარიში ${user.email} ადმინისტრატორი არ არის.`; $("#adm-gate a").remove(); return; }
  $("#adm").hidden = false;
  $("#adm-h").textContent = "მართვა";
  fillSelects();
  await reload();
}
async function reload() {
  try {
    [deals, stores] = await Promise.all([
      q(supa.from("deals").select("*").order("created_at", { ascending: false })),
      q(supa.from("stores").select("*").order("sort_order", { ascending: true }))
    ]);
  } catch (e) { say("მონაცემები ვერ ჩაიტვირთა: " + e.message, "err"); return; }
  renderOverview(); renderDeals(); renderStores();
}

/* ---------- tabs ---------- */
$$(".adm-tabs [data-pane]").forEach(b => b.addEventListener("click", () => {
  $$(".adm-tabs [data-pane]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $$(".adm-pane").forEach(p => (p.hidden = p.id !== "pane-" + b.dataset.pane));
  if (b.dataset.pane === "auto") renderAuto();
  if (b.dataset.pane === "fb") renderFeedback();
}));

/* ---------- overview ---------- */
function card(label, value, note = "", cls = "") { return `<div class="adm-card ${cls}"><span>${esc(label)}</span><b>${value}</b>${note ? `<small>${esc(note)}</small>` : ""}</div>`; }
async function renderOverview() {
  const active = deals.filter(d => d.status === "active"), attn = deals.filter(needsAttention);
  let fb = [], pv = [];
  try { [fb, pv] = await Promise.all([q(supa.from("feedback").select("rating,created_at")), q(supa.from("page_views").select("visitor,created_at").gte("created_at", new Date(Date.now() - 7 * 864e5).toISOString()))]); } catch { /* optional */ }
  const avg = fb.length ? (fb.reduce((s, x) => s + x.rating, 0) / fb.length).toFixed(1) : "—";
  $("#ov-cards").innerHTML = card("აქტიური აქცია", active.length) + card("ყურადღება სჭირდება", attn.length, "იხ. ქვემოთ", attn.length ? "warn" : "")
    + card("მაღაზია", stores.length, `${stores.filter(s => s.logo_url).length} ლოგოთი`) + card("ვიზიტორი 7 დღეში", new Set(pv.map(x => x.visitor)).size, `${pv.length} გვერდის ნახვა`)
    + card("შეფასება", avg, `${fb.length} შეფასება`);
  $("#ov-attn").innerHTML = attn.length ? dealTable(attn) : emptyState("ყველაფერი რიგზეა — ყურადღების საჭირო აქცია არ არის.");
}

/* ---------- deals ---------- */
function statusChip(d) {
  if (d.status === "expired") return `<span class="status status-expired">დასრულებული</span>`;
  if (d.status === "draft") return `<span class="status">დრაფტი</span>`;
  if (needsAttention(d)) return `<span class="status status-unverified">შესამოწმებელი</span>`;
  return `<span class="status status-active">აქტიური</span>`;
}
function checkNote(d) {
  const s = d.last_check_status || "";
  if (!s) return "ჯერ არ შემოწმებულა";
  if (s === "ok") return "ბმული მუშაობს";
  if (/^blocked/.test(s)) return "მაღაზია ავტომატურ შემოწმებას ბლოკავს — გადაამოწმე ხელით";
  if (/redirected/.test(s)) return "ბმული მთავარ გვერდზე გადადის — შესაძლოა აქცია დასრულდა";
  return `ბმული არ იხსნება (${s})`;
}
function dealTable(list) {
  return `<div class="table-scroll"><table class="data-table adm-table"><thead><tr><th>მაღაზია</th><th>აქცია</th><th class="num">%</th><th>სტატუსი</th><th>ბოლო შემოწმება</th><th></th></tr></thead><tbody>${list.map(d => `<tr>
    <td><b>${esc(d.store)}</b><br><small class="muted">${flag(d.country)} ${esc(countryName(d.country))} · ${esc(catLabel(d.category))}</small></td>
    <td><a class="link" href="${esc(safeUrl(d.sale_url))}" target="_blank" rel="noopener noreferrer">${esc(d.title)}</a>${d.promo_code ? `<br><small>კოდი: ${esc(d.promo_code)}</small>` : ""}${d.end_date ? `<br><small>მთავრდება ${esc(dateKa(d.end_date))}</small>` : ""}</td>
    <td class="num">${d.discount_percent ?? "—"}</td>
    <td>${statusChip(d)}${(d.tags || []).includes("auto") ? `<br><small class="muted">ავტომატური</small>` : ""}</td>
    <td><small>${esc(ago(d.last_checked) || "—")}<br><span class="muted">${esc(checkNote(d))}</span></small></td>
    <td class="adm-row-actions">
      <button type="button" class="btn btn-ghost" data-d-edit="${d.id}">რედაქტირება</button>
      ${d.status === "active" ? `<button type="button" class="btn btn-ghost" data-d-ok="${d.id}" title="ხელით გადაამოწმე, რომ აქცია ჯერ კიდევ მოქმედებს">✓ მოქმედებს</button><button type="button" class="btn btn-ghost" data-d-end="${d.id}">დასრულება</button>` : `<button type="button" class="btn btn-ghost" data-d-on="${d.id}">გააქტიურება</button>`}
      <button type="button" class="btn btn-ghost acct-danger" data-d-del="${d.id}" aria-label="წაშლა">×</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderDeals() {
  const term = $("#d-q").value.trim().toLowerCase();
  let list = deals.filter(d => dealFilter === "attn" ? needsAttention(d) : d.status === dealFilter);
  if (term) list = list.filter(d => [d.store, d.title, d.promo_code].join(" ").toLowerCase().includes(term));
  $("#d-list").innerHTML = list.length ? dealTable(list) : emptyState("ამ ფილტრით აქცია არ არის.");
}
$("#d-filter").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (!b) return; dealFilter = b.dataset.f; $$("#d-filter [data-f]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); renderDeals(); });
$("#d-q").addEventListener("input", renderDeals);

function fillSelects() {
  const opts = (obj, keys) => keys.map(k => `<option value="${esc(k)}">${esc(obj[k])}</option>`).join("");
  const cKeys = Object.keys(COUNTRIES).filter(k => k !== "UK");
  $("#d-country").innerHTML = opts(COUNTRIES, cKeys); $("#s-country").innerHTML = opts(COUNTRIES, cKeys);
  const cats = Object.keys(CATEGORIES); $("#d-cat").innerHTML = opts(CATEGORIES, cats); $("#s-cat").innerHTML = opts(CATEGORIES, cats);
  $("#s-worlds").innerHTML = WORLDS.map(w => `<button type="button" class="chip" data-world="${w.key}" aria-pressed="false">${esc(w.title)}</button>`).join("");
}
function openDealForm(d = null) {
  $("#d-store").innerHTML = stores.slice().sort((a, b) => a.name.localeCompare(b.name)).map(s => `<option value="${esc(s.slug)}">${esc(s.name)}</option>`).join("");
  $("#d-form-h").textContent = d ? `რედაქტირება: ${d.store}` : "ახალი აქცია";
  $("#d-id").value = d?.id || ""; $("#d-store").value = d?.store_slug || stores[0]?.slug || "";
  $("#d-status").value = d?.status || "active"; $("#d-title").value = d?.title || ""; $("#d-desc").value = d?.description || "";
  $("#d-url").value = d?.sale_url || ""; $("#d-disc").value = d?.discount_percent ?? ""; $("#d-code").value = d?.promo_code || "";
  $("#d-end").value = d?.end_date ? d.end_date.slice(0, 10) : ""; $("#d-bf").checked = (d?.tags || []).includes("black-friday");
  const st = stores.find(s => s.slug === $("#d-store").value);
  $("#d-cat").value = d?.category || st?.category || "fashion"; $("#d-country").value = (d?.country || st?.country || "DE").toUpperCase();
  scoreNote(); $("#d-form").hidden = false; $("#d-title").focus(); $("#d-form").scrollIntoView({ block: "start" });
}
function scoreNote() { $("#d-score-note").textContent = `აქციის ქულა ავტომატურად დაითვლება: ${scoreFor($("#d-disc").value, $("#d-code").value.trim())}/100 (ფასდაკლების და პრომოკოდის მიხედვით).`; }
["#d-disc", "#d-code"].forEach(s => $(s).addEventListener("input", scoreNote));
$("#d-store").addEventListener("change", () => { const st = stores.find(s => s.slug === $("#d-store").value); if (st && !$("#d-id").value) { $("#d-cat").value = st.category || $("#d-cat").value; $("#d-country").value = (st.country || "").toUpperCase(); if (!$("#d-url").value) $("#d-url").value = st.base_url; } });
$("#d-new").addEventListener("click", () => openDealForm());
$("#d-cancel").addEventListener("click", () => { $("#d-form").hidden = true; });
$("#d-form").addEventListener("submit", async e => {
  e.preventDefault();
  const st = stores.find(s => s.slug === $("#d-store").value);
  const title = $("#d-title").value.trim(), url = $("#d-url").value.trim();
  if (!st || !title || !/^https?:\/\//.test(url)) { say("შეავსე მაღაზია, სათაური და სწორი ბმული (https://…).", "err"); return; }
  const disc = $("#d-disc").value === "" ? null : Math.max(0, Math.min(100, Math.round(Number($("#d-disc").value))));
  const code = $("#d-code").value.trim() || null;
  const id = $("#d-id").value, old = deals.find(x => String(x.id) === id);
  const tags = new Set((old?.tags || []).filter(t => t !== "black-friday")); if ($("#d-bf").checked) tags.add("black-friday");
  const row = { store: st.name, store_slug: st.slug, country: $("#d-country").value, category: $("#d-cat").value, title, description: $("#d-desc").value.trim() || null,
    sale_url: url, discount_percent: disc, promo_code: code, deal_score: scoreFor(disc, code), end_date: $("#d-end").value ? new Date($("#d-end").value + "T23:59:00+04:00").toISOString() : null,
    status: $("#d-status").value, tags: [...tags], last_checked: new Date().toISOString(), check_fail_count: 0, last_check_status: null };
  try {
    if (id) await q(supa.from("deals").update(row).eq("id", Number(id)));
    else await q(supa.from("deals").insert(row));
    $("#d-form").hidden = true; toast(id ? "აქცია განახლდა" : "აქცია დაემატა"); say("");
    await reload();
  } catch (err) { say("შენახვა ვერ მოხერხდა: " + err.message, "err"); }
});
document.addEventListener("click", async e => {
  const t = e.target.closest("[data-d-edit],[data-d-ok],[data-d-end],[data-d-on],[data-d-del]"); if (!t) return;
  const id = Number(t.dataset.dEdit || t.dataset.dOk || t.dataset.dEnd || t.dataset.dOn || t.dataset.dDel);
  const d = deals.find(x => x.id === id); if (!d) return;
  if (t.dataset.dEdit) return openDealForm(d);
  if (t.dataset.dDel && !t.classList.contains("confirm")) { t.classList.add("confirm"); t.textContent = "წაშლა?"; setTimeout(() => { t.classList.remove("confirm"); t.textContent = "×"; }, 3000); return; }
  try {
    if (t.dataset.dOk) await q(supa.from("deals").update({ last_checked: new Date().toISOString(), check_fail_count: 0, last_check_status: "ok" }).eq("id", id));
    if (t.dataset.dEnd) await q(supa.from("deals").update({ status: "expired" }).eq("id", id));
    if (t.dataset.dOn) await q(supa.from("deals").update({ status: "active", last_checked: new Date().toISOString(), check_fail_count: 0 }).eq("id", id));
    if (t.dataset.dDel) await q(supa.from("deals").delete().eq("id", id));
    toast("შენახულია"); await reload();
  } catch (err) { say(err.message, "err"); }
});

/* ---------- stores ---------- */
function renderStores() {
  const term = $("#s-q").value.trim().toLowerCase();
  const list = stores.filter(s => !term || [s.name, s.slug, countryName(s.country), ...(s.brands || [])].join(" ").toLowerCase().includes(term));
  const nDeals = s => deals.filter(d => d.store_slug === s.slug && d.status === "active").length;
  $("#s-list").innerHTML = `<div class="table-scroll"><table class="data-table adm-table"><thead><tr><th>მაღაზია</th><th>ქვეყანა</th><th class="num">აქტიური აქცია</th><th>სკანირება</th><th></th></tr></thead><tbody>${list.map(s => `<tr>
    <td>${s.logo_url ? `<img class="adm-logo" src="${esc(safeUrl(s.logo_url))}" alt="" loading="lazy" onerror="this.remove()">` : ""}<b>${esc(s.name)}</b><br><small class="muted">${esc(hostOf(s.base_url))}</small></td>
    <td>${flag(s.country)} ${esc(countryName(s.country))}</td><td class="num">${nDeals(s)}</td>
    <td>${s.active ? `<span class="status status-active">ავტომატური</span><br><small class="muted">${esc(ago(s.last_crawled_at) || "ჯერ არა")}</small>` : `<small class="muted">გამორთული</small>`}</td>
    <td class="adm-row-actions"><button type="button" class="btn btn-ghost" data-s-edit="${esc(s.id)}">რედაქტირება</button><button type="button" class="btn btn-ghost" data-s-deal="${esc(s.slug)}">+ აქცია</button></td></tr>`).join("")}</tbody></table></div>`;
}
$("#s-q").addEventListener("input", renderStores);
$("#s-worlds").addEventListener("click", e => { const b = e.target.closest("[data-world]"); if (b) b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); });
function openStoreForm(s = null) {
  $("#s-form-h").textContent = s ? `რედაქტირება: ${s.name}` : "ახალი მაღაზია";
  $("#s-id").value = s?.id || ""; $("#s-name").value = s?.name || ""; $("#s-url").value = s?.base_url || "";
  $("#s-country").value = (s?.country || "DE").toUpperCase(); $("#s-cur").value = s?.currency || "EUR"; $("#s-cat").value = s?.category || "fashion";
  $("#s-brands").value = (s?.brands || []).join(", "); $("#s-active").checked = !!s?.active;
  $$("#s-worlds [data-world]").forEach(b => b.setAttribute("aria-pressed", String((s?.worlds || []).includes(b.dataset.world))));
  $("#s-form").hidden = false; $("#s-name").focus(); $("#s-form").scrollIntoView({ block: "start" });
}
$("#s-new").addEventListener("click", () => openStoreForm());
$("#s-cancel").addEventListener("click", () => { $("#s-form").hidden = true; });
document.addEventListener("click", e => {
  const ed = e.target.closest("[data-s-edit]"); if (ed) return openStoreForm(stores.find(s => String(s.id) === ed.dataset.sEdit));
  const nd = e.target.closest("[data-s-deal]"); if (nd) { $$(".adm-tabs [data-pane]").find(b => b.dataset.pane === "deals").click(); openDealForm(); $("#d-store").value = nd.dataset.sDeal; $("#d-store").dispatchEvent(new Event("change")); }
});
$("#s-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("#s-name").value.trim(), url = $("#s-url").value.trim();
  if (!name || !/^https?:\/\//.test(url)) { say("შეავსე სახელი და სწორი ბმული (https://…).", "err"); return; }
  const id = $("#s-id").value;
  const row = { name, base_url: url, country: $("#s-country").value, currency: $("#s-cur").value, category: $("#s-cat").value,
    worlds: $$("#s-worlds [aria-pressed=true]").map(b => b.dataset.world), brands: $("#s-brands").value.split(",").map(x => x.trim()).filter(Boolean),
    active: $("#s-active").checked, ...(id ? {} : { slug: name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + $("#s-country").value.toLowerCase(), crawl_urls: [], sort_order: 100 }) };
  try {
    if (id) await q(supa.from("stores").update(row).eq("id", id)); else await q(supa.from("stores").insert(row));
    $("#s-form").hidden = true; toast(id ? "მაღაზია განახლდა" : "მაღაზია დაემატა — ლოგოს ავტომატურად მოვძებნით"); say(""); await reload();
  } catch (err) { say("შენახვა ვერ მოხერხდა: " + err.message, "err"); }
});

/* ---------- automation ---------- */
const JOBS = [
  { name: "აქციების ბმულების შემოწმება", when: "ყოველდღე 07:23 (თბილისით)", what: "ხსნის თითოეული აქციის ბმულს: თუ მუშაობს — „შემოწმდა დღეს“; თუ ორჯერ ზედიზედ აღარ არსებობს — აქცია ავტომატურად სრულდება.", run: "deal-check" },
  { name: "პროდუქტების ფასების სკანირება", when: "ყოველ 30 წუთში", what: "მაღაზიებიდან, სადაც ჩართულია სკანირება, კითხულობს პროდუქტების ფასებს და ინახავს ფასის ისტორიას. აქვე ახლდება ეროვნული ბანკის კურსი.", run: "radar-engine" },
  { name: "ფასები ქვეყნებს შორის (Speedo)", when: "ყოველდღე", what: "ერთი და იგივე პროდუქტის ფასს სხვადასხვა ქვეყნის საიტზე ადარებს. Speedo-ს აქციაც აქედან ახლდება." },
  { name: "ლოგოები და აქციების ფოტოები", when: "ყოველ 10 წუთში (თითოეულს — 3 დღეში ერთხელ)", what: "მაღაზიების საიტებიდან იღებს ლოგოს და აქციის მთავარ ფოტოს." },
  { name: "ვადაგასული აქციები", when: "ყოველ საათში", what: "აქცია, რომლის დასრულების თარიღი გავიდა, საიტიდან ავტომატურად ქრება." },
  { name: "ფასის შეტყობინებები", when: "ყოველ საათში", what: "კაბინეტში შენახულ ბმულებს ამოწმებს და ნიშნავს, როცა ფასი სამიზნეს მიაღწევს." }
];
async function renderAuto() {
  let runs = [], srcs = [];
  try { [runs, srcs] = await Promise.all([q(supa.from("crawl_runs").select("status,products_found,error_message,started_at,stores(name)").order("started_at", { ascending: false }).limit(8)), q(supa.from("compare_sources").select("brand,country,last_run_at,last_count,last_error"))]); } catch { /* optional */ }
  const dc = deals.filter(d => d.status === "active"), dcOk = dc.filter(d => d.last_check_status === "ok").length, dcBlocked = dc.filter(d => /^blocked/.test(d.last_check_status || "")).length;
  const lastDeal = dc.map(d => d.last_checked).sort().pop();
  const detail = {
    "deal-check": `ბოლოს: ${ago(lastDeal) || "—"} · ${dcOk} მუშაობს · ${dcBlocked} მაღაზია ბლოკავს შემოწმებას (ხელით გადასამოწმებელია)`,
    "radar-engine": runs.length ? `ბოლოს: ${ago(runs[0].started_at)} · ${runs.slice(0, 4).map(r => `${r.stores?.name || "?"}: ${r.status === "success" ? r.products_found + " პროდუქტი" : "შეცდომა"}`).join(" · ")}` : "მონაცემი არ არის"
  };
  const extra = srcs.length ? srcs.map(s => `${s.brand} ${s.country}: ${s.last_count ?? 0} (${ago(s.last_run_at)})`).join(", ") : "";
  $("#auto-list").innerHTML = JOBS.map((j, i) => `<div class="adm-job"><div><b>${esc(j.name)}</b><small>${esc(j.when)}</small><p>${esc(j.what)}</p><p class="fine">${esc(detail[j.run] || (i === 2 ? extra : "") || "")}</p></div>${j.run ? `<button type="button" class="btn btn-ghost" data-run="${j.run}">გაშვება ახლავე</button>` : ""}</div>`).join("");
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-run]"); if (!b) return;
  b.disabled = true; b.textContent = "მიმდინარეობს… (1–2 წუთი)";
  try {
    const { data, error } = await supa.functions.invoke(b.dataset.run, { body: b.dataset.run === "radar-engine" ? { task: "scan" } : { limit: 80 } });
    if (error) throw error;
    toast(b.dataset.run === "deal-check" ? `შემოწმდა ${data.checked}: ${data.ok_count} მუშაობს, ${data.gone} აღარ არსებობს` : "სკანირება დასრულდა");
    await reload(); renderAuto();
  } catch { toast("ვერ გაეშვა — სცადე მოგვიანებით"); b.disabled = false; b.textContent = "გაშვება ახლავე"; }
});

/* ---------- feedback & visits ---------- */
async function renderFeedback() {
  let fb = [], pv = [];
  try { [fb, pv] = await Promise.all([q(supa.from("feedback").select("*").order("created_at", { ascending: false }).limit(200)), q(supa.from("page_views").select("path,referrer,device,visitor,created_at").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()).limit(20000))]); }
  catch (e) { $("#fb-list").innerHTML = emptyState("ვერ ჩაიტვირთა: " + esc(e.message)); return; }
  const avg = fb.length ? (fb.reduce((s, x) => s + x.rating, 0) / fb.length).toFixed(1) : "—";
  const top = (arr, key) => Object.entries(arr.reduce((m, x) => { const k = x[key] || "პირდაპირ"; m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8);
  $("#fb-cards").innerHTML = card("საშუალო შეფასება", avg, `${fb.length} შეფასება`) + card("ვიზიტორი (30 დღე)", new Set(pv.map(x => x.visitor)).size) + card("გვერდის ნახვა (30 დღე)", pv.length)
    + card("ტელეფონიდან", pv.length ? Math.round(pv.filter(x => x.device === "mobile").length / pv.length * 100) + "%" : "—");
  $("#fb-list").innerHTML = fb.length ? `<ul class="list-plain">${fb.slice(0, 50).map(f => `<li><span><b>${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</b> ${f.comment ? esc(f.comment) : '<span class="muted">კომენტარის გარეშე</span>'}<br><small class="muted">${esc(dateKa(f.created_at))} · ${esc(f.page || "")} · ${esc(f.device || "")}</small></span></li>`).join("")}</ul>` : emptyState("შეფასება ჯერ არ არის.");
  const rows = (title, list) => `<h3 class="acct-h3">${title}</h3><table class="data-table"><tbody>${list.map(([k, n]) => `<tr><td>${esc(k)}</td><td class="num">${n}</td></tr>`).join("")}</tbody></table>`;
  $("#pv-list").innerHTML = pv.length ? rows("ყველაზე ნანახი გვერდები", top(pv, "path")) + rows("საიდან მოდიან", top(pv, "referrer")) : emptyState("ვიზიტები ჯერ არ არის.");
  // what people search for, and what they could not find (→ which stores or products to add)
  let sl = [];
  try { sl = await q(supa.from("search_log").select("q,results,created_at").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()).order("created_at", { ascending: false }).limit(5000)); } catch { /* optional */ }
  const tally = list => Object.values(list.reduce((m, x) => { const k = x.q.toLowerCase(); (m[k] ||= { q: x.q, n: 0, r: x.results }).n++; return m; }, {})).sort((a, b) => b.n - a.n).slice(0, 15);
  const srows = (title, note, list) => `<div><h3 class="acct-h3">${title}</h3><p class="fine">${note}</p>${list.length ? `<table class="data-table"><tbody>${list.map(x => `<tr><td><a class="link" href="search.html?q=${encodeURIComponent(x.q)}" target="_blank" rel="noopener">${esc(x.q)}</a></td><td class="num">${x.n}×</td><td class="num"><small>${x.r} შედეგი</small></td></tr>`).join("")}</tbody></table>` : emptyState("ჯერ არაფერი.")}</div>`;
  $("#sl-list").innerHTML = srows("რას ეძებენ (30 დღე)", `სულ ${sl.length} ძიება.`, tally(sl))
    + srows("რა ვერ იპოვეს", "ამ პროდუქტებისთვის ჩვენს მაღაზიებში შედეგი არ იყო — კარგი მინიშნებაა, რომელი მაღაზია დავამატოთ.", tally(sl.filter(x => !x.results)));
}

boot().catch(e => say(e.message, "err"));
