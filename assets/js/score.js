/**
 * SaleVibes Deal Score + buying recommendation.
 *
 * Transparent, factor-based, and honest about gaps: each factor is either
 * scored from real data or marked `available:false`. The 0–100 score is the
 * share of points earned among the factors we *can* evaluate, and it is only
 * shown when enough of the total weight is covered.
 *
 * Pure functions — no DOM, no network.
 */
import { FRESHNESS } from "./config.js";
import { daysBetween } from "./format.js";

export const MIN_COVERAGE = 0.6;
export const MIN_HISTORY_DAYS = 7;

/** Offer status shown to the user: ACTIVE | UNVERIFIED | OUT_OF_STOCK | EXPIRED */
export function offerStatus(o, now = Date.now()) {
  if (!o) return "UNVERIFIED";
  if (o.status === "expired") return "EXPIRED";
  if (o.in_stock === false) return "OUT_OF_STOCK";
  if (o.status !== "active") return "UNVERIFIED";
  if (!o.last_seen_at || (now - new Date(o.last_seen_at)) / 36e5 > FRESHNESS.offerVerifiedHours) return "UNVERIFIED";
  return "ACTIVE";
}

/** Store-level promotion status. */
export function dealStatus(d, now = Date.now()) {
  if (!d) return "UNVERIFIED";
  if (d.status === "expired" || (d.end_date && new Date(d.end_date).getTime() < now)) return "EXPIRED";
  if (!d.last_checked || daysBetween(d.last_checked, now) > FRESHNESS.dealVerifiedDays) return "UNVERIFIED";
  return "ACTIVE";
}

/**
 * Summarise price history.
 * Accepts either raw points [{price, observed_at}] or falls back to the engine's
 * score_breakdown {lowest, average, signal} + first_seen_at.
 */
export function historyStats(offer, points, now = Date.now()) {
  const cur = Number(offer.current_price);
  if (Array.isArray(points) && points.length) {
    const ps = points.map(p => ({ price: Number(p.price), t: new Date(p.observed_at).getTime() })).filter(p => p.price > 0 && p.t).sort((a, b) => a.t - b.t);
    if (!ps.length) return null;
    const spanDays = Math.max(daysBetween(ps[0].t, now), offer.first_seen_at ? daysBetween(offer.first_seen_at, now) : 0);
    const min = Math.min(...ps.map(p => p.price), cur);
    const avg = ps.reduce((s, p) => s + p.price, 0) / ps.length;
    const flat = ps.every(p => p.price === ps[0].price) && ps[0].price === cur;
    return { source: "history", points: ps.length, spanDays, min, avg, current: cur, first: ps[0].price, flat };
  }
  const b = offer.score_breakdown;
  if (b && b.lowest != null && offer.first_seen_at) {
    const min = Math.min(Number(b.lowest), cur);
    return { source: "engine", points: null, spanDays: daysBetween(offer.first_seen_at, now), min, avg: Number(b.average), current: cur, first: null, signal: b.signal, flat: min === cur && Number(b.average) === cur };
  }
  return null;
}

const factor = (key, label, max, points, note, available = true) => ({ key, label, max, points: available ? Math.max(0, Math.min(max, points)) : 0, note, available });

/**
 * @param offer  row from `offers` with nested products(…, stores(…))
 * @param opts   { history: stats from historyStats(), landed: result of landedCost(), now }
 */
