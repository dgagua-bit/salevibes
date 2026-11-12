-- Applied to project fyfanpmszhopxjaerubd on 2026-11-12.
-- Visitor feedback and anonymous page views. The site may only INSERT; reading is admin-only.
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  page text check (char_length(page) <= 200),
  device text check (device in ('mobile','tablet','desktop'))
);
alter table public.feedback enable row level security;
create policy "Anyone can send feedback" on public.feedback for insert to anon, authenticated with check (true);
create policy "Admins read feedback" on public.feedback for select to authenticated using ((select is_admin()));

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path text not null check (char_length(path) <= 200),
  referrer text check (char_length(referrer) <= 200),
  device text check (device in ('mobile','tablet','desktop')),
  visitor text check (char_length(visitor) <= 40)
);
alter table public.page_views enable row level security;
create policy "Anyone can record a page view" on public.page_views for insert to anon, authenticated with check (true);
create policy "Admins read page views" on public.page_views for select to authenticated using ((select is_admin()));
create index if not exists page_views_created_idx on public.page_views (created_at desc);
grant insert on public.feedback, public.page_views to anon, authenticated;
