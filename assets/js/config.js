/**
 * SaleVibes — static configuration.
 *
 * SUPABASE_KEY is a *publishable* key: it is meant to be public and only grants
 * what Row Level Security allows the `anon` role (read active deals/offers,
 * stores, fx, price history; insert into radar_subscribers). Never put a
 * service-role / secret key in this file.
 */
export const SUPABASE_URL = "https://fyfanpmszhopxjaerubd.supabase.co";
export const SUPABASE_KEY = "sb_publishable_cRKWVslW5OztfzeT-iH_Lg_DVWeK5au";

/**
 * Optional external multi-country price search (the old "/api/price-search").
 * It never existed on GitHub Pages, so the finder is hidden unless this points
 * to a deployed endpoint (e.g. a Supabase Edge Function or Vercel function).
 */
export const PRICE_SEARCH_API = null;

/** Set to true once a mail provider (RESEND_API_KEY) is configured for the `cabinet` Edge Function. */
export const EMAIL_ALERTS_LIVE = false;

/** How old a check may be before we stop calling an item ACTIVE. */
export const FRESHNESS = {
  dealVerifiedDays: 7,   // curated store promotions are re-checked by hand
  offerVerifiedHours: 48 // crawler runs every 30 min; 48h without a sighting = unverified
};

export const COUNTRIES = {
  DE: "გერმანია", IT: "იტალია", GR: "საბერძნეთი", ES: "ესპანეთი", FR: "საფრანგეთი",
  PL: "პოლონეთი", UK: "დიდი ბრიტანეთი", GB: "დიდი ბრიტანეთი", US: "აშშ", CA: "კანადა",
  NL: "ნიდერლანდები", EU: "ევროპა", GLOBAL: "საერთაშორისო"
};
export const FLAGS = { DE: "🇩🇪", IT: "🇮🇹", GR: "🇬🇷", ES: "🇪🇸", FR: "🇫🇷", PL: "🇵🇱", UK: "🇬🇧", GB: "🇬🇧", US: "🇺🇸", CA: "🇨🇦", NL: "🇳🇱", EU: "🇪🇺" };

export const CATEGORIES = {
  luxury: "ლუქსი", fashion: "ტანსაცმელი", shoes: "ფეხსაცმელი", watches: "საათები",
  beauty: "სილამაზე", home: "სახლი", accessories: "აქსესუარები",
  marketplace: "მარკეტფლეისი", aggregator: "აგრეგატორი", kids: "ბავშვები"
};

/** The five browsing "worlds" (stores.worlds[] uses these keys). */
export const WORLDS = [
  { key: "fashion", title: "ტანსაცმელი", sub: "დიზაინერული და ყოველდღიური მოდა" },
  { key: "shoes", title: "ფეხსაცმელი", sub: "სნიკერები, ჩექმები, კლასიკა" },
  { key: "beauty", title: "სილამაზე", sub: "სუნამოები და კოსმეტიკა" },
  { key: "accessories", title: "აქსესუარები", sub: "ჩანთები, საათები, სამკაულები" },
  { key: "home", title: "სახლი", sub: "ავეჯი, დეკორი, ტექსტილი" }
];
export const AUDIENCE_WORLDS = new Set(["fashion", "shoes", "accessories"]);
export const FEATURED_BRANDS = ["Gucci", "Prada", "Armani", "Pinko", "Liu Jo", "Nike", "Adidas"];

export const CURRENCY_SYMBOL = { EUR: "€", USD: "$", GBP: "£", GEL: "₾" };

/**
 * Georgian customs rules for personal parcels.
 * status: VERIFIED  = checked against the official source on `checkedOn`
 *         UNVERIFIED = carried over from the previous site text; must be confirmed on rs.ge
 */
export const CUSTOMS = {
  status: "UNVERIFIED",
  source: "https://www.rs.ge/",
  checkedOn: null,
  dutyFreeLimitGel: 300,
  dutyFreeLimitKg: 30,
  vatRate: 0.18,              // applied to goods + shipping when the parcel is taxable
  sameItemsLimit: 3,          // 3+ identical items => treated as commercial
  fees: [                     // customs processing fee by declared value (GEL)
    { upTo: 3000, fee: 20 },
    { upTo: 10000, fee: 100 },
    { upTo: Infinity, fee: 300 }
  ]
};

/**
 * Parcel forwarders. Rates are only filled in when we have a dated source.
 * status per rate: VERIFIED (official tariff page, dated) | REPORTED (secondary
 * source, dated) | PENDING (no data — user must enter the rate).
 */
export const CARRIERS = [
  {
    id: "usa2georgia", name: "USA2GEORGIA",
    rates: {
      US: {
        usdPerKg: 9.95, method: "საჰაერო", effective: "2026-03-20", status: "REPORTED",
        source: "https://bm.ge/en/news/usa2georgia-to-increase-tariffs-on-packages-received-in-us-warehouse-starting-march-20",
        note: "აშშ-ის საწყობი; $9 → $9.95/კგ 2026-03-20-დან (BM.ge, კომპანიის ელფოსტაზე დაყრდნობით)"
      }
    }
  },
  { id: "inex", name: "Inex", rates: {} },
  { id: "camex", name: "Camex", rates: {} },
  { id: "maleo", name: "Maleo", rates: {} },
  { id: "barami", name: "Barami", rates: {} }
];

/**
 * Assumptions used ONLY for the "≈ estimated price in Georgia" on cards, where
 * the user hasn't entered anything. Every card that uses them says so.
 */
export const ESTIMATE_DEFAULTS = {
  usdPerKg: 9.95, // the only dated public tariff we have (USA2GEORGIA, US warehouse)
  weightKgByCategory: { home: 2, shoes: 1.5, fashion: 0.6, luxury: 0.8, accessories: 0.4, watches: 0.3, beauty: 0.4, kids: 0.5 },
  fallbackWeightKg: 1,
  volumetricDivisor: 6000 // cm³ / 6000 is the most common forwarder rule; varies by carrier
};

/** Black Friday banner is only shown inside this window (Asia/Tbilisi). */
export const SEASONAL = [
  { id: "black-friday", tag: "black-friday", title: "შავი პარასკევი", showFrom: "2026-11-01T00:00:00+04:00", start: "2026-11-27T00:00:00+04:00", end: "2026-12-01T00:00:00+04:00" }
];