export function computeDealScore(offer, { history = null, landed = null, now = Date.now() } = {}) {
  const p = offer.products || {};
  const cur = Number(offer.current_price);
  const orig = Number(offer.original_price);
  const hasOrig = orig > 0 && orig > cur;
  const disc = hasOrig ? (1 - cur / orig) * 100 : 0;
  const factors = [];

  // 1. Real savings vs. the store's own previous price
  factors.push(factor("savings", "რეალური დანაზოგი", 25, disc * 0.5,
    hasOrig ? `−${Math.round(disc)}% (${orig} → ${cur} ${offer.currency})` : "მაღაზია ძველ ფასს არ უთითებს — ფასდაკლება არ ფიქსირდება"));

  // 2. Price vs. its own history
  const histOk = history && history.spanDays >= MIN_HISTORY_DAYS;
  let hPts = 0, hNote = "ისტორია 7 დღეზე ნაკლებია — ჯერ ვერ ვაფასებთ";
  if (histOk) {
    const aboveMin = history.min > 0 ? cur / history.min - 1 : 0;
    const stable = !!history.flat;
    if (stable) { hPts = 10; hNote = `ფასი ${Math.round(history.spanDays)} დღეა არ შეცვლილა`; }
    else if (aboveMin <= 0.01) { hPts = 20; hNote = `ისტორიულ მინიმუმზეა (${Math.round(history.spanDays)} დღე)`; }
    else if (cur < history.avg) { hPts = 12; hNote = `საშუალოზე დაბალია, მინიმუმზე +${Math.round(aboveMin * 100)}%`; }
    else if (aboveMin > 0.1) { hPts = 2; hNote = `ადრე ${Math.round(aboveMin * 100)}%-ით იაფი იყო`; }
    else { hPts = 7; hNote = `მინიმუმზე +${Math.round(aboveMin * 100)}%`; }
  }
  factors.push(factor("history", "ფასი ისტორიასთან შედარებით", 20, hPts, hNote, !!histOk));

  // 3. Shipping overhead in the landed cost
  if (landed && landed.total) {
    const overhead = landed.total / landed.goodsGel - 1;
    const pts = overhead <= 0.15 ? 15 : overhead <= 0.3 ? 10 : overhead <= 0.5 ? 5 : 0;
    factors.push(factor("landed", "მიწოდების ხარჯის წილი", 15, pts, `ჩამოტანა ფასს +${Math.round(overhead * 100)}%-ს ამატებს (შეფასება)`));
    factors.push(factor("customs", "საბაჟო რისკი", 10, landed.customs && landed.customs.taxable ? 3 : 10,
      landed.customs && landed.customs.taxable ? `განბაჟდება: ${landed.customs.reasons.join(", ")}` : "300 ₾-მდე — საბაჟო გადასახადი არ არის (შეფასება)"));
  } else {
    factors.push(factor("landed", "მიწოდების ხარჯის წილი", 15, 0, "კურსი მიუწვდომელია", false));
    factors.push(factor("customs", "საბაჟო რისკი", 10, 0, "კურსი მიუწვდომელია", false));
  }

  // 4. Data accuracy: how well identified is this product?
  const acc = (hasOrig ? 3 : 0) + (p.brand ? 2 : 0) + (p.sku ? 3 : 0) + (p.image_url ? 2 : 0);
  factors.push(factor("accuracy", "მონაცემების სიზუსტე", 10, acc,
    [p.sku ? "SKU ✓" : "SKU ✗", p.brand ? "ბრენდი ✓" : "ბრენდი ✗", hasOrig ? "ძველი ფასი ✓" : "ძველი ფასი ✗", p.image_url ? "ფოტო ✓" : "ფოტო ✗"].join(" · ")));

  // 5. Freshness of the last sighting
  const hrs = offer.last_seen_at ? (now - new Date(offer.last_seen_at)) / 36e5 : Infinity;
  factors.push(factor("freshness", "განახლების დრო", 10, hrs <= 24 ? 10 : hrs <= 72 ? 6 : hrs <= 168 ? 3 : 0,
    Number.isFinite(hrs) ? `ბოლოს ნანახია ${Math.round(hrs)} სთ-ის წინ` : "უცნობია"));

  // 6. Factors we have no data for yet — shown, never invented
  factors.push(factor("store", "მაღაზიის სანდოობა", 10, 0, "რეიტინგის წყარო ჯერ არ გვაქვს", false));
  factors.push(factor("delivery", "მიწოდების დრო", 5, 0, "მონაცემი ჯერ არ გვაქვს", false));
  factors.push(factor("returns", "დაბრუნების სირთულე", 5, 0, "მონაცემი ჯერ არ გვაქვს", false));

  // Penalty: the engine flags "discounts" where the price was recently much lower
  const penalty = Number(offer.score_breakdown && offer.score_breakdown.penalty) || 0;
  const suspicious = penalty < 0;

  const totalWeight = factors.reduce((s, f) => s + f.max, 0);
  const availWeight = factors.filter(f => f.available).reduce((s, f) => s + f.max, 0);
  const earned = factors.filter(f => f.available).reduce((s, f) => s + f.points, 0);
  const coverage = availWeight / totalWeight;
  let score = availWeight ? Math.round((earned / availWeight) * 100) : null;
  if (score !== null && suspicious) score = Math.max(0, score - 25);
  const enough = coverage >= MIN_COVERAGE;

  return { score: enough ? score : null, coverage, factors, suspicious, discount: disc, hasOriginal: hasOrig, historyAvailable: !!histOk };
}

