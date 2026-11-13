// Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { toGel, chargeableWeight, customsFor, landedCost } from "../assets/js/pricing.js";
import { computeDealScore, recommend, offerStatus, dealStatus, historyStats } from "../assets/js/score.js";
import { enrichOffer } from "../assets/js/intel.js";
import { safeUrl, money, esc } from "../assets/js/format.js";
import { matches } from "../assets/js/wishlist.js";

const FX = { EUR: 3, USD: 2.5, GBP: 3.5 };
const NOW = Date.parse("2026-11-11T10:00:00Z");
const offer = (o = {}) => ({
  id: "o1", product_id: "p1", current_price: 50, original_price: 100, currency: "EUR", discount_pct: 50,
  in_stock: true, status: "active", first_seen_at: "2026-10-20T00:00:00Z", last_seen_at: "2026-11-11T09:00:00Z",
  score_breakdown: { lowest: 50, average: 80, signal: "NEW_90D_LOW", penalty: 0 },
  products: { title: "Bag", brand: "X", sku: "123", category: "accessories", image_url: "https://x/y.jpg", stores: { name: "S", country: "IT" } },
  ...o
});

test("toGel handles missing rates without inventing zero", () => {
  assert.equal(toGel(10, "EUR", FX), 30);
  assert.equal(toGel(10, "GEL", FX), 10);
  assert.equal(toGel(10, "JPY", FX), null);
  assert.equal(toGel("abc", "EUR", FX), null);
});

test("volumetric weight wins when larger", () => {
  const w = chargeableWeight({ kg: 1, length: 60, width: 40, height: 30 });
  assert.equal(w.volumetric, 12);
  assert.equal(w.chargeable, 12);
  assert.equal(w.basis, "volumetric");
});

test("customs: free under 300 GEL / 30 kg, taxed above", () => {
  assert.equal(customsFor({ goodsGel: 299, shipGel: 20, kg: 1 }).total, 0);
  const c = customsFor({ goodsGel: 400, shipGel: 100, kg: 1 });
  assert.equal(c.taxable, true);
  assert.equal(Math.round(c.vat), 90);
  assert.equal(c.fee, 20);
  assert.equal(customsFor({ goodsGel: 10, kg: 31 }).taxable, true);
  assert.equal(customsFor({ goodsGel: 10, kg: 1, sameItems: true }).taxable, true);
});

test("landed cost: assumptions are flagged and result is never 'final' when assumed", () => {
  const l = landedCost({ price: 50, currency: "EUR", fx: FX, category: "shoes" });
  assert.ok(l.total > 150);
  assert.equal(l.isFinal, false);
  assert.ok(l.assumptions.some(a => a.includes("წონა")));
  assert.ok(l.assumptions.some(a => a.includes("საორიენტაციო")));
  const sum = l.lines.reduce((s, x) => s + x.gel, 0);
  assert.equal(Math.round(sum), Math.round(l.total));
});

test("landed cost returns null total when FX is missing", () => {
  const l = landedCost({ price: 50, currency: "EUR", fx: {} });
  assert.equal(l.total, null);
  assert.ok(l.missing.length >= 1);
});

test("status logic", () => {
  assert.equal(offerStatus(offer(), NOW), "ACTIVE");
  assert.equal(offerStatus(offer({ last_seen_at: "2026-11-01T00:00:00Z" }), NOW), "UNVERIFIED");
  assert.equal(offerStatus(offer({ in_stock: false }), NOW), "OUT_OF_STOCK");
  assert.equal(offerStatus(offer({ status: "expired" }), NOW), "EXPIRED");
  assert.equal(dealStatus({ status: "active", last_checked: "2026-11-09T00:00:00Z" }, NOW), "ACTIVE");
  assert.equal(dealStatus({ status: "active", last_checked: "2026-10-01T00:00:00Z" }, NOW), "UNVERIFIED");
  assert.equal(dealStatus({ status: "active", last_checked: null }, NOW), "UNVERIFIED");
  assert.equal(dealStatus({ status: "active", end_date: "2026-11-10T00:00:00Z", last_checked: "2026-11-10T00:00:00Z" }, NOW), "EXPIRED");
});

