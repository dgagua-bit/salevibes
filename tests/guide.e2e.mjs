// Georgia Guide smoke test. Usage: python3 -m http.server 8765 & node tests/guide.e2e.mjs http://localhost:8765/guide/
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const BASE = process.argv[2] || "http://localhost:8765/guide/";
const OUT = process.env.SHOTS || "";
const VIEWPORTS = { mobile: { width: 390, height: 844 }, tablet: { width: 820, height: 1180 }, desktop: { width: 1440, height: 900 } };
const PAGES = ["index.html", "arrival.html", "routes.html", "route.html?id=kazbegi-2day", "places.html", "place.html?id=gergeti", "food.html", "plan.html", "qr.html"];
let failed = 0;
const check = (name, ok, info = "") => { console.log(`${ok ? "PASS" : "FAIL"} ${name}${info ? " — " + info : ""}`); if (!ok) failed++; };
const ignorable = m => /tile\.openstreetmap|fonts\.g|Failed to load resource|net::ERR|ServiceWorker|sw\.js/.test(m);

const browser = await chromium.launch();
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: size, serviceWorkers: "block" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !ignorable(m.text())) errors.push(m.text()); });
  for (const p of PAGES) {
    errors.length = 0;
    await page.goto(BASE + p, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const h1 = (await page.locator("h1").first().textContent().catch(() => "")) || "";
    check(`[${vp}] ${p} no JS errors`, errors.length === 0, errors.join(" | "));
    check(`[${vp}] ${p} no horizontal scroll`, overflow <= 1, `overflow ${overflow}px`);
    check(`[${vp}] ${p} has h1`, h1.trim().length > 0);
    if (OUT) await page.screenshot({ path: `${OUT}/${vp}-${p.replace(/[?=]/g, "_")}.png`, fullPage: true });
  }
  await ctx.close();
}

