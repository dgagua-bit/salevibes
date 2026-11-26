import { mountChrome, breakdown, fxLine, errorState, $ } from "../ui.js";
import { getFx, searchCompare, priceSearch, sb } from "../api.js";
import { compareItem, compareCard, COMPARE_CSS } from "../compare.js";
import { findProducts, groupItems, sortItems, pickBest, storeCount, bestCardHTML, rowHTML, brandOf, modelsOf, modelChipsHTML, closestHTML, liveNote, SEARCH_CSS } from "../search-engine.js";
document.head.insertAdjacentHTML("beforeend", `<style>${COMPARE_CSS}${SEARCH_CSS}</style>`);
import { landedCost, carrierRate, toGel } from "../pricing.js";
import { CARRIERS, CUSTOMS, COUNTRIES, CATEGORIES, PRICE_SEARCH_API, ESTIMATE_DEFAULTS } from "../config.js";
import { esc, safeUrl, money, gelText, dateKa, countryName, flag, catLabel } from "../format.js";

mountChrome("tools");
let FXR = { fx: {}, date: null };
const params = new URLSearchParams(location.search);
const ST_KA = { VERIFIED: "გადამოწმებული", REPORTED: "წყაროდან", PENDING: "მოლოდინში", UNVERIFIED: "გადასამოწმებელი" };
const ORIGINS = ["US", "IT", "DE", "GB", "ES", "FR", "GR", "PL", "NL"];

// --- calculator controls
$("#c-origin").innerHTML = ORIGINS.map(c => `<option value="${c}">${flag(c)} ${esc(COUNTRIES[c])}</option>`).join("");
$("#c-carrier").innerHTML = `<option value="">— ჩემი ტარიფი —</option>` + CARRIERS.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
$("#c-cat").innerHTML = `<option value="">—</option>` + Object.keys(ESTIMATE_DEFAULTS.weightKgByCategory).map(k => `<option value="${k}">${esc(CATEGORIES[k] || k)} (~${ESTIMATE_DEFAULTS.weightKgByCategory[k]} კგ)</option>`).join("");
if (params.get("price")) $("#c-price").value = params.get("price");
if (params.get("cur")) $("#c-cur").value = params.get("cur");
if (params.get("origin") && ORIGINS.includes(params.get("origin").toUpperCase())) $("#c-origin").value = params.get("origin").toUpperCase();
if (params.get("cat")) { $("#c-cat").value = params.get("cat"); $("#c-kg").value = ""; }

function syncRate() {
  const r = carrierRate($("#c-carrier").value, $("#c-origin").value);
  const hint = $("#c-rate-hint");
  if ($("#c-carrier").value && r) { $("#c-rate").value = r.usdPerKg; hint.textContent = `(${r.status === "VERIFIED" ? "გადამოწმებული" : "წყაროდან, გადაუმოწმებელი"} · ${dateKa(r.effective)}-დან)`; }
  else if ($("#c-carrier").value) { $("#c-rate").value = ""; hint.textContent = "(ამ მიმართულებაზე ტარიფი არ გვაქვს — ჩაწერე თავად)"; }
  else hint.textContent = "";
}
function calc() {
  const car = $("#c-carrier").value, r = carrierRate(car, $("#c-origin").value);
  const userRate = $("#c-rate").value;
  const l = landedCost({
    price: $("#c-price").value, currency: $("#c-cur").value, fx: FXR.fx, domesticShipping: $("#c-dom").value,
    kg: $("#c-kg").value, length: $("#c-l").value, width: $("#c-w").value, height: $("#c-h").value, category: $("#c-cat").value,
    usdPerKg: userRate, rateStatus: r && Number(userRate) === r.usdPerKg ? r.status : "USER",
    serviceFeeGel: $("#c-fee").value, personal: $("#c-personal").checked, sameItems: $("#c-same").checked
  });
  if (r && Number(userRate) === r.usdPerKg && r.status !== "VERIFIED") l.assumptions.push(`${r.carrier}-ის ტარიფი აღებულია მეორადი წყაროდან (${dateKa(r.effective)}) — გადაამოწმე კომპანიის საიტზე`);
  if (Number(userRate) > 0 && !r) l.assumptions.push("ტარიფი შენ მიერ შეყვანილია");
  $("#calc-out").innerHTML = `<div class="panel-head"><h2>შედეგი</h2>${l.isFinal ? `<span class="label-final">საბოლოო ფასი</span>` : `<span class="label-est">სავარაუდო — არა გარანტია</span>`}</div>${breakdown(l)}<p class="fine">ერთი მაღაზიიდან ერთ რეისზე ჩამოსული ამანათები საბაჟოსთვის შეიძლება დაჯამდეს.</p>`;
}
["input", "change"].forEach(ev => $("#calc-form").addEventListener(ev, e => { if (e.target.id === "c-carrier" || e.target.id === "c-origin") syncRate(); calc(); }));

