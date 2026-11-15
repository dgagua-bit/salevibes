// Data integrity for the Georgia Guide (guide/): references, coordinates, translations.
import test from "node:test";
import assert from "node:assert/strict";
import { PLACES, REGIONS } from "../guide/assets/js/data/places.js";
import { STOPS } from "../guide/assets/js/data/stops.js";
import { ROUTES } from "../guide/assets/js/data/routes.js";
import { DISHES, DRINKS, SUPRA, PHRASES, PRICES } from "../guide/assets/js/data/food.js";
import { AIRPORTS, SIM, MONEY, ESSENTIALS, EMERGENCY } from "../guide/assets/js/data/arrival.js";

const inGeorgia = (lat, lng) => lat > 41.0 && lat < 43.6 && lng > 40.0 && lng < 46.8;
const CATS = ["nature", "history", "religion", "museum", "viewpoint", "town", "architecture", "activity", "park"];
const TYPES = ["mountain", "sea", "city", "wine"];
const KINDS = ["restaurant", "cafe", "winery", "rest", "market", "bakery", "viewpoint", "guesthouse"];
const hasKaEn = o => o && typeof o.en === "string" && o.en.length > 0 && typeof o.ka === "string" && o.ka.length > 0;

test("places: unique ids, valid fields, inside Georgia, en+ka text", () => {
  const ids = new Set();
  for (const p of PLACES) {
    assert.ok(!ids.has(p.id), `duplicate place ${p.id}`); ids.add(p.id);
    assert.ok(REGIONS[p.region], `${p.id}: unknown region ${p.region}`);
    assert.ok(CATS.includes(p.cat), `${p.id}: unknown cat ${p.cat}`);
    assert.ok(p.type.length && p.type.every(x => TYPES.includes(x)), `${p.id}: bad type`);
    assert.ok(inGeorgia(p.lat, p.lng), `${p.id}: coordinates outside Georgia`);
    for (const f of ["name", "desc", "tips", "getThere"]) assert.ok(hasKaEn(p[f]), `${p.id}: ${f} needs en+ka`);
    assert.ok(typeof p.visit === "number" && p.visit > 0, `${p.id}: visit`);
    assert.ok(typeof p.fee === "string" && p.hours, `${p.id}: fee/hours`);
  }
  assert.ok(PLACES.length >= 50);
});

test("stops: valid kinds, prices, coordinates, references", () => {
  const ids = new Set(), placeIds = new Set(PLACES.map(p => p.id));
  for (const s of STOPS) {
    assert.ok(!ids.has(s.id), `duplicate stop ${s.id}`); ids.add(s.id);
    assert.ok(KINDS.includes(s.kind), `${s.id}: kind`);
    assert.ok([1, 2, 3].includes(s.price), `${s.id}: price`);
    assert.ok(inGeorgia(s.lat, s.lng), `${s.id}: coordinates`);
    assert.ok(hasKaEn(s.name) && hasKaEn(s.desc) && hasKaEn(s.area), `${s.id}: text`);
    if (s.near) assert.ok(placeIds.has(s.near), `${s.id}: near → unknown place ${s.near}`);
  }
});

test("routes: every stop references a known place/stop; days and types consistent", () => {
  const placeIds = new Set(PLACES.map(p => p.id)), stopIds = new Set(STOPS.map(s => s.id)), ids = new Set();
  for (const r of ROUTES) {
    assert.ok(!ids.has(r.id), `duplicate route ${r.id}`); ids.add(r.id);
    assert.ok(r.type.every(x => TYPES.includes(x)), `${r.id}: type`);
    assert.ok(["easy", "moderate", "hard"].includes(r.difficulty), `${r.id}: difficulty`);
    assert.ok(/^#[0-9a-f]{6}$/i.test(r.color), `${r.id}: color`);
    assert.ok(hasKaEn(r.name) && hasKaEn(r.summary) && hasKaEn(r.season), `${r.id}: text`);
    assert.equal(r.itinerary.length, Math.max(1, Math.ceil(r.days)), `${r.id}: itinerary days vs days`);
    for (const h of r.highlights) assert.ok(placeIds.has(h), `${r.id}: highlight ${h}`);
    for (const d of r.itinerary) {
      assert.ok(hasKaEn(d.title), `${r.id}: day title`);
      assert.ok(d.stops.length, `${r.id}: empty day`);
      for (const s of d.stops) { assert.ok(placeIds.has(s.place), `${r.id}: unknown place ${s.place}`); if (s.note) assert.ok(hasKaEn(s.note)); }
      for (const e of [...(d.eat || []), ...(d.rest || [])]) assert.ok(stopIds.has(e), `${r.id}: unknown stop ${e}`);
    }
    for (const p of r.practical || []) assert.ok(hasKaEn(p), `${r.id}: practical`);
  }
  // every place is reachable from at least one route or is a saved-only extra; most should be on a route
  const onRoute = new Set(ROUTES.flatMap(r => r.itinerary.flatMap(d => d.stops.map(s => s.place))));
  const orphans = PLACES.filter(p => !onRoute.has(p.id)).map(p => p.id);
  assert.ok(orphans.length <= 12, `too many places not on any route: ${orphans.join(", ")}`);
});

test("food: dishes, drinks, supra, phrases, prices complete in en/ka/ru", () => {
  for (const d of DISHES) { assert.ok(hasKaEn(d.name) && hasKaEn(d.desc) && hasKaEn(d.how) && hasKaEn(d.region), d.id); assert.ok(d.name.ru && d.desc.ru && d.how.ru, `${d.id}: ru`); assert.ok(typeof d.veg === "boolean"); }
  for (const d of DRINKS) assert.ok(hasKaEn(d.name) && hasKaEn(d.desc) && d.desc.ru, d.id);
  for (const l of ["en", "ka", "ru"]) assert.ok(SUPRA[l].length >= 4, `supra ${l}`);
  for (const p of PHRASES) assert.ok(p.en && p.ka && p.tr && p.ru);
  for (const p of PRICES) assert.ok(hasKaEn(p.item) && p.gel);
});

test("arrival: airports with options, en/ka/ru blocks, emergency numbers are real digits", () => {
  for (const a of AIRPORTS) {
    assert.ok(inGeorgia(a.lat, a.lng), a.id);
    assert.ok(a.options.length >= 2 && a.mapsName, a.id);
    for (const o of a.options) { assert.ok(["bus", "taxi", "shuttle", "train", "car"].includes(o.mode)); assert.ok(hasKaEn(o.title) && hasKaEn(o.tip) && o.cost, `${a.id}:${o.mode}`); }
    assert.ok(hasKaEn(a.intercity));
  }
  for (const l of ["en", "ka", "ru"]) { assert.ok(SIM[l].length && MONEY[l].length && ESSENTIALS[l].length >= 6, l); }
  for (const e of EMERGENCY) assert.match(e.number.replace(/\s/g, ""), /^[+\d]{3,15}$/, `emergency number looks like a placeholder: ${e.number}`);
});
