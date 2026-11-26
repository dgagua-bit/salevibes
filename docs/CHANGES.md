# ცვლილებების ჟურნალი — 2026-11-11

## აუდიტი (საწყისი მდგომარეობა)

ერთი `index.html` (106 KB, CSS + JS ერთ ფაილში, მრავალჯერ გადაფარული სტილები).

| ფუნქცია | მდგომარეობა |
|---|---|
| აქციები Supabase-იდან (`deals`) | მუშაობდა |
| პროდუქტები ფასით (`offers`) | მუშაობდა, მაგრამ მხოლოდ 12 ჩანდა |
| ფასის ისტორია | **არ მუშაობდა**: `price_history` RLS-ით დაბლოკილი იყო; ნაჩვენები იყო მხოლოდ engine-ის სიგნალი |
| კალკულატორი | მუშაობდა, ერთი ტარიფით ($9.95 ყველა ქვეყნიდან), დაშვებები არ ჩანდა |
| „ფასების შედარება“ (`/api/price-search`) | **დემო**: GitHub Pages-ზე `/api` არ არსებობს, ყოველთვის შეცდომა |
| გამოწერის ფორმა | ინახავდა ელფოსტას, გაგზავნის სისტემა არ არსებობს; თანხმობა არ იყო |
| `admin.html` ბმული | **404** — ფაილი რეპოზიტორიაში არ არის |
| Hero სლაიდერი, ზედა marquee, კატეგორიის overlay | დეკორატიული; Unsplash-ის ფოტოები ბარათებზე „საილუსტრაციო“ |
| ნავიგაცია | 10 პუნქტი მენიუში + 5 კატეგორია + 4 ცალკე საძიებო ველი |
| შავი პარასკევი | countdown ყოველთვის ჩანდა 1 დეკემბრამდე |
| KIKO IT/GB შედარება (`compare_*`, 544 პროდუქტი) | ბაზაში იყო, **საიტზე არ ჩანდა** |
| ტექსტის ზომა | 8–11px ბევრგან; კონტრასტი ზოგან < 4.5:1 |

## რა გაკეთდა

### Phase 1
- მთავარი გვერდი: Hero + ერთი ძიება → დღის საუკეთესო (პროდუქტები) → კატეგორიები → აქციები → ბრენდები → მაღაზიები → „რატომ SaleVibes“ → footer.
- ნავიგაცია: 5 მიმართულება (აქციები, კატეგორიები, ბრენდები, მაღაზიები, ინსტრუმენტები) + რჩეულები; მობილურზე მენიუ ძიებით.
- ახალი ნათელი დიზაინ-სისტემა (`#FAF8F4`, `#F1EAE3`, `#F3E4E6`, `#DFE8DB`, `#403C3B`), Noto Serif/Sans Georgian, 15.5px საბაზისო ტექსტი, hover / active / focus-visible, `prefers-reduced-motion`, skip-link, 44px სამიზნეები.
- ერთიანი ბარათები: სურათი, სახელი, ბრენდი, მაღაზია + ქვეყანა, საწყისი ფასი / ფასი ფასდაკლებით / %, სავარაუდო ფასი საქართველოში, ვალუტა, სტატუსი (ACTIVE / UNVERIFIED / EXPIRED / OUT OF STOCK), ბოლო შემოწმება, პირდაპირი ბმული.
- ამოღებულია: Unsplash-ის საილუსტრაციო ფოტოები ბარათებზე (მაღაზიის მონოგრამა), სლაიდერი, marquee, `admin.html` ბმული.
- შავი პარასკევი: მხოლოდ სეზონში (1 ნოემბერი – 1 დეკემბერი) **და** თუ ბაზაში `black-friday` ტეგიანი აქციებია.

