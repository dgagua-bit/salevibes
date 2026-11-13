/**
 * Cross-country price comparison for one brand's regional sites.
 * Given a compare_items row with its compare_prices, it converts every price to GEL,
 * estimates the landed cost in Georgia for each country, and recommends the cheapest
 * option that is in stock. Pure functions + one HTML renderer; no network.
 */
import { landedCost, toGel } from "./pricing.js";
import { esc, safeUrl, money, gelText, dateKa, countryName, flag } from "./format.js";

/** @returns {{rows, best, saving, weightKg, weightAssumed}} rows sorted by landed cost (in-stock first) */
export function compareItem(item, fx) {
  const weightKg = item.weight_g ? item.weight_g / 1000 : null;
  const rows = (item.compare_prices || [])
    .filter(p => Number(p.price) > 0)
    .map(p => {
      const gel = toGel(p.price, p.currency, fx);
      const l = landedCost({ price: p.price, currency: p.currency, fx, kg: weightKg || undefined, category: item.category || "fashion" });
      const orig = Number(p.original_price) > Number(p.price) ? Number(p.original_price) : null;
      return { ...p, gel, landed: l.total, disc: orig ? Math.round((1 - p.price / orig) * 100) : 0, customs: !!(l.customs && l.customs.taxable) };
    })
    .sort((a, b) => (b.in_stock !== false) - (a.in_stock !== false) || (a.landed ?? Infinity) - (b.landed ?? Infinity));
  const inStock = rows.filter(r => r.in_stock !== false && r.landed !== null);
  const best = inStock[0] || null;
  const worst = inStock.length > 1 ? inStock[inStock.length - 1] : null;
  return { rows, best, saving: best && worst ? worst.landed - best.landed : 0, weightKg, weightAssumed: !weightKg };
}