test("history stats from raw points", () => {
  const h = historyStats(offer(), [{ price: 80, observed_at: "2026-10-20T00:00:00Z" }, { price: 50, observed_at: "2026-11-10T00:00:00Z" }], NOW);
  assert.equal(h.points, 2);
  assert.equal(h.min, 50);
  assert.ok(h.spanDays > 20);
});

test("strong verified discount at historical low → BUY NOW", () => {
  const e = enrichOffer(offer(), FX, { now: NOW });
  assert.ok(e.scored.score >= 70, `score ${e.scored.score}`);
  assert.equal(e.rec.action, "BUY_NOW");
  // unknown factors are listed, not invented
  assert.ok(e.scored.factors.some(f => f.key === "store" && !f.available));
});

test("suspicious discount → SKIP", () => {
  const e = enrichOffer(offer({ score_breakdown: { lowest: 30, average: 80, penalty: -20 } }), FX, { now: NOW });
  assert.equal(e.rec.action, "SKIP");
});

test("no original price and fresh product → insufficient data", () => {
  const e = enrichOffer(offer({ original_price: null, discount_pct: 0, first_seen_at: "2026-11-10T00:00:00Z", score_breakdown: null }), FX, { now: NOW });
  assert.equal(e.rec.action, "INSUFFICIENT");
});

test("no FX → coverage drops and score is withheld", () => {
  const e = enrichOffer(offer({ first_seen_at: "2026-11-10T00:00:00Z" }), {}, { now: NOW });
  assert.equal(e.scored.score, null);
  assert.equal(e.rec.action, "INSUFFICIENT");
});

test("price used to be lower → WAIT", () => {
  const e = enrichOffer(offer({ current_price: 70, original_price: 80, discount_pct: 12.5, score_breakdown: { lowest: 50, average: 75, penalty: 0 } }), FX, { now: NOW });
  assert.equal(e.rec.action, "WAIT");
});

test("recommend handles null", () => assert.equal(recommend(null).action, "INSUFFICIENT"));

test("safeUrl blocks javascript: links; esc escapes", () => {
  assert.equal(safeUrl("javascript:alert(1)"), "#");
  assert.equal(safeUrl("https://a.com/x"), "https://a.com/x");
  assert.equal(esc(`<a href="x">`), "&lt;a href=&quot;x&quot;&gt;");
  assert.equal(money(12.5, "EUR"), "€12.50");
  assert.equal(money(null), "");
});

test("wishlist alert matching", () => {
  const state = { items: { "offer:p1": { type: "offer", id: "p1", targetPrice: 60 } }, brands: ["x"], minDiscount: 20 };
  const m = matches(state, [offer()]);
  assert.equal(m.filter(x => x.kind === "target").length, 1);
  assert.equal(m.filter(x => x.kind === "brand").length, 1);
});

import { compareItem } from "../assets/js/compare.js";
test("cross-country comparison recommends the cheapest in-stock landed price", () => {
  const item = { brand: "Speedo", code: "1", category: "fashion", weight_g: 84, compare_prices: [
    { country: "GB", currency: "GBP", price: 22.4, original_price: 32, in_stock: true },
    { country: "DE", currency: "EUR", price: 28, original_price: 35, in_stock: true },
    { country: "US", currency: "USD", price: 18, original_price: 60, in_stock: false }
  ] };
  const c = compareItem(item, { EUR: 3, USD: 2.5, GBP: 3.5 });
  assert.equal(c.best.country, "GB");          // 78.4 GEL vs 84 GEL; US is cheaper but out of stock
  assert.ok(c.saving > 0);
  assert.equal(c.weightAssumed, false);
  assert.equal(c.rows[c.rows.length - 1].country, "US");
});