### Phase 2
- Deal Score (0–100) 10 ფაქტორით; ფაქტორი, რომლის მონაცემიც არ გვაქვს (მაღაზიის სანდოობა, მიწოდების დრო, დაბრუნება) ჩანს „—“-ით და ქულაში არ ითვლება; დაფარვა < 60% → „შეფასებისთვის მონაცემები არასაკმარისია“.
- BUY NOW / WAIT / SKIP მიზეზებით; საეჭვო ფასდაკლება (engine penalty) → SKIP. მაღაზიის საერთო აქციაზე რეკომენდაცია არ გაიცემა (კონკრეტული ფასი არ არის).
- ფასის ისტორია პროდუქტის გვერდზე: SVG გრაფიკი, 30/90 დღე, მინიმუმი, მიმდინარე, ცვლილება %, ბოლო განახლება; ხელოვნური ისტორია არ იქმნება.
- კალკულატორი: ფასი + შიდა მიწოდება + საერთაშორისო (ფაქტობრივი/მოცულობითი წონა) + მომსახურება + დღგ + მოსაკრებელი; გადამზიდავი × ქვეყანა; ყველა დაშვება სიაშია; „საბოლოო ფასი“ მხოლოდ მაშინ, როცა ყველა კომპონენტი დადასტურებულია.
- გადამზიდავები: USA2GEORGIA (აშშ, $9.95/კგ 2026-03-20-დან — `REPORTED`, წყარო BM.ge); Inex, Camex, Maleo, Barami — `PENDING`.
- KIKO Milano IT vs GB შედარება ლარში.

### Phase 3 (მომზადებული)
- რჩეულები (პროდუქტი/აქცია), სამიზნე ფასი, საყვარელი ბრენდები, მინ. ფასდაკლება — localStorage, შემოწმება საიტის გახსნისას; ძველი `vibes-favs` ავტომატურად გადმოდის.
- ელფოსტა: „მოლოდინის სია“ თანხმობის checkbox-ით და მკაფიო ტექსტით, რომ გაგზავნა ჯერ არ მუშაობს.
- Affiliate feed-ის არქიტექტურა: `docs/DATA_PIPELINE.md`.

## შენარჩუნებული ფუნქციები (სად გადავიდა)

| ძველი | ახალი |
|---|---|
| აქციების სია, ფილტრები, ძიება, „მეტის ნახვა“ | `deals.html` (გაერთიანებული პროდუქტებთან) |
| პროდუქტები ისტორიის სიგნალით | ბარათები ყველგან + `product.html` |
| ქულის განმარტება (დიალოგი) | Deal Score დიალოგი + „აქციის ქულა“ დიალოგი |
| სამყაროები (ქვეყანა, ქალი/კაცი/ბავშვი) | `categories.html` |
| ბრენდების ძიება + სკანერის პროდუქტები | `brands.html` |
| მაღაზიების გზამკვლევი | `stores.html` (+ AUTO / MANUAL / PENDING) |
| კალკულატორი, საბაჟო ტექსტი | `tools.html` |
| პრომოკოდის კოპირება, რჩეულები | ბარათებზე / `saved.html` |
| გამოწერა (`radar_subscribers`) | `saved.html` |
| `/api/price-search` | `tools.html`, ჩანს მხოლოდ თუ `PRICE_SEARCH_API` მითითებულია |

## ტესტები (2026-11-11)

- `npm test` — 15/15 (pricing, customs, volumetric, statuses, history, score, recommendation, XSS-safe URLs, alerts).
- `node tests/e2e.mjs` — 75/75: 7 გვერდი × 3 ეკრანი (JS შეცდომა არ არის, ჰორიზონტალური scroll არ არის) + ძიება, ფილტრი, დალაგება, URL state, დიალოგები, რჩეულები, სამიზნე ფასი, ვალიდაცია, კალკულატორი (საბაჟო ზღვარი, ტარიფები, მოცულობითი წონა), შედარება, skip-link, მობილური მენიუ/ფილტრები.
- სატესტო გარემოში პროდუქტების სურათების CDN დაბლოკილი იყო, ამიტომ სურათები ვიზუალურად ვერ შემოწმდა (fallback მუშაობს).

## განახლება — 2026-11-12: მთავარი გვერდი დაბრუნდა ორიგინალ ვიზუალზე

