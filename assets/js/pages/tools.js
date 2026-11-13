import { mountChrome, breakdown, fxLine, errorState, $ } from "../ui.js";
import { getFx, searchCompare, priceSearch } from "../api.js";
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
async function compare(q) {
  const st = $("#cmp-status"), out = $("#cmp-out");
  st.textContent = "ვეძებ…";
  try {
    const rows = await searchCompare(q);
    const items = rows.map(it => {
      const prices = (it.compare_prices || []).filter(p => Number(p.price) > 0).map(p => ({ ...p, gel: toGel(p.price, p.currency, FXR.fx) }));
      const valid = prices.filter(p => p.gel !== null && p.in_stock !== false);
      const best = valid.length > 1 ? valid.reduce((a, b) => (b.gel < a.gel ? b : a)) : null;
      return { it, prices, best };
    }).filter(x => x.prices.length > 1);
    if (!items.length) { st.textContent = q ? "ამ ძიებით რამდენიმე ქვეყანაში ნაპოვნი პროდუქტი არ გვაქვს." : "შესადარებელი მონაცემი ჯერ არ არის."; out.hidden = true; return; }
    const countries = [...new Set(items.flatMap(x => x.prices.map(p => p.country)))];
    const lastCheck = items.flatMap(x => x.prices.map(p => p.checked_at)).sort().pop();
    const brands = [...new Set(items.map(x => x.it.brand))].join(", ");
    st.textContent = `${items.length} პროდუქტი · ${brands} · ბოლო შემოწმება ${dateKa(lastCheck)} · ფასები ოფიციალური საიტებიდან, ლარში — ეროვნული ბანკის კურსით`;
    out.innerHTML = `<table class="data-table"><thead><tr><th>პროდუქტი</th>${countries.map(c => `<th class="num">${flag(c)} ${esc(countryName(c))}</th>`).join("")}<th>იაფია</th></tr></thead><tbody>${items.slice(0, 40).map(({ it, prices, best }) => `<tr><td><b>${esc(it.title || it.code)}</b><br><small class="muted">${esc(it.brand)} · კოდი ${esc(it.code)}</small></td>${countries.map(c => { const p = prices.find(x => x.country === c); return `<td class="num">${p ? `${p.url ? `<a href="${esc(safeUrl(p.url))}" target="_blank" rel="noopener noreferrer sponsored">${money(p.price, p.currency)}</a>` : money(p.price, p.currency)}<br><small class="muted">${p.gel !== null ? "≈ " + gelText(p.gel) : "კურსი არ არის"}${p.in_stock === false ? " · არ არის მარაგში" : ""}</small>` : "—"}</td>`; }).join("")}<td>${best ? `${flag(best.country)} ${esc(countryName(best.country))}` : "—"}</td></tr>`).join("")}</tbody></table><p class="fine">შედარება მხოლოდ ნივთის ფასს ეხება — მიწოდება და საბაჟო ქვეყნების მიხედვით განსხვავდება; გამოიყენე კალკულატორი.</p>`;
    out.hidden = false;
  } catch (e) { console.error(e); st.textContent = ""; out.innerHTML = errorState("შედარების მონაცემები ვერ ჩაიტვირთა."); out.hidden = false; }
}
$("#cmp-form").addEventListener("submit", e => { e.preventDefault(); compare($("#cmp-q").value.trim()); });

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
compare("");
