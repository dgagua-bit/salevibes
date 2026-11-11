# მონაცემთა წყაროები და განახლება

მდგომარეობა 2026-11-11-ის მიხედვით (Supabase პროექტი `sale-radar`).

## რა მუშაობს ახლა

| წყარო | ცხრილი | განახლება | სტატუსი საიტზე |
|---|---|---|---|
| მაღაზიების საერთო აქციები (71 აქტიური) | `deals` | რედაქცია ხელით; `expire-deals` cron (ყოველ საათში) ვადაგასულს `expired`-ად ნიშნავს | `MANUAL`; ACTIVE ≤ 7 დღის შემოწმებით, სხვა შემთხვევაში UNVERIFIED |
| პროდუქტების ფასები (Westwing DE, Coin Casa IT) | `products`, `offers`, `price_history` | Edge Function `radar-engine`, pg_cron ყოველ 30 წთ-ში; JSON-LD სკანირება; `crawl_runs` ლოგი | `AUTO`; ACTIVE ≤ 48 სთ-ში ნანახი, სხვა შემთხვევაში UNVERIFIED |
| KIKO Milano IT vs GB | `compare_sources`, `compare_items`, `compare_prices` | 12 სთ-ში ერთხელ | `tools.html` → „ფასები ქვეყნებს შორის“ (ადრე საიტზე არ ჩანდა) |
| ვალუტის კურსი (NBG) | `fx_rates` | დღეში ერთხელ | ყველა გამოთვლაში, თარიღით |
| ელფოსტის მოლოდინის სია | `radar_subscribers` | — | მხოლოდ შენახვა (anon INSERT), გაგზავნა არ არსებობს |

`stores` ცხრილში 98 მაღაზიაა; ავტომატური სკანირება ჩართულია 2-ზე (`active = true`). დანარჩენი — `MANUAL` (თუ აქცია აქვს) ან `PENDING`.

## ცვლილება ბაზაში

`supabase/migrations/20261111_public_read_price_history.sql` — `price_history`-ს ჰქონდა RLS პოლიტიკის გარეშე, ამიტომ საიტი ისტორიას ვერ კითხულობდა. დაემატა მხოლოდ წაკითხვის პოლიტიკა და ინდექსი.

## სამიზნე არქიტექტურა (Affiliate Feed)

```
Affiliate Product Feed (მაგ. YOOX via Awin / Rakuten)
  → Importer (Supabase Edge Function, pg_cron)
  → staging: feed_runs, feed_items
  → products / offers / price_history (upsert by store + external_id/SKU)
  → საიტი (read-only RLS)
```

Importer-ის მოთხოვნები:
1. ფიდის URL და ტოკენი — მხოლოდ Supabase Vault / Edge Function secrets-ში, არასდროს frontend-ში.
2. იდენტიფიკაცია: `store_id + external_id`, დამატებით `sku`/GTIN; `fingerprint` რჩება fallback-ად.
3. ფასის ცვლილებისას ჩანაწერი `price_history`-ში; `last_seen_at` ყოველ ნახვაზე.
4. ფიდიდან გაქრა → `missing_count++`; 2 გამოტოვების შემდეგ `possibly_expired`, 3-ის შემდეგ `expired`.
5. `in_stock = false` → საჯაროდ არ ჩანს (არსებული RLS).
6. ყოველი გაშვება → `crawl_runs` (status, counts, error_message).
7. სანამ ფიდზე წვდომა არ არის, მაღაზია რჩება `MANUAL`/`PENDING` — ყალბი ავტომატური განახლება არ იქმნება.

## ელფოსტის შეტყობინებები (მომდევნო ეტაპი)

საჭიროა: double opt-in (დადასტურების ბმული), `unsubscribe_token` თითო ჩანაწერზე, ტრანზაქციული ელფოსტის პროვაიდერი (Resend/Postmark) Edge Function-დან, ფასის ზღვრების სერვერზე შენახვა (`alerts` ცხრილი, RLS: მხოლოდ საკუთარი რიგები — Supabase Auth magic link). სანამ ეს არ არსებობს, საიტზე ფორმა მკაფიოდ წერს, რომ გაგზავნა ჯერ არ მუშაობს.
