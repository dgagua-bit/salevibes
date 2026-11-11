-- Applied to project fyfanpmszhopxjaerubd on 2026-11-11.
-- price_history had RLS enabled with no policy, so the public site could not read it.
-- Prices are public information; reads only, no write access is granted.
create policy "Public read price history" on public.price_history
  for select to anon, authenticated using (true);
create index if not exists price_history_product_observed_idx
  on public.price_history (product_id, observed_at desc);

-- Rollback:
-- drop policy "Public read price history" on public.price_history;
-- drop index if exists price_history_product_observed_idx;
