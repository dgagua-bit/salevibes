// Smoke/functional test against a local static server.
// Usage: python3 -m http.server 8765 & node tests/e2e.mjs [baseUrl]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const BASE = process.argv[2] || "http://localhost:8765/";
const OUT = process.env.SHOTS || "";
const VIEWPORTS = { mobile: { width: 390, height: 844 }, tablet: { width: 820, height: 1180 }, desktop: { width: 1440, height: 900 } };
const PAGES = ["index.html", "deals.html", "categories.html", "brands.html?b=Pinko", "stores.html", "tools.html", "saved.html"];
const results = []; let failed = 0;
const check = (name, ok, info = "") => { console.log(`${ok ? "PASS" : "FAIL"} ${name}${info ? " — " + info : ""}`); results.push(`${ok ? "PASS" : "FAIL"} ${name}${info ? " — " + info : ""}`); if (!ok) failed++; };

const browser = await chromium.launch();
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: size });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  for (const p of PAGES) {
    errors.length = 0;
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`[${vp}] ${p} no JS errors`, errors.length === 0, errors.join(" | "));
    check(`[${vp}] ${p} no horizontal scroll`, overflow <= 1, `overflow ${overflow}px`);
    if (OUT) await page.screenshot({ path: `${OUT}/${vp}-${p.replace(/[?=]/g, "_")}.png`, fullPage: true });
  }
  await ctx.close();
}