მფლობელის მოთხოვნით `index.html` დაბრუნდა საწყის ვერსიაზე (იგივე დიზაინი, სლაიდერი, მენიუ, სექციები) და მასში ჩაშენდა ახალი ფუნქციები:
- პროდუქტის ბარათებზე: ახალი Deal Score (ფაქტორების განმარტებით), BUY NOW / WAIT / SKIP, სტატუსი, ბმული „ანალიზი · ფასის ისტორია“ → `product.html`.
- აქციების ბარათებზე: ACTIVE / UNVERIFIED სტატუსი.
- „ფასების შედარება“ აღარ იყენებს არარსებულ `/api`-ს — მუშაობს რეალურ `compare_items` მონაცემებზე (KIKO IT/GB).
- გამოწერის ფორმას დაემატა თანხმობის ველი.
- მენიუში დაემატა: ყველა შეთავაზება · ფილტრები, ინსტრუმენტები, რჩეულები. კალკულატორს — ბმული დეტალურ კალკულატორზე.
- `admin.html` (404) ბმული ჩანაცვლდა „რჩეულებით“.
- მთავარი გვერდის რჩეულები (`vibes-favs`) სინქრონიზებულია `saved.html`-თან.
დანარჩენი გვერდები ძველი პალიტრითა და ტიპოგრაფიითაა გაფორმებული.

## განახლება — 2026-11-12: კატეგორიის პანელი და „საუკეთესო შეთავაზებები“

- ზედა კატეგორიების პანელი იხსნება შესაბამისი ღილაკის ქვეშ (ცენტრის ნაცვლად), უკანა ფონი ბლარდება და გვერდი იკეტება (სქროლი, კლავიატურა, შეხება); სიის ბოლოში სქროლი საიტზე აღარ გადადის; დახურვა რბილია.
- „04 / პროდუქცია ფასების ისტორიით“ სექცია მთავარი გვერდიდან მოიხსნა (დამატებითი მოთხოვნა `offers`-ზე და პროდუქტის სურათები აღარ იტვირთება). ნაცვლად — „04 / საუკეთესო შეთავაზებები“: ოთხი კატეგორია (ფეხსაცმელი, ჩანთები, ტანსაცმელი, სათვალე), თითოეულში შემთხვევით შერჩეული შეთავაზება, ყველა სხვადასხვა მაღაზიიდან; კანდიდატები მხოლოდ ქულა ≥ 85 და ფასდაკლება ≥ 60% (თუ ასეთი 3-ზე ნაკლებია — კატეგორიის ტოპ-3). კატეგორია განისაზღვრება `deals.category`-თი და აღწერის საკვანძო სიტყვებით (ჩანთა/სათვალე/ფეხსაცმელი რამდენიმე ენაზე). ყოველ 6 წამში ერთი ბარათი იცვლება (ჩერდება მაუსის მიტანისას, ფოკუსზე, როცა სექცია ეკრანს გარეთაა და reduced-motion-ზე); ღილაკი „სხვა შეთავაზებები ⟳“ ოთხივეს ხელახლა არჩევს. წყარო — უკვე ჩატვირთული `deals`, დამატებითი მოთხოვნის გარეშე. `product.html`, `deals.html`, `brands.html` უცვლელია.

## Admin panel and automatic link checks
- `admin.html` (noindex), for admins only (`is_admin()`; RLS enforces it server-side). It has five tabs:
  - **Overview:** active deals, deals needing attention, stores, visitors over 7 days, ratings.
  - **Deals:** add, edit, mark "still valid", end, restore and delete deals. The deal score is calculated automatically.
  - **Stores:** add and edit stores; turn automatic scanning on or off.
  - **Automation:** each scheduled job, its last result, and "run now" for link checks and price scans.
  - **Feedback & visits:** ratings, top pages, referrers and devices over 30 days.
- New Edge Function `deal-check`, run daily at 03:23 UTC by pg_cron. It opens every active deal's link:
  - **Link works:** `last_checked` is refreshed.
  - **Link gone** (404/410, or redirects to the homepage) **twice in a row:** the deal is expired.
  - **Store blocks bots:** a note only; the deal is flagged for a manual check.
- In the cabinet's settings, admins see an "ადმინ-პანელი" link. Signing in from `account.html?next=admin.html` goes straight to the panel.