const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, serviceWorkers: "block" });
const page = await ctx.newPage();
// home
await page.goto(BASE + "index.html", { waitUntil: "load" });
check("home: 4 quick actions", await page.locator("#quick a").count() === 4);
check("home: 4 regions", await page.locator("#regions a").count() === 4);
check("home: featured routes", await page.locator("#featured .route-card").count() === 6);
check("home: map rendered with markers", await page.locator("#map .pin").count() > 40);
check("home: tab bar visible on mobile", await page.locator(".tabbar").isVisible());
// language switch
await page.click('[data-lang="ka"]'); await page.waitForLoadState("load");
check("lang: Georgian UI", /მთები|ღვინო/.test(await page.locator("h1").first().textContent()));
check("lang: html lang=ka", (await page.getAttribute("html", "lang")) === "ka");
await page.click('[data-lang="en"]'); await page.waitForLoadState("load");
// routes: filter + add to plan
await page.goto(BASE + "routes.html", { waitUntil: "load" });
const all = await page.locator("#list .route-card").count();
await page.click('#type-seg [data-type="mountain"]');
const mt = await page.locator("#list .route-card").count();
check("routes: type filter narrows", mt > 0 && mt < all, `${mt}/${all}`);
await page.click('#type-seg [data-type="all"]');
await page.check('[data-route-toggle="kazbegi-2day"]');
await page.check('[data-route-toggle="kakheti-2day"]');
check("routes: plan counter = 2", (await page.locator("[data-plan-count]").first().textContent()).trim() === "2");
// route detail
await page.goto(BASE + "route.html?id=kazbegi-2day", { waitUntil: "load" });
check("route: 2 days in itinerary", await page.locator(".day").count() === 2);
check("route: timeline stops link to places", await page.locator('.timeline a[href^="place.html"]').count() >= 6);
check("route: eat & rest stops listed", await page.locator("#stops .stop-card").count() >= 3);
check("route: checkbox reflects plan", await page.isChecked('#head [data-route-toggle]'));
check("route: google maps link has waypoints", /waypoints=/.test(await page.getAttribute("#gmaps", "href")));
// places: search + save
await page.goto(BASE + "places.html?type=sea", { waitUntil: "load" });
const sea = await page.locator("#list .place-card").count();
check("places: type from URL applied", sea > 0 && sea < 20, `${sea}`);
await page.click("#reset");
await page.fill("#q", "gergeti"); await page.waitForTimeout(150);
check("places: search finds Gergeti first", await page.locator("#list .place-card").count() >= 1 && await page.locator('#list .place-card [data-place-toggle="gergeti"]').count() === 1);
await page.click('#list [data-place-toggle="gergeti"]');
check("places: heart pressed", (await page.getAttribute('#list [data-place-toggle="gergeti"]', "aria-pressed")) === "true");
check("places: plan counter = 3", (await page.locator("[data-plan-count]").first().textContent()).trim() === "3");
// place detail
await page.goto(BASE + "place.html?id=gergeti", { waitUntil: "load" });
check("place: saved state shown", (await page.getAttribute("#head [data-place-toggle]", "aria-pressed")) === "true");
check("place: nearby stops", await page.locator("#nearby .stop-card").count() >= 1);
check("place: routes including it", await page.locator("#routes .route-card").count() >= 1);
check("place: unknown id falls back", await page.goto(BASE + "place.html?id=nope").then(() => page.url().includes("id=narikala")));
// plan
await page.goto(BASE + "plan.html", { waitUntil: "load" });
check("plan: 2 routes", await page.locator("#routes .route-card").count() === 2);
check("plan: 1 saved place", await page.locator("#places .place-card").count() === 1);
check("plan: combined stops", await page.locator("#stops .stop-card").count() >= 6);
check("plan: map has route lines", await page.locator("#map path.leaflet-interactive").count() >= 2);
await page.goto(BASE + "plan.html?r=batumi-3day&p=ushguli", { waitUntil: "load" });
check("plan: import from share URL", await page.locator("#routes .route-card").count() === 3 && await page.locator("#places .place-card").count() === 2);
page.once("dialog", d => d.accept());
await page.click("#clear"); await page.waitForTimeout(100);
check("plan: cleared → empty state", await page.locator("#empty").isVisible());
// arrival
await page.goto(BASE + "arrival.html", { waitUntil: "load" });
check("arrival: 3 airports", await page.locator("#airports button").count() === 3);
await page.click('[data-airport="KUT"]');
check("arrival: Kutaisi options", /Omnibus/.test(await page.locator("#options").textContent()));
await page.evaluate(() => { window.__opened = null; window.open = u => { window.__opened = String(u); return null; }; });
await page.fill("#hotel", "Stamba Hotel"); await page.click('#hotel-form [data-mode="transit"]');
const opened = await page.evaluate(() => window.__opened);
check("arrival: hotel form opens Google Maps directions", /google\.com\/maps\/dir/.test(opened) && /Kutaisi/.test(decodeURIComponent(opened)) && /travelmode=transit/.test(opened), opened);
check("arrival: emergency 112 tel link", await page.locator('#emergency a[href="tel:112"]').count() === 1);
// food
await page.goto(BASE + "food.html", { waitUntil: "load" });
const dishes = await page.locator("#dishes .dish").count();
await page.click('[data-veg="1"]');
check("food: vegetarian filter", await page.locator("#dishes .dish").count() < dishes);
check("food: phrases table", await page.locator("#phrases tr").count() >= 10);
check("food: where to eat", await page.locator("#where .stop-card").count() >= 10);
// qr
await page.goto(BASE + "qr.html", { waitUntil: "load" });
check("qr: svg rendered", await page.locator("#qr svg").count() === 1);
check("qr: points at index.html", (await page.textContent("#url")).endsWith("/guide/index.html"));
// manifest & sw reachable
for (const f of ["manifest.webmanifest", "sw.js", "assets/vendor/leaflet/leaflet.css"]) { const r = await page.request.get(BASE + f); check(`static: ${f} 200`, r.status() === 200); }
await ctx.close(); await browser.close();
console.log(`\n${failed ? failed + " FAILED" : "ALL PASSED"}`);
process.exit(failed ? 1 : 0);
