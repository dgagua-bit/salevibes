/**
 * Landed-cost model: what an item costs once it reaches Georgia.
 *
 *   item price + domestic shipping (store → forwarder warehouse)
 * + international shipping (chargeable kg × $/kg)
 * + forwarder service fee
 * + customs (VAT + processing fee, only when the parcel is taxable)
 * = estimated total in GEL
 *
 * Pure functions — no DOM, no network. Every result says which inputs were
 * assumed vs. provided, so the UI can label it "estimate" vs. "final".
 */
import { CUSTOMS, ESTIMATE_DEFAULTS, CARRIERS } from "./config.js";

/** Convert an amount to GEL using NBG rates ({EUR: 2.91, ...}). null if the rate is missing. */
export function toGel(amount, currency, fx) {
  const a = Number(amount);
  if (!Number.isFinite(a)) return null;
  if (currency === "GEL") return a;
  const r = fx && Number(fx[currency]);
  return r > 0 ? a * r : null;
}

/** Chargeable weight = max(actual, volumetric). Dimensions in cm. */
export function chargeableWeight({ kg, length, width, height, divisor = ESTIMATE_DEFAULTS.volumetricDivisor } = {}) {
  const actual = Number(kg) > 0 ? Number(kg) : 0;
  const dims = [length, width, height].map(Number);
  const volumetric = dims.every(d => d > 0) ? (dims[0] * dims[1] * dims[2]) / divisor : 0;
  const chargeable = Math.max(actual, volumetric);
  return { actual, volumetric, chargeable, basis: volumetric > actual ? "volumetric" : "actual" };
}

/** Customs for a personal parcel. Values in GEL. */
export function customsFor({ goodsGel, shipGel = 0, kg = 0, personal = true, sameItems = false, rules = CUSTOMS }) {
  const reasons = [];
  if (goodsGel > rules.dutyFreeLimitGel) reasons.push(`ღირებულება ${rules.dutyFreeLimitGel} ₾-ზე მეტია`);
  if (kg > rules.dutyFreeLimitKg) reasons.push(`წონა ${rules.dutyFreeLimitKg} კგ-ზე მეტია`);
  if (!personal) reasons.push("კომერციული დანიშნულება");
  if (sameItems) reasons.push(`${rules.sameItemsLimit}+ ერთნაირი ნივთი`);
  if (!reasons.length) return { taxable: false, vat: 0, fee: 0, total: 0, reasons };
  const fee = rules.fees.find(f => goodsGel <= f.upTo).fee;
  const vat = (goodsGel + shipGel) * rules.vatRate;
  return { taxable: true, vat, fee, total: vat + fee, reasons };
}

/** Look up a carrier's rate for an origin country. Returns null when we have none. */
export function carrierRate(carrierId, origin) {
  const c = CARRIERS.find(x => x.id === carrierId);
  const r = c && c.rates[String(origin || "").toUpperCase()];
  return r ? { ...r, carrier: c.name } : null;
}

/**
 * Full breakdown.
 * @param {object} p
 *   price, currency, fx                — item price in store currency
 *   domesticShipping (store currency)  — optional, default 0 (free shipping assumed → flagged)
 *   kg | {length,width,height}         — weight; if missing, category default is used (flagged)
 *   category                           — for default weight
 *   usdPerKg, rateStatus               — international rate; if missing, ESTIMATE_DEFAULTS (flagged)
 *   serviceFeeGel                      — optional forwarder fee
 *   personal, sameItems                — customs flags
 * @returns {{lines, total, assumptions, missing, isFinal, customs}}
 */
export function landedCost(p) {
  const assumptions = [];
  const missing = [];
  const fx = p.fx || {};
  const goodsGel = toGel(p.price, p.currency, fx);
  if (goodsGel === null) missing.push(`${p.currency} კურსი`);
  if (!fx.USD) missing.push("USD კურსი");

  let domestic = Number(p.domesticShipping);
  if (!(domestic >= 0) || p.domesticShipping === undefined || p.domesticShipping === null || p.domesticShipping === "") {
    domestic = 0; assumptions.push("მაღაზიის შიდა მიწოდება უფასოდ ჩაითვალა");
  }
  const domesticGel = toGel(domestic, p.currency, fx);

  let w = chargeableWeight({ kg: p.kg, length: p.length, width: p.width, height: p.height, divisor: p.divisor });
  let weightSource = "user";
  if (!w.chargeable) {
    const def = ESTIMATE_DEFAULTS.weightKgByCategory[String(p.category || "").toLowerCase()] ?? ESTIMATE_DEFAULTS.fallbackWeightKg;
    w = { actual: def, volumetric: 0, chargeable: def, basis: "assumed" };
    weightSource = "assumed";
    assumptions.push(`წონა დაშვებულია ~${def} კგ (კატეგორიის მიხედვით)`);
  } else if (w.basis === "volumetric") {
    assumptions.push(`გამოყენებულია მოცულობითი წონა ${w.volumetric.toFixed(2)} კგ`);
  }

  let rate = Number(p.usdPerKg);
  let rateStatus = p.rateStatus || "USER";
  if (!(rate > 0)) {
    rate = ESTIMATE_DEFAULTS.usdPerKg; rateStatus = "ASSUMED";
    assumptions.push(`ტრანსპორტირება: $${rate}/კგ — საორიენტაციო ტარიფი (ამ ქვეყნიდან გადამოწმებული ტარიფი არ გვაქვს)`);
  }
  const shipGel = fx.USD ? w.chargeable * rate * fx.USD : null;
  const serviceGel = Number(p.serviceFeeGel) > 0 ? Number(p.serviceFeeGel) : 0;

  if (goodsGel === null || shipGel === null) {
    return { lines: [], total: null, assumptions, missing, isFinal: false, customs: null, weight: w };
  }
  const customs = customsFor({ goodsGel: goodsGel + domesticGel, shipGel, kg: w.chargeable, personal: p.personal !== false, sameItems: !!p.sameItems });
  if (CUSTOMS.status !== "VERIFIED") assumptions.push("საბაჟო წესები rs.ge-ზე ჯერ არ გადაგვიმოწმებია");

  const lines = [
    { key: "goods", label: "ნივთის ფასი", gel: goodsGel },
    { key: "domestic", label: "შიდა მიწოდება (მაღაზია → საწყობი)", gel: domesticGel },
    { key: "shipping", label: `საერთაშორისო ტრანსპორტირება (${w.chargeable.toFixed(2)} კგ × $${rate})`, gel: shipGel },
    { key: "service", label: "გადამზიდავის მომსახურება", gel: serviceGel },
    { key: "vat", label: "დღგ 18% (საბაჟო)", gel: customs.vat },
    { key: "fee", label: "საბაჟო მოსაკრებელი", gel: customs.fee }
  ];
  const total = lines.reduce((s, l) => s + l.gel, 0);
  const isFinal = weightSource === "user" && rateStatus === "VERIFIED" && CUSTOMS.status === "VERIFIED" && assumptions.length === 0;
  return { lines, total, assumptions, missing, isFinal, customs, weight: w, goodsGel, rate, rateStatus };
}

/** Quick estimate for a card (uses category weight + default rate, all flagged). */
export function estimateForOffer(offer, fx) {
  const p = offer.products || {};
  return landedCost({ price: offer.current_price, currency: offer.currency || "EUR", fx, category: p.category });
}