## Product search: best price first, then alternatives
- New page `search.html`. Every search box on the site now opens it; the home-page search overlay included.
- **Sources, queried in parallel:**
  - Live search on every store whose site has a public product search. Today that is 13 stores, mostly Shopify (the Edge Function `live-search`, cached 30 min, capped at 40 fresh searches per minute).
  - Our crawled catalogue.
  - The cross-country brand prices in `compare_items`.
- **Every result is priced the same way:** "≈ in Georgia" = price + shipping + customs, an estimate from `pricing.js`.
  - The card at the top is the cheapest in-stock exact match.
  - Below it, the alternatives are sorted by that total.
- **Same product across stores:** titles are reduced to a key: model words + canonical size (3.4 oz → 100ml, Eau de Parfum → edp), without colours, genders, style codes or filler words.
  - Only identical keys count as the same product. "Save up to X" is shown only for the same product at other stores.
  - Variant chips ("Eau de Parfum 100ml", "Samba OG"…) narrow the comparison to one product.
- **Kids' versions and side products** (deodorant, laces…) move to a "similar" section unless the query asks for them.
- **Georgian queries work:** brand names (ნაიკი → nike), common words (სუნამო → parfum) and transliteration. Typos are tolerated in words of 5+ letters.
- **Store sales and categories that match the query are shown too.** A bare category word ("ფეხსაცმელი") opens with the category link and its sales.
- **Stores without a public search** get one-click links to search them on Google.
- **The admin panel shows searches over 30 days:** what people search for, and which searches found nothing.
- The search engine now lives in `assets/js/search-engine.js` and has its own styles (`SEARCH_CSS`). Three places use it:
  - the search page;
  - the home-page price finder ("09 / ფასების შედარება");
  - the tools page's comparison box.
- In the home finder and the tools box, a typed product shows the best price in Georgia, then 5 alternatives, with a link to the full results. With the box empty, they still show the cross-country brand examples (KIKO Milano, Speedo).
- **Brand-only searches** ("new balance", "newbalance"):
  - Brands typed as one word are split using the brand list from our stores.
  - Titles always show the brand. Some stores leave it out ("Sneakers T500…"); ALL-CAPS brands are tidied.
  - A "which model?" picker (9060, 530, 1080v15…) re-runs the search for the exact model.
  - The price card is labelled "cheapest <brand> in these stores".
- "1080 V15" and "1080v15" count as the same model.
- `live-search` asks each store for 10 results (Shopify's maximum), up from 8.

## Search: reliability and result quality (from real searches that went wrong)
- **live-search no longer serves a bad moment for 30 minutes.**
  - A store that answers 429/5xx or times out is retried once.
  - Answers where under 70% of stores responded are kept for 2 minutes only, flagged `partial`, and the page says so.
  - Each store's currency is remembered in `stores.search_currency` (refreshed weekly), so every search sends half as many requests to the stores.
- **Matching:**
  - Filler words in queries are ignored ("aventus by creed").
  - Numbers and 1–2-letter words match whole words only ("90" ≠ "9060", "6" ≠ "1906", "on" ≠ "lotion").
  - Typos are forgiven only in words of 6+ letters ("lloyd" ≠ "floyd").
- **Brand focus:**
  - When the query names a brand, other brands go to "similar". With equally good candidates, the brand exactly named wins ("lloyd": LLOYD over Milton-Lloyd).
  - When no brand is named but one dominates, knock-offs go to "similar" ("aventus" → Creed, not "Yacht Man Aventus").
  - Results without a brand count only when the title leads with the brand or credits it ("by Christian Dior"). "Funko … Gage Creed" does not count.
  - Vendor codes ("2718", "R2808") are not brands, and no longer appear in front of titles.
- **Side products:** bundles, gift sets, vials and combo packs go to "similar".
- **No exact match:** the closest results (≥ 2/3 of the words) are shown instead of an empty page, on the search page, in the home-page finder and in the tools box.
- The sales page links a typed query to the product search.
- `tests/search.test.mjs`: the rules above, checked offline on the real cases. `npm test` runs both unit suites.