/**
 * BUY_NOW | WAIT | SKIP | INSUFFICIENT, with human-readable reasons.
 */
export function recommend(scoreResult, history) {
  const r = scoreResult;
  const reasons = [];
  if (!r || r.score === null) return { action: "INSUFFICIENT", reasons: ["შეფასებისთვის მონაცემები არასაკმარისია"] };
  if (r.suspicious) return { action: "SKIP", reasons: ["ფასდაკლება საეჭვოა: ფასი ცოტა ხნის წინ მნიშვნელოვნად დაბალი იყო"] };
  if (!r.hasOriginal && !r.historyAvailable) return { action: "INSUFFICIENT", reasons: ["არც ძველი ფასი და არც საკმარისი ისტორია არ გვაქვს"] };

  const atLow = history && history.min > 0 && history.current / history.min - 1 <= 0.03;
  const wasLower = history && history.min > 0 && history.current / history.min - 1 > 0.1;

  if (r.score >= 70 && r.discount >= 15 && (!r.historyAvailable || atLow)) {
    reasons.push(`ქულა ${r.score}/100`, `ფასდაკლება −${Math.round(r.discount)}%`);
    if (r.historyAvailable && history.flat) reasons.push(`დაკვირვების ${Math.round(history.spanDays)} დღეში ფასი არ შეცვლილა — ფასდაკლება მაღაზიის ძველ ფასს ეყრდნობა`);
    else if (r.historyAvailable) reasons.push("ფასი ისტორიულ მინიმუმთანაა");
    else reasons.push("ისტორია მოკლეა — გადაამოწმე ყიდვამდე");
    return { action: "BUY_NOW", reasons };
  }
  if (r.score < 40) {
    reasons.push(`დაბალი ქულა ${r.score}/100`);
    if (!r.hasOriginal) reasons.push("ფასდაკლება არ ფიქსირდება");
    return { action: "SKIP", reasons };
  }
  if (wasLower) reasons.push("ადრე ფასი უფრო დაბალი იყო — შეიძლება ისევ დაიკლოს");
  if (r.discount < 15) reasons.push(r.hasOriginal ? `ფასდაკლება მხოლოდ −${Math.round(r.discount)}%` : "ფასდაკლება არ ფიქსირდება");
  if (!reasons.length) reasons.push(`ქულა ${r.score}/100 — კარგი, მაგრამ არა გამორჩეული`);
  return { action: "WAIT", reasons };
}

export const ACTION_LABEL = { BUY_NOW: "იყიდე ახლა", WAIT: "მოიცადე", SKIP: "გამოტოვე", INSUFFICIENT: "მონაცემები არასაკმარისია" };
export const ACTION_HINT = { BUY_NOW: "კარგი შესყიდვის შესაძლებლობა", WAIT: "სჯობს დაელოდო უკეთეს ფასს ან ინფორმაციას", SKIP: "შეთავაზება არ არის ხელსაყრელი", INSUFFICIENT: "შეფასებისთვის მონაცემები არასაკმარისია" };
export const STATUS_LABEL = { ACTIVE: "აქტიური", EXPIRED: "ვადაგასული", UNVERIFIED: "გადასამოწმებელი", OUT_OF_STOCK: "არ არის მარაგში" };
export const STATUS_HINT = { ACTIVE: "მოქმედებს — ახლახან შემოწმდა", EXPIRED: "ვადაგასულია", UNVERIFIED: "გადასამოწმებელია — დიდი ხანია არ შეგვიმოწმებია", OUT_OF_STOCK: "მარაგში არ არის" };
