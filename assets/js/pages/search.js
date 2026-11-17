/**
 * Search page: best price in Georgia first, then alternatives, variant chips, matching store sales.
 * The matching and pricing live in ../search-engine.js (shared with the home page and tools.html).
 */
import { mountChrome, $, emptyState, dealCard, bindCardActions } from "../ui.js";
import { esc, flag, countryName, hostOf, catLabel } from "../format.js";
import { getStores, getDeals } from "../api.js";
import { CATEGORIES } from "../config.js";
import { SYN, norm, queryTerms, findProducts, groupItems, sortItems, pickBest, storeCount, bestCardHTML, rowHTML, listHeadHTML, SEARCH_CSS } from "../search-engine.js";

mountChrome("search");
document.head.insertAdjacentHTML("beforeend", `<style>${SEARCH_CSS}</style>`);
const params = new URLSearchParams(location.search);
const S = { q: (params.get("q") || "").trim(), sort: "landed", stock: true, items: [], similar: [], live: null, group: null, deals: [], cats: [], browse: false };
const dealById = new Map();
bindCardActions(null, id => dealById.get(String(id)));
const sorted = list => sortItems(list, S);

/* store promotions and categories that match the query (e.g. "Zara", "ფეხსაცმელი") */
function matchDeals(deals, terms) {
  const qWords = norm(S.q).split(" ").filter(Boolean);
  return (deals || []).filter(d => {
    const hay = norm(`${d.store} ${d.title} ${d.description || ""} ${catLabel(d.category)} ${countryName(d.country)}`);
    if (qWords.every(w => hay.includes(w))) return true;
    const storeWords = norm(d.store).split(" ");
    return terms.some(t => t.length >= 3 && storeWords.includes(t));
  }).sort((a, b) => (b.deal_score || 0) - (a.deal_score || 0));
}
function matchCats() {
  const qn = norm(S.q); if (qn.length < 3) return [];
  return Object.entries(CATEGORIES).filter(([, label]) => { const l = norm(label); return l.includes(qn) || qn.includes(l); }).map(([k, label]) => ({ k, label }));
}
function dealsBlock(primary) {
  if (!S.deals.length) return "";
  const list = S.deals.slice(0, primary ? 9 : 3);
  return `<section class="srch-deals"><h2 class="srch-h">${primary ? "აქციები ამ ძიებაზე" : "ამ ბრენდის მაღაზიების აქციები"} <small>— ფასდაკლება მთელ მაღაზიაში ან კოლექციაზე</small></h2>
    <div class="grid deals">${list.map(dealCard).join("")}</div>
    ${S.deals.length > list.length ? `<p class="more"><a class="btn btn-ghost" href="deals.html?q=${encodeURIComponent(S.q)}">ყველა აქცია (${S.deals.length}) →</a></p>` : ""}</section>`;
}
const catBlock = () => S.cats.length ? `<p class="srch-cats">${S.cats.map(c => `<a class="chip" href="deals.html?cat=${esc(c.k)}">კატეგორია: <b>${esc(c.label)}</b> — ყველა აქცია და პროდუქტი →</a>`).join("")}</p>` : "";
const sortNote = () => S.sort === "landed" ? "საქართველოში ჯამური ფასით" : "ფასდაკლებით";

function render() {
  const out = $("#s-out"), list = sorted(S.items);
  $("#s-count").textContent = [S.items.length ? `${S.items.length} პროდუქტი · ${storeCount(S.items)} მაღაზია` : "", S.deals.length ? `${S.deals.length} აქცია` : ""].filter(Boolean).join(" · ");
  $("#s-elsewhere").hidden = false;
  if (!list.length) {
    out.innerHTML = catBlock()
      + (S.deals.length ? dealsBlock(true) : emptyState(S.items.length ? "მარაგში ვერ ვიპოვეთ — მოხსენი „მხოლოდ მარაგში“." : `„${esc(S.q)}“ ჩვენს მაღაზიებში ვერ ვიპოვეთ. სცადე უფრო მოკლედ (მაგ. მხოლოდ ბრენდი და მოდელი) ან ინგლისურად.`))
      + (S.similar.length ? `<h2 class="srch-h">შეიძლება ეძებდი</h2><ol class="srch-list">${sorted(S.similar).slice(0, 12).map(rowHTML).join("")}</ol>` : "");
    return;
  }
  if (S.browse) { // a bare category word: the category and its sales first, then products — no single "best" product
    out.innerHTML = catBlock() + dealsBlock(true)
      + `<h2 class="srch-h">პროდუქტები <small>— დალაგებულია ${sortNote()}</small></h2><ol class="srch-list">${list.slice(0, 40).map(rowHTML).join("")}</ol>`;
    return;
  }
  const groups = groupItems(list);
  const sel = S.group != null ? groups.find(g => g.key === S.group) : null;
  const pool = sorted(sel ? sel.items : list);
  const best = pickBest(pool);
  const rest = pool.filter(x => x !== best);
  const multi = groups.filter(g => g.items.length > 1).slice(0, 8);
  const chips = multi.length && groups.length > 1 ? `<div class="srch-variants"><p>ზუსტად რომელი? <small>აირჩიე — შევადარებთ მხოლოდ ამ პროდუქტის ფასებს</small></p><div class="chips">
      <button type="button" class="chip" data-g="" aria-pressed="${S.group == null}">ყველა (${list.length})</button>
      ${multi.map(g => `<button type="button" class="chip" data-g="${esc(g.key)}" aria-pressed="${S.group === g.key}">${esc(g.label.length > 44 ? g.label.slice(0, 42) + "…" : g.label)} <b>${g.stores > 1 ? g.stores + " მაღაზია" : g.items.length}</b></button>`).join("")}</div></div>` : "";
  out.innerHTML = catBlock() + chips + bestCardHTML(best)
    + (rest.length ? `<h2 class="srch-h">ალტერნატივები <small>— დალაგებულია ${sortNote()}</small></h2>${listHeadHTML()}<ol class="srch-list">${rest.slice(0, 60).map((x, i) => rowHTML(x, i + 1)).join("")}</ol>` : "")
    + (S.similar.length ? `<details class="srch-more"><summary>მსგავსი პროდუქტები — საბავშვო, აქსესუარები და ნაწილობრივი დამთხვევები (${S.similar.length})</summary><ol class="srch-list">${sorted(S.similar).slice(0, 30).map(rowHTML).join("")}</ol></details>` : "")
    + dealsBlock(false);
}