// --- carriers table
$("#car-table").innerHTML = `<thead><tr><th>გადამზიდავი</th><th>მიმართულება</th><th class="num">ტარიფი</th><th>სტატუსი</th><th>წყარო / თარიღი</th></tr></thead><tbody>${CARRIERS.map(c => {
  const rates = Object.entries(c.rates);
  if (!rates.length) return `<tr><td><b>${esc(c.name)}</b></td><td>—</td><td class="num">—</td><td><span class="status status-unverified">მოლოდინში</span></td><td class="muted">ოფიციალური ტარიფი ჯერ არ გადაგვიმოწმებია</td></tr>`;
  return rates.map(([o, r]) => `<tr><td><b>${esc(c.name)}</b></td><td>${flag(o)} ${esc(COUNTRIES[o] || o)} → 🇬🇪 · ${esc(r.method)}</td><td class="num">$${r.usdPerKg}/კგ</td><td><span class="status ${r.status === "VERIFIED" ? "status-active" : "status-unverified"}">${ST_KA[r.status] || r.status}</span></td><td><a class="link" href="${esc(safeUrl(r.source))}" target="_blank" rel="noopener noreferrer">წყარო ↗</a> · ${esc(dateKa(r.effective))}-დან<br><small class="muted">${esc(r.note || "")}</small></td></tr>`).join("");
}).join("")}</tbody>`;

// --- customs box
$("#customs-box").innerHTML = `<p><span class="status ${CUSTOMS.status === "VERIFIED" ? "status-active" : "status-unverified"}">${ST_KA[CUSTOMS.status] || CUSTOMS.status}</span> ${CUSTOMS.checkedOn ? `გადამოწმდა ${esc(dateKa(CUSTOMS.checkedOn))}` : "წესები გადმოტანილია საიტის წინა ვერსიიდან და ოფიციალურ წყაროსთან ჯერ არ შეგვიდარებია."} <a class="link" href="${esc(CUSTOMS.source)}" target="_blank" rel="noopener noreferrer">rs.ge ↗</a></p>
  <ul><li>პირადი, არაკომერციული ამანათი <b>${CUSTOMS.dutyFreeLimitGel} ₾-მდე</b> და <b>${CUSTOMS.dutyFreeLimitKg} კგ-მდე</b> — გადასახადისგან თავისუფალია.</li>
  <li>განბაჟდება, თუ ღირებულება ${CUSTOMS.dutyFreeLimitGel} ₾-ს ან წონა ${CUSTOMS.dutyFreeLimitKg} კგ-ს აღემატება, ამანათში ${CUSTOMS.sameItemsLimit}+ ერთგვაროვანი ნივთია ან საქონელი კომერციულია.</li>
  <li>განბაჟებისას: დღგ ${CUSTOMS.vatRate * 100}% (ნივთი + მიწოდება) და მოსაკრებელი — ${CUSTOMS.fees.map(f => `${f.fee} ₾${Number.isFinite(f.upTo) ? ` (${f.upTo.toLocaleString("en-US")} ₾-მდე)` : " (ზემოთ)"}`).join(", ")}.</li>
  <li>ერთი მაღაზიიდან ერთ რეისზე ჩამოსული ამანათები შეიძლება დაჯამდეს.</li></ul>
  <p class="fine">საბაჟო გამოთვლა ყოველთვის შეფასებაა. საბოლოო თანხას ადგენს შემოსავლების სამსახური.</p>`;

