-- Applied to project fyfanpmszhopxjaerubd on 2026-11-13.
alter table public.compare_items add column if not exists weight_g integer check (weight_g is null or weight_g between 1 and 50000);
insert into public.stores (name, slug, country, currency, base_url, crawl_urls, adapter, category, active, worlds, audience, brands, sort_order)
values ('Speedo','speedo','GB','GBP','https://speedo.com/','[]'::jsonb,'shopify','fashion', false, array['fashion','accessories'], array['women','men','kids'], array['Speedo'], 40)
on conflict (slug) do nothing;
-- deals.id identity had fallen behind max(id) (rows inserted with explicit ids); realigned:
select setval(pg_get_serial_sequence('public.deals','id'), (select max(id) from public.deals));
-- Edge Function `brand-compare` runs daily (cron 'brand-compare', 04:37 UTC): reads Speedo's sale
-- collection in GB/DE/FR/US markets into compare_items/compare_prices and maintains the Speedo deal row.