function elsewhere(stores) {
  const q = S.q, terms = queryTerms(q);
  const big = (stores || []).filter(s => s.platform !== "shopify");
  const brandHit = big.filter(s => (s.brands || []).some(b => terms.some(t => t.length > 2 && norm(b).includes(t))));
  const pick = [...brandHit, ...big.filter(s => !brandHit.includes(s) && /fashion|shoes|beauty|luxury/.test(s.category || ""))].slice(0, 10);
  $("#s-elsewhere").innerHTML = `<h2 class="srch-h">სხვა მაღაზიებშიც შეამოწმე</h2>
    <p class="fine">ამ მაღაზიების საიტები ავტომატურ ძიებას არ გვაძლევს, ამიტომ მათ ფასებს აქ ვერ ვაჩვენებთ. დააჭირე — Google-ში ამ მაღაზიის საიტზე მოიძებნება.</p>
    <div class="chips">${pick.map(s => `<a class="chip" href="https://www.google.com/search?q=${encodeURIComponent(q + " site:" + hostOf(s.base_url))}" target="_blank" rel="noopener noreferrer">${flag(s.country)} ${esc(s.name)} ↗</a>`).join("")}
    <a class="chip" href="https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q)}" target="_blank" rel="noopener noreferrer">Google Shopping ↗</a></div>`;
}

async function run() {
  $("#s-q").value = S.q;
  if (!S.q) { $("#s-out").innerHTML = emptyState("ჩაწერე პროდუქტის სახელი, მაგ. „Adidas Samba“ ან „Dior Sauvage 100ml“."); return; }
  document.title = `${S.q} — ძიება — SaleVibes`;
  $("#s-out").innerHTML = `<div class="srch-loading"><span class="spin" aria-hidden="true"></span> ვეძებთ „${esc(S.q)}“ მაღაზიებში… (რამდენიმე წამი)</div>`;
  const [found, stores, deals] = await Promise.allSettled([findProducts(S.q), getStores(), getDeals()]);
  const r = found.status === "fulfilled" ? found.value : { terms: queryTerms(S.q), items: [], similar: [], live: null };
  const allDeals = deals.status === "fulfilled" ? deals.value || [] : [];
  allDeals.forEach(d => dealById.set(String(d.id), d));
  S.items = r.items; S.similar = r.similar; S.live = r.live;
  S.deals = matchDeals(allDeals, r.terms); S.cats = matchCats();
  const synWords = new Set(Object.values(SYN));
  S.browse = S.cats.length > 0 && r.terms.every(t => synWords.has(t) || S.cats.some(c => norm(c.label).includes(t)));
  $("#s-src").textContent = S.live ? `ძიება ${S.live.stores_answered} მაღაზიის საიტზე ახლავე + ჩვენი კატალოგი. ფასები: ${new Date(S.live.at).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}.` : "მაღაზიების პირდაპირი ძიება ახლა მიუწვდომელია — ნაჩვენებია მხოლოდ ჩვენი კატალოგი.";
  elsewhere(stores.status === "fulfilled" ? stores.value : []);
  render();
}

$("#s-form").addEventListener("submit", e => {
  e.preventDefault(); const q = $("#s-q").value.trim(); if (!q) return;
  S.q = q; S.group = null; history.replaceState(null, "", `?q=${encodeURIComponent(q)}`); run();
});
$("#s-out").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (!b) return; S.group = b.dataset.g || null; render(); $("#s-out").scrollIntoView({ block: "start", behavior: "smooth" }); });
$("#s-sort").addEventListener("change", e => { S.sort = e.target.value; render(); });
$("#s-stock").addEventListener("change", e => { S.stock = e.target.checked; render(); });
run();