// --- cross-country comparison (compare_items / compare_prices)
let CMP_BRAND = "";
async function compare(q) {
  const st = $("#cmp-status"), out = $("#cmp-out");
  if (q) return findBest(CMP_BRAND && !q.toLowerCase().includes(CMP_BRAND.toLowerCase()) ? `${CMP_BRAND} ${q}` : q);
  st.textContent = "იტვირთება…";
  try {
    const rows = await searchCompare("", CMP_BRAND);
    const items = rows.filter(it => (it.compare_prices || []).filter(p => Number(p.price) > 0).length > 1)
      .map(it => ({ it, c: compareItem(it, FXR.fx) })).sort((a, b) => (b.c.saving || 0) - (a.c.saving || 0));
    if (!items.length) { st.textContent = "შესადარებელი მონაცემი ჯერ არ არის."; out.hidden = true; return; }
    st.textContent = `მაგალითები: ${items.length} პროდუქტი რამდენიმე ქვეყანაში · დალაგებულია დანაზოგის მიხედვით · ფასები ოფიციალური საიტებიდან, ლარში — ეროვნული ბანკის კურსით`;
    out.className = "cmp-list"; out.innerHTML = items.slice(0, 12).map(x => compareCard(x.it, FXR.fx)).join(""); out.hidden = false;
  } catch (e) { console.error(e); st.textContent = ""; out.innerHTML = errorState("შედარების მონაცემები ვერ ჩაიტვირთა."); out.hidden = false; }
}
/** A typed product → the shared search engine: best price in Georgia first, then alternatives. */
async function findBest(q) {
  const st = $("#cmp-status"), out = $("#cmp-out"), full = `search.html?q=${encodeURIComponent(q)}`;
  out.className = ""; out.innerHTML = ""; out.hidden = true;
  st.innerHTML = `<span class="spin" aria-hidden="true"></span> ვეძებთ „${esc(q)}“ მაღაზიებში… (რამდენიმე წამი)`;
  try {
    const r = await findProducts(q, { fx: FXR.fx });
    const list = sortItems(r.items);
    if (!list.length) {
      const near = closestHTML(r.close || [], q, 5);
      st.innerHTML = (near ? "ზუსტი დამთხვევა არ არის — ქვემოთ ყველაზე ახლოს მყოფი შედეგებია." : `„${esc(q)}“ ჩვენს მაღაზიებში ვერ ვიპოვეთ.`) + esc(liveNote(r.live)) + ` <a class="srch-link" href="${full}">სრული ძიება — აქციები და სხვა მაღაზიები →</a>`;
      if (near) { out.innerHTML = near; out.hidden = false; }
      return;
    }
    groupItems(list);
    const best = pickBest(list), rest = list.filter(x => x !== best), brand = brandOf(list, r.terms), models = brand ? modelsOf(list, brand) : [];
    st.textContent = `${list.length} შეთავაზება ${storeCount(list)} მაღაზიაში · ზემოთ — საუკეთესო ფასი საქართველოში მიტანით, ქვემოთ — ალტერნატივები.` + liveNote(r.live);
    out.innerHTML = modelChipsHTML(models, q, brand) + bestCardHTML(best, brand ? { label: `ყველაზე იაფი ${brand} — ამ მაღაზიებში` } : undefined)
      + (rest.length ? `<h3 class="srch-h">ალტერნატივები <small>— დალაგებულია საქართველოში ჯამური ფასით</small></h3><ol class="srch-list">${rest.slice(0, 5).map((x, i) => rowHTML(x, i + 1)).join("")}</ol>` : "")
      + `<p class="srch-actions"><a class="srch-btn ghost" href="${full}">ყველა შედეგი და ვარიანტები (${list.length}) →</a></p>`;
    out.hidden = false;
  } catch (e) { console.error(e); st.textContent = "ძიება ახლა ვერ შესრულდა. სცადე მოგვიანებით."; }
}
async function initBrands() {
  try {
    const b = await sb("compare_items?select=brand&order=brand.asc&limit=1000");
    const brands = [...new Set(b.map(x => x.brand))];
    $("#cmp-brands").innerHTML = `<button type="button" data-brand="" aria-pressed="true">ყველა ბრენდი</button>` + brands.map(n => `<button type="button" data-brand="${esc(n)}" aria-pressed="false">${esc(n)}</button>`).join("");
    $("#cmp-sub").textContent = `ჩაწერე პროდუქტი — მაღაზიების საიტებზე ახლავე მოვძებნით და გაჩვენებთ საუკეთესო ფასს საქართველოში. ცარიელი ველით ჩანს ერთი და იგივე პროდუქტი ბრენდის სხვადასხვა ქვეყნის საიტზე (${brands.join(", ")}).`;
  } catch { /* chips stay default */ }
}
$("#cmp-form").addEventListener("submit", e => { e.preventDefault(); compare($("#cmp-q").value.trim()); });
$("#cmp-out").addEventListener("click", e => { const m = e.target.closest(".srch-mchip[data-q]"); if (!m) return; $("#cmp-q").value = m.dataset.q; compare(m.dataset.q); });

// --- optional external finder, only when an API is actually deployed
if (PRICE_SEARCH_API) {
  const f = $("#finder"); f.hidden = false;
  f.innerHTML = `<div class="panel" style="margin-top:18px"><h3>ძიება სხვა მაღაზიებში (BETA)</h3><form class="form-row" id="fd-form"><input id="fd-q" type="search" minlength="3" maxlength="90" required placeholder="მაგ. Adidas Samba OG B75806"><button class="btn btn-dark">ძებნა</button></form><p class="fine" id="fd-st" role="status"></p><div id="fd-out"></div></div>`;
  $("#fd-form").addEventListener("submit", async e => {
    e.preventDefault(); const st = $("#fd-st");
    st.textContent = "ვეძებ…";
    try { const d = await priceSearch($("#fd-q").value.trim(), ["it", "de", "gb", "es"]); const offers = (d.offers || []).filter(o => safeUrl(o.url) !== "#" && Number(o.price) > 0); st.textContent = `${offers.length} შედეგი`; $("#fd-out").innerHTML = offers.map(o => `<p><a class="link" href="${esc(safeUrl(o.url))}" target="_blank" rel="noopener noreferrer sponsored">${esc(o.store || "")}: ${esc(o.title || "")}</a> — ${esc(money(o.price, o.currency))}</p>`).join(""); }
    catch { st.textContent = "ძიება ახლა ვერ შესრულდა."; }
  });
}

// --- boot
try { FXR = await getFx(); } catch { /* handled in output */ }
$("#fx-line").textContent = fxLine(FXR);
syncRate(); calc();
initBrands(); compare("");
$("#cmp-brands").addEventListener("click", e => { const b = e.target.closest("[data-brand]"); if (!b) return; CMP_BRAND = b.dataset.brand; $("#cmp-brands").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); compare($("#cmp-q").value.trim()); });
