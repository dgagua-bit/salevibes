import { mountChrome, offerCard, dealCard, bindCardActions, emptyState, errorState, skeleton, $, $$ } from "../ui.js";
import { loadAll } from "../data.js";
import { subscribe } from "../api.js";
import { esc, money } from "../format.js";
import * as wl from "../wishlist.js";

mountChrome("saved");
$("#items").innerHTML = `<div class="grid">${skeleton(3)}</div>`;
let data;
bindCardActions(id => data?.byProduct.get(String(id)), id => data?.dealById.get(String(id)));

const INTERESTS = [["fashion", "ტანსაცმელი"], ["shoes", "ფეხსაცმელი"], ["beauty", "სილამაზე"], ["accessories", "აქსესუარები"], ["home", "სახლი"], ["luxury", "ლუქსი"], ["watches", "საათები"]];
$("#sub-int").innerHTML = INTERESTS.map(([k, l]) => `<button type="button" class="chip" data-i="${k}" aria-pressed="false">${l}</button>`).join("");

try { data = await loadAll(); render(); }
catch (e) { console.error(e); $("#items").innerHTML = errorState(); }
window.addEventListener("sv:wishlist", () => data && render());

function render() {
  const st = wl.load();
  const items = Object.values(st.items);
  const offers = items.filter(i => i.type === "offer").map(i => ({ i, e: data.byProduct.get(String(i.id)) }));
  const deals = items.filter(i => i.type === "deal").map(i => ({ i, d: data.dealById.get(String(i.id)) }));
  const gone = [...offers.filter(x => !x.e), ...deals.filter(x => !x.d)];

  let html = "";
  if (!items.length) html = emptyState("ჯერ არაფერი შეგინახავს. დააჭირე ♡-ს პროდუქტზე ან აქციაზე.", ` <a class="btn btn-primary" href="deals.html">შეთავაზებების ნახვა</a>`);
  if (offers.some(x => x.e)) html += `<div class="subhead"><h3>პროდუქტები</h3></div><div class="grid">${offers.filter(x => x.e).map(({ i, e }) => offerCard(e) + "").join("")}</div>`;
  if (deals.some(x => x.d)) html += `<div class="subhead"><h3>მაღაზიის აქციები</h3></div><div class="grid deals">${deals.filter(x => x.d).map(x => dealCard(x.d)).join("")}</div>`;
  if (gone.length) html += `<div class="subhead"><h3>აღარ არის აქტიური</h3><p>ვადა გაუვიდა ან მარაგში აღარ არის</p></div><ul class="list-plain">${gone.map(({ i }) => `<li><span>${esc(i.title || i.id)}</span><button type="button" class="btn btn-ghost" data-heart="${esc(i.type)}:${esc(i.id)}" aria-pressed="true">წაშლა</button></li>`).join("")}</ul>`;
  $("#items").innerHTML = html;

  // targets list under each saved product
  const targets = offers.filter(x => x.e && x.i.targetPrice);
  const m = wl.matches(st, data.offersRaw || []);
  $("#alerts").innerHTML = (m.length ? `<ul class="list-plain">${m.map(x => {
    const p = x.offer.products || {};
    return `<li><span><b>${x.kind === "target" ? "🎯 სამიზნე ფასი" : "🏷 შენი ბრენდი"}</b> · ${esc(p.title || "")} — ${money(x.offer.current_price, x.offer.currency)}${x.kind === "target" ? ` (სამიზნე ${money(x.item.targetPrice, x.offer.currency)})` : ` (−${Math.round(x.offer.discount_pct)}%)`}</span><a class="btn btn-ghost" href="product.html?id=${encodeURIComponent(x.offer.product_id)}">ნახვა</a></li>`;
  }).join("")}</ul>` : emptyState(targets.length || st.brands.length ? "ჯერ არცერთი პირობა არ შესრულებულა." : "სამიზნე ფასი პროდუქტის გვერდზე დააყენე, ან ქვემოთ აირჩიე ბრენდები."))
    + (targets.length ? `<p class="fine">აქტიური სამიზნეები: ${targets.map(({ i, e }) => `${esc(e.product.title)} ≤ ${money(i.targetPrice, e.offer.currency)}`).join("; ")}</p>` : "");

  $("#p-brand-list").innerHTML = [...new Set(data.enriched.map(e => e.product.brand).filter(Boolean))].sort().map(b => `<option value="${esc(b)}">`).join("");
  if (document.activeElement?.id !== "p-brands") $("#p-brands").value = st.brands.join(", ");
  if (document.activeElement?.id !== "p-disc") $("#p-disc").value = st.minDiscount || "";
}

$("#prefs").addEventListener("submit", e => {
  e.preventDefault();
  wl.setPrefs({ brands: $("#p-brands").value.split(","), minDiscount: $("#p-disc").value });
  $("#p-status").textContent = "✓ შენახულია ამ ბრაუზერში"; $("#p-status").className = "form-status ok";
});

$("#sub-int").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); });
$("#sub-form").addEventListener("submit", async e => {
  e.preventDefault();
  const st = $("#sub-status"), btn = e.target.querySelector("button[type=submit]");
  const email = $("#sub-email").value.trim().toLowerCase();
  const interests = $$("#sub-int [aria-pressed=true]").map(b => b.dataset.i);
  st.className = "form-status";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { st.textContent = "ჩაწერე სწორი ელფოსტა."; st.classList.add("err"); return; }
  if (!interests.length) { st.textContent = "აირჩიე ერთი ინტერესი მაინც."; st.classList.add("err"); return; }
  if (!$("#sub-consent").checked) { st.textContent = "ჩაწერისთვის საჭიროა თანხმობა."; st.classList.add("err"); return; }
  btn.disabled = true; st.textContent = "იწერება…";
  try {
    const c = await subscribe(email, interests);
    if (c === 201 || c === 204) { st.textContent = "✓ სიაში ხარ. შეტყობინებების გაშვებისას პირველი გაიგებ."; st.classList.add("ok"); e.target.reset(); $$("#sub-int [data-i]").forEach(b => b.setAttribute("aria-pressed", "false")); }
    else if (c === 409) { st.textContent = "ეს ელფოსტა უკვე სიაშია ✓"; st.classList.add("ok"); }
    else throw new Error(String(c));
  } catch { st.textContent = "ჩაწერა ვერ მოხერხდა. სცადე მოგვიანებით."; st.classList.add("err"); }
  finally { btn.disabled = false; }
});
