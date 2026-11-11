/** Pure formatting / safety helpers (no DOM access, testable in Node). */
import { COUNTRIES, CATEGORIES, CURRENCY_SYMBOL, FLAGS } from "./config.js";

export const MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];

export const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Only http(s) links leave the site. Anything else becomes "#". */
export function safeUrl(u) {
  try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:" ? x.href : "#"; } catch { return "#"; }
}
export function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } }

export const countryName = c => COUNTRIES[String(c || "").toUpperCase()] || c || "";
export const flag = c => FLAGS[String(c || "").toUpperCase()] || "";
export const catLabel = c => CATEGORIES[String(c || "").toLowerCase()] || c || "";

export const num = v => (v === null || v === undefined || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);

export function money(v, cur = "EUR") {
  const n = num(v); if (n === null) return "";
  const s = n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const sym = CURRENCY_SYMBOL[cur];
  return cur === "GEL" ? `${s} ₾` : sym ? `${sym}${s}` : `${s} ${cur}`;
}
export const gelText = v => (num(v) === null ? "" : `${Math.round(v).toLocaleString("en-US")} ₾`);
export const pct = v => (num(v) === null ? "" : `${Math.round(v)}%`);

export function dateKa(v) {
  const d = v instanceof Date ? v : new Date(v);
  if (!v || isNaN(d)) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "შემოწმდა 3 სთ-ის წინ" — relative age of a timestamp. */
export function ago(v, now = Date.now()) {
  const d = new Date(v); if (!v || isNaN(d)) return "";
  const m = Math.max(0, Math.floor((now - d) / 6e4));
  if (m < 1) return "ახლახან";
  if (m < 60) return `${m} წთ-ის წინ`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} სთ-ის წინ`;
  const days = Math.floor(h / 24); return `${days} დღის წინ`;
}
export const daysBetween = (a, b = Date.now()) => (new Date(b) - new Date(a)) / 864e5;
