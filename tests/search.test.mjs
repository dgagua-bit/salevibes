// Search engine rules, checked offline on fixed examples (taken from real searches that went wrong).
// Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { queryTerms, relevance, productKey, secondary, cleanBrand, brandFocus, brandCore, rankResults, sortItems, pickBest, displayTitle, modelsOf, brandOf } from "../assets/js/search-engine.js";

const FX = { EUR: 3, USD: 2.7, GBP: 3.6 };
let n = 0;
const item = (title, brand = null, price = 100, extra = {}) => ({ title, brand, price, currency: "USD", url: `https://shop.example/p/${++n}`, store: extra.store || "Shop", country: "US", in_stock: true, ...extra });
const best = (all, q) => { const terms = queryTerms(q); const r = rankResults(all, q, terms, FX); return { ...r, best: pickBest(sortItems(r.items)) }; };

test("filler words in the query are ignored: 'aventus by creed' = 'aventus creed'", () => {
  assert.deepEqual(queryTerms("Aventus by Creed"), ["aventus", "creed"]);
  assert.deepEqual(queryTerms("the"), ["the"]); // a query of only filler words is kept
});

test("Georgian brand names and words are understood", () => {
  assert.deepEqual(queryTerms("ნაიკი Air Max 90"), ["nike", "air", "max", "90"]);
  assert.deepEqual(queryTerms("სუნამო"), ["parfum"]);
});

test("numbers match whole model numbers only", () => {
  assert.equal(relevance(["90"], "Nike Air Max 90 Sneaker"), 1);
  assert.equal(relevance(["90"], "New Balance 9060"), 0, "90 is not 9060");
  assert.equal(relevance(["6"], "New Balance 1906R"), 0, "6 is not 1906");
  assert.equal(relevance(["9060"], "New Balance U9060BLK"), 1, "letters around the number are fine");
  assert.equal(relevance(["1080"], "New Balance 1080v15"), 1);
});

test("1–2 letter words must be whole words", () => {
  assert.equal(relevance(["on", "cloud"], "ON Cloud 6 Sneaker"), 1);
  assert.equal(relevance(["on"], "Body lotion"), 0, "'on' inside 'lotion' is not a match");
});

test("typos are forgiven only in longer words", () => {
  assert.equal(relevance(["sambaa"], "adidas Samba OG"), 1);
  assert.equal(relevance(["lloyd"], "Floyd Sofa"), 0, "lloyd is not floyd");
  assert.equal(relevance(["zara"], "Yara Perfume"), 0);
});

test("the same product gets the same key across stores", () => {
  assert.equal(productKey("Dior Sauvage Eau de Parfum Spray 100ml"), productKey("Sauvage by Christian Dior, 3.4 oz EDP Spray for Men"));
  assert.equal(productKey("New Balance 1080 V15 Breathe"), productKey("New Balance 1080v15 Breathe"));
  assert.notEqual(productKey("Dior Sauvage EDT 100ml"), productKey("Dior Sauvage EDT 200ml"), "sizes differ");
  assert.notEqual(productKey("Dior Sauvage Elixir 100ml"), productKey("Dior Sauvage Parfum 100ml"));
});

test("kids', side products, samples and bundles are not the main result", () => {
  assert.equal(secondary("Adidas Kids Originals Samba", "adidas samba"), true);
  assert.equal(secondary("Adidas Kids Originals Samba", "adidas samba kids"), false, "unless asked for");
  assert.equal(secondary("Dior Sauvage Deodorant Stick 75g", "dior sauvage"), true);
  assert.equal(secondary("Creed Queen Of Silk by Creed Vial", "creed"), true);
  assert.equal(secondary("2PCS Combo Dumont Borouj", "aventus"), true);
});

test("vendor codes and filler are not brands", () => {
  for (const b of ["2718", "R2808", "6457", "Bundle & Save", "", null]) assert.equal(cleanBrand(b), null, String(b));
  for (const b of ["Creed", "NEW BALANCE", "On", "A.P.C.", "3.1 Phillip Lim", "C.P. Company"]) assert.equal(cleanBrand(b), b);
});

test("'creed': Creed perfumes first, not a Funko figure or a sweater that mention the word", () => {
  const all = [
    item("Funko Pop Pet Sematary Gage Creed 4 Inch Vinyl Figure", null, 25),
    item("RtA Creed Wool & Cashmere-Blend Crewneck Sweater", null, 95),
    item("Women's Zx/2 Classic Sandals In Creed Golden", null, 95),
    item("Aventus Cologne", "Creed", 260),
    item("Creed Aventus Eau de Parfum Spray 50ml", "Creed", 230, { currency: "GBP" })
  ];
  const r = best(all, "creed");
  assert.equal(r.best.brand, "Creed");
  assert.ok(r.items.every(x => x.brand === "Creed"));
  assert.ok(r.similar.some(x => /Funko/.test(x.title)), "other things stay visible under 'similar'");
});