/** One product card: recommendation on top, then every country with its price. */
export function compareCard(item, fx) {
  const c = compareItem(item, fx);
  const title = item.title_en || item.title || item.code;
  const checked = (item.compare_prices || []).map(p => p.checked_at).sort().pop();
  const rec = c.best
    ? `<div class="cmp-rec"><span class="cmp-rec-k">რეკომენდაცია</span><b>ყველაზე ხელსაყრელია: ${flag(c.best.country)} ${esc(countryName(c.best.country))}</b>
       <span>≈ ${gelText(c.best.landed)} საქართველოში${c.saving >= 1 ? ` · დაზოგავ ≈ ${gelText(c.saving)} ყველაზე ძვირ ვარიანტთან შედარებით` : ""}</span>
       <a href="${esc(safeUrl(c.best.url))}" target="_blank" rel="noopener noreferrer sponsored">მაღაზიაში ნახვა ↗</a>
       <button type="button" class="cmp-save" data-save-compare="${esc(item.id)}" data-title="${esc(title)}" data-url="${esc(safeUrl(c.best.url))}" data-currency="${esc(c.best.currency)}" data-price="${esc(c.best.price)}">♡ კაბინეტში შენახვა</button></div>`
    : `<div class="cmp-rec off"><b>რეკომენდაციისთვის მონაცემები არასაკმარისია</b><span>პროდუქტი არცერთ ქვეყანაში არ არის მარაგში ან კურსი მიუწვდომელია.</span></div>`;
  const rows = c.rows.map(r => `<tr class="${r === c.best ? "is-best" : ""}${r.in_stock === false ? " is-out" : ""}">
      <td>${flag(r.country)} ${esc(countryName(r.country))}</td>
      <td class="num">${r.url ? `<a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer sponsored">${money(r.price, r.currency)}</a>` : money(r.price, r.currency)}${r.disc ? ` <em>−${r.disc}%</em>` : ""}</td>
      <td class="num">${r.gel !== null ? gelText(r.gel) : "—"}</td>
      <td class="num"><b>${r.landed !== null ? "≈ " + gelText(r.landed) : "—"}</b>${r.customs ? `<small>საბაჟოთი</small>` : ""}</td>
      <td>${r.in_stock === false ? "არ არის მარაგში" : r === c.best ? "ყველაზე იაფი" : ""}</td></tr>`).join("");
  return `<article class="cmp-card">
    <div class="cmp-head">${item.image_url ? `<img src="${esc(safeUrl(item.image_url))}" alt="" loading="lazy" onerror="this.remove()">` : ""}
      <div><small>${esc(item.brand)} · კოდი ${esc(item.code)}</small><h3>${esc(title)}</h3></div></div>
    ${rec}
    <div class="cmp-scroll"><table class="cmp-table"><thead><tr><th>ქვეყანა</th><th class="num">ფასი</th><th class="num">ლარში</th><th class="num">საქართველოში</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="cmp-note">„საქართველოში“ = ნივთი + ტრანსპორტირება (${c.weightAssumed ? "წონა დაშვებულია კატეგორიის მიხედვით" : `${c.weightKg.toFixed(2)} კგ, მაღაზიის მონაცემით`}; ტარიფი საორიენტაციო) + საბაჟო, თუ საჭიროა. შეფასებაა და არა გარანტია.${checked ? ` ფასები შემოწმდა ${esc(dateKa(checked))}.` : ""}</p>
  </article>`;
}

export const COMPARE_CSS = `
.cmp-list{display:grid;gap:22px;margin-top:18px}
.cmp-card{border:1px solid #bcb4a7;background:#f6f4ef;padding:22px;min-width:0}
.cmp-head{display:flex;gap:16px;align-items:center}.cmp-head img{width:72px;height:72px;object-fit:cover;background:#fff;flex:none}
.cmp-head small{font-size:10.5px;letter-spacing:1px;color:#746c63;text-transform:uppercase}.cmp-head h3{font:400 19px/1.4 'Noto Serif Georgian',Georgia,serif;margin:4px 0 0}
.cmp-rec{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:baseline;border-left:3px solid #3f6b4a;background:#e9ecdf;padding:12px 14px;margin:16px 0}
.cmp-rec b{font-size:14px;color:#2f5238}.cmp-rec span{font-size:12.5px;color:#3a3532}.cmp-rec a{font-size:12px;border-bottom:1px solid;color:#3f6b4a;margin-left:auto}
.cmp-rec-k{font-size:10px!important;letter-spacing:1.5px;text-transform:uppercase;color:#3f6b4a!important;width:100%}
.cmp-save{border:1px solid #3f6b4a;background:none;color:#3f6b4a;padding:6px 11px;font-size:12px;cursor:pointer}.cmp-save:hover{background:#3f6b4a;color:#fff}
.cmp-rec.off{border-color:#8a5a12;background:#f3ead9}.cmp-rec.off b{color:#8a5a12}
.cmp-scroll{overflow-x:auto}.cmp-table{width:100%;border-collapse:collapse;font-size:13px}
.cmp-table th,.cmp-table td{padding:9px 8px 9px 0;border-bottom:1px solid #d6cfc4;text-align:left;white-space:nowrap}
.cmp-table th{font-size:10.5px;letter-spacing:1px;color:#746c63;font-weight:500}.cmp-table .num{text-align:right;font-variant-numeric:tabular-nums}
.cmp-table em{font-style:normal;color:#9f2529;font-weight:700;font-size:11px}.cmp-table small{display:block;font-size:10px;color:#8a5a12}
.cmp-table tr.is-best td{background:#e9ecdf}.cmp-table tr.is-best td:last-child{color:#3f6b4a;font-weight:700}.cmp-table tr.is-out td{color:#9a918a}
.cmp-note{font-size:11.5px;color:#746c63;line-height:1.7;margin:10px 0 0}
.cmp-brands{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 4px}.cmp-brands button{border:1px solid #bcb4a7;background:none;padding:8px 13px;font-size:12.5px;cursor:pointer}
.cmp-brands button[aria-pressed="true"]{background:#181614;color:#fff;border-color:#181614}.cmp-brands button:hover{border-color:#181614}
.cmp-blocked{font-size:12px;color:#746c63;margin:6px 0 0}
@media(max-width:600px){.cmp-card{padding:16px}.cmp-rec a{margin-left:0}}`;
