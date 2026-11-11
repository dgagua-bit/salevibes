/** Glue: turns a raw offer row into everything a card or detail page shows. Pure. */
import { estimateForOffer } from "./pricing.js";
import { computeDealScore, historyStats, recommend, offerStatus } from "./score.js";

export function enrichOffer(o, fx, { points = null, landed = null, now = Date.now() } = {}) {
  const l = landed || estimateForOffer(o, fx);
  const history = historyStats(o, points, now);
  const scored = computeDealScore(o, { history, landed: l.total ? l : null, now });
  return { offer: o, product: o.products || {}, store: o.products?.stores || {}, status: offerStatus(o, now), landed: l, history, scored, rec: recommend(scored, history) };
}