test("'aventus': a knock-off that names Creed in brackets is not Creed", () => {
  const all = [
    item("Dumont Borouj Spiritus Eau De Parfum (Creed Aventus Twist)", null, 80),
    item("Yacht Man Aventus by Myrurgia for Men - 3.4 oz EDT Spray", null, 15),
    item("Aventus Cologne", "Creed", 260),
    item("Creed Aventus Eau de Parfum Spray 100ml", "Creed", 330, { currency: "GBP" }),
    item("Aventus by Creed and Uomo Born in Roma by Valentino", null, 550, { side: true })
  ];
  const r = best(all, "aventus");
  assert.equal(r.best.title, "Aventus Cologne");
  assert.ok(!r.items.some(x => /Dumont|Myrurgia|Valentino/.test(x.title)));
});

test("a brandless title that credits the brand counts ('Sauvage by Christian Dior')", () => {
  const all = [item("Sauvage by Christian Dior, 2 oz EDT Spray", null, 70), item("Dior Sauvage Eau de Toilette 100ml", "Dior", 110), item("Christian Dior Sauvage Cologne", "Christian Dior", 105)];
  const r = best(all, "dior sauvage");
  assert.equal(r.items.length, 3);
});

test("'lloyd' prefers the brand that is exactly LLOYD over Milton-Lloyd", () => {
  const all = [item("Lloyd Daniel Oxford Shoe", "LLOYD", 120), item("Perfumers Choice Sofia Perfume", "Milton-Lloyd", 12), item("Colour Me Black by Milton Lloyd for Men", null, 20)];
  const r = best(all, "lloyd");
  assert.equal(r.best.brand, "LLOYD");
  assert.equal(r.items.length, 1);
});

test("brand variants of the same brand all count ('New Balance Running', 'NEW BALANCE', titles starting with the brand)", () => {
  const all = [item("New Balance 9060 Sneaker", "New Balance Running", 150), item("Sneakers 9060 Shipyard/Linen", "NEW BALANCE", 140), item("New Balance 9060 Black/Castlerock U9060BLK Men's", null, 120), item("Women's Leggings 9060", "Lululemon", 60)];
  const r = best(all, "new balance 9060");
  assert.equal(r.items.length, 3);
  assert.equal(r.best.title, "New Balance 9060 Black/Castlerock U9060BLK Men's");
});

test("a misspelt store title still matches a longer word ('Wildhouse' ≈ 'wildhorse')", () => {
  assert.equal(relevance(["wildhorse"], "Women's Reactx Wildhouse 10"), 1);
});

test("nothing exact → the nearest matches are offered, not an empty page", () => {
  // as in the real data: the store gives no brand, so "nike" is missing and only 3 of 4 words match
  const all = [item("Women's Reactx Wildhouse 10 Running Shoe", null, 90), item("Wildhorse 10 Trail", null, 80), item("Pegasus 41", "Nike", 100)];
  const r = best(all, "nike reactx wildhorse 10");
  assert.equal(r.items.length, 0);
  assert.equal(r.close[0].title, "Women's Reactx Wildhouse 10 Running Shoe");
});

test("brand-only query: brand detected, models offered, brand shown in titles", () => {
  const all = [item("Sneakers T500 Drift Red", "NEW BALANCE"), item("New Balance 9060 Black", "New Balance"), item("New Balance Womens 9060", "New Balance"), item("Sneakers 1906R Navy", "NEW BALANCE"), item("New Balance 1906R Sneaker", "New Balance")];
  const terms = queryTerms("new balance");
  assert.ok(brandOf(all, terms));
  assert.deepEqual(modelsOf(all, "New Balance").map(m => m.model).sort(), ["1906r", "9060"]);
  assert.equal(displayTitle(all[0]), "New Balance Sneakers T500 Drift Red");
  assert.equal(displayTitle(all[1]), "New Balance 9060 Black");
  assert.equal(brandCore("New Balance Running"), brandCore("NEW BALANCE"));
});

test("brandFocus: no brand named and no brand dominating → no preference", () => {
  const all = [item("Sneaker A", "Nike"), item("Sneaker B", "Adidas"), item("Sneaker C", "Puma")];
  assert.equal(brandFocus(all, ["sneaker"]), null);
});
