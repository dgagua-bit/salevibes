# SaleVibes

Shopping Intelligence საქართველოსთვის: **REAL DEALS → REAL PRICES → LANDED COST IN GEORGIA → SMART BUYING DECISION**.

SaleVibes არ ყიდის პროდუქტს. ის აჩვენებს საერთაშორისო მაღაზიების მოქმედ აქციებს, ადევნებს თვალს პროდუქტების ფასს, ითვლის სავარაუდო ღირებულებას საქართველოში და იძლევა გამჭვირვალე Deal Score-სა და BUY NOW / WAIT / SKIP რეკომენდაციას.

ვებსაიტი: https://dgagua-bit.github.io/salevibes/

## სტრუქტურა

სტატიკური საიტი GitHub Pages-ზე, build-ის გარეშე (ES modules). მონაცემები — Supabase (REST, publishable key + RLS).

| ფაილი | დანიშნულება |
|---|---|
| `index.html` | მთავარი: Hero + ძიება, დღის საუკეთესო, კატეგორიები, აქციები, ბრენდები, მაღაზიები, „რატომ SaleVibes“ |
| `deals.html` | ერთიანი ძიება, ფილტრები, დალაგება (პროდუქტები + მაღაზიის აქციები) |
| `product.html?id=` | პროდუქტის ანალიზი: ფასები, სტატუსი, Deal Score, რეკომენდაცია, ფასის ისტორია (30/90), ღირებულება საქართველოში |
| `categories.html`, `brands.html`, `stores.html` | კატეგორიები (ქვეყანა/აუდიტორია), ბრენდები, მაღაზიების გზამკვლევი მონაცემთა წყაროს სტატუსით |
| `tools.html` | ჩამოტანის კალკულატორი, გადამზიდავები, საბაჟო, ფასები ქვეყნებს შორის |
| `saved.html` | რჩეულები, სამიზნე ფასი, ბრენდები, ელფოსტის მოლოდინის სია |
| `assets/js/config.js` | Supabase, ქვეყნები, კატეგორიები, **გადამზიდავების ტარიფები და საბაჟო წესები სტატუსით/წყაროთი** |
| `assets/js/api.js` | მონაცემთა წვდომა (timeout, cache, შეცდომები) |
| `assets/js/pricing.js` | ღირებულება საქართველოში (კურსი, მოცულობითი წონა, საბაჟო) — pure |
| `assets/js/score.js` | Deal Score, სტატუსები, BUY / WAIT / SKIP — pure |
| `assets/js/intel.js`, `data.js` | მონაცემების გამდიდრება და ჩატვირთვა |
| `assets/js/ui.js` | header/footer, ბარათები, დიალოგები, ცხრილები |
| `assets/js/wishlist.js` | რჩეულები და ლოკალური შეტყობინებები (localStorage) |
| `assets/js/pages/*.js` | თითო გვერდის ლოგიკა |

## ტესტები

```bash
npm test
```

```bash
python3 -m http.server 8765
```

```bash
node tests/e2e.mjs http://localhost:8765/
```

`tests/unit.test.mjs` — ფასის/საბაჟოს/ქულის/სტატუსების ლოგიკა (Node). `tests/e2e.mjs` — Playwright: 7 გვერდი × 3 ეკრანი (390 / 820 / 1440 px), JS შეცდომები, ჰორიზონტალური scroll, ძიება, ფილტრები, დალაგება, დიალოგები, რჩეულები, კალკულატორი, მობილური მენიუ.

## კონფიგურაცია

- ტარიფის დამატება: `config.js → CARRIERS[].rates[COUNTRY]` — `usdPerKg`, `effective`, `source`, `status` (`VERIFIED` მხოლოდ ოფიციალური, თარიღიანი წყაროთი).
- საბაჟო წესების გადამოწმების შემდეგ: `CUSTOMS.status = "VERIFIED"`, `checkedOn = "YYYY-MM-DD"`.
- გარე ფასების ძიება: `PRICE_SEARCH_API` — მხოლოდ რეალურად განთავსებული endpoint-ით.

დეტალები: [`docs/CHANGES.md`](docs/CHANGES.md), [`docs/DATA_PIPELINE.md`](docs/DATA_PIPELINE.md).