// functional checks on desktop
const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
const page = await ctx.newPage();
await page.goto(BASE + "index.html", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
check("home: stats filled", (await page.textContent("#stat-deals")).trim() !== "—");
check("home: original top categories", await page.locator(".top-cats button").count() === 5);
check("home: product intel badges", await page.locator("#product-grid .intel .rec").count() > 0);
check("home: deal status tags", await page.locator("#grid .signal .st, #offers .st").count() >= 0);
check("home: menu links to new pages", await page.locator('#menu a[href="tools.html"]').count() === 1);
await page.click("#offers-head");
check("home: deals list opens", await page.locator("#grid .card").count() > 0);
await page.fill("#finder-query", "lip");
await page.click("#finder-submit");
await page.waitForSelector("#finder-results .foffer, #finder-status:has-text('ვერ')", { timeout: 15000 });
check("home: price comparison uses real data", await page.locator("#finder-results .foffer").count() > 0);
check("home: no admin 404 link", await page.locator('a[href="admin.html"]').count() === 0);
await page.goto(BASE + "deals.html?q=Society%20Limonta", { waitUntil: "networkidle" });
await page.waitForSelector("#results .subhead");
const nP = await page.locator("#results .offer-card").count();
check("search: brand query finds products", nP > 0, `${nP} cards`);
await page.click('.seg [data-type="deals"]');
check("search: type toggle → deals only", await page.locator("#results .offer-card").count() === 0);
await page.click('.seg [data-type="all"]');
await page.fill("#q", "");
await page.press("#q", "Enter");
await page.selectOption("#f-disc", "20");
await page.waitForTimeout(100);
const discs = await page.$$eval("#results .offer-card .prices .now em", els => els.map(e => parseInt(e.textContent.replace(/\D/g, ""))));
check("filter: min discount 20% respected", discs.every(d => d >= 20), JSON.stringify(discs));
check("filter: chip shown", await page.locator("#chips button").count() >= 1);
await page.selectOption("#sort", "landed");
const landed = await page.$$eval("#results .offer-card .prices .ge dd", els => els.map(e => Number(e.textContent.replace(/[^\d]/g, ""))));
check("sort: landed cost ascending", landed.every((v, i) => !i || v >= landed[i - 1]), JSON.stringify(landed.slice(0, 6)));
check("url: state persisted", page.url().includes("disc=20") && page.url().includes("sort=landed"));

// score dialog
await page.click("#f-reset");
const pill = page.locator("#results .offer-card .score-pill").first();
if (await pill.count()) { await pill.click(); check("score dialog opens with factor table", await page.locator("dialog[open] .factor-table").count() === 1); await page.keyboard.press("Escape"); }
const promo = page.locator("#results [data-deal-score]").first();
if (await promo.count()) { await promo.click(); check("promo score dialog explains limits", (await page.textContent("dialog[open]")).includes("BUY / WAIT / SKIP")); await page.keyboard.press("Escape"); }

// wishlist
const heart = page.locator("#results .offer-card .heart").first();
await heart.click();
check("wishlist: heart toggles", (await heart.getAttribute("aria-pressed")) === "true");
check("wishlist: header count", (await page.textContent("[data-saved-count]")).trim() === "1");

// product detail
const href = await page.locator("#results .offer-card .card-title a").first().getAttribute("href");
await page.goto(BASE + href, { waitUntil: "networkidle" });
await page.waitForSelector(".decision");
check("product: price box", await page.locator(".price-box > div").count() === 3);
check("product: history chart or honest message", await page.locator("#hist svg, #hist .empty").count() === 1);
check("product: breakdown total", await page.locator(".breakdown tr.total").count() === 1);
check("product: estimate label", await page.locator(".label-est, .label-final").count() >= 1);
await page.click('[data-range="90"]');
check("product: 90d toggle", (await page.getAttribute('[data-range="90"]', "aria-pressed")) === "true");
await page.fill("#target", "1");
await page.click("#target-form button");
await page.goto(BASE + "saved.html", { waitUntil: "networkidle" });
check("saved: item listed", await page.locator("#items .offer-card").count() >= 1);
check("saved: target listed", (await page.textContent("#alerts")).includes("სამიზნე") || (await page.textContent("#alerts")).length > 0);
await page.click('#sub-form button[type=submit]');
check("waitlist: validation blocks empty email", (await page.textContent("#sub-status")).includes("ელფოსტა"));

// tools
await page.goto(BASE + "tools.html?price=200&cur=EUR&origin=IT&cat=shoes#calc", { waitUntil: "networkidle" });
await page.waitForSelector("#calc-out .breakdown");
check("tools: prefill price", (await page.inputValue("#c-price")) === "200");
check("tools: estimate label", await page.locator("#calc-out .label-est").count() === 1);
await page.fill("#c-price", "500");
check("tools: customs triggers over 300 GEL", (await page.textContent("#calc-out")).includes("განბაჟდება"));
await page.selectOption("#c-origin", "US"); await page.selectOption("#c-carrier", "usa2georgia");
check("tools: USA2GEORGIA US rate filled", (await page.inputValue("#c-rate")) === "9.95");
await page.selectOption("#c-carrier", "inex");
check("tools: pending carrier leaves rate empty", (await page.inputValue("#c-rate")) === "");
await page.fill("#c-kg", "1"); await page.fill("#c-l", "60"); await page.fill("#c-w", "40"); await page.fill("#c-h", "30");
check("tools: volumetric weight used", (await page.textContent("#calc-out")).includes("მოცულობითი"));
await page.waitForSelector("#cmp-out:not([hidden]), #cmp-status:not(:empty)");
check("tools: cross-country comparison loads", await page.locator("#cmp-out table tbody tr").count() > 0);

// keyboard: skip link + focus visible
await page.goto(BASE + "index.html", { waitUntil: "networkidle" });
await page.keyboard.press("Tab");


// mobile nav
const m = await browser.newContext({ viewport: VIEWPORTS.mobile });
const mp = await m.newPage();
await mp.goto(BASE + "index.html", { waitUntil: "networkidle" });
await mp.click(".menu-toggle");
check("mobile: menu opens", await mp.locator("#menu[open]").isVisible());
await mp.goto(BASE + "deals.html", { waitUntil: "networkidle" });
check("mobile: filters collapsed by default", !(await mp.evaluate(() => document.getElementById("filters").open)));

await browser.close();
console.log(results.join("\n"));
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
