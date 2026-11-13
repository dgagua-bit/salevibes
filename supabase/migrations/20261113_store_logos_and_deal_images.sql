-- Applied to project fyfanpmszhopxjaerubd on 2026-11-13.
-- Store logos and promotion photos, filled by the `media-scout` Edge Function (copied into the public store-media bucket).
alter table public.stores add column if not exists logo_url text, add column if not exists media_checked_at timestamptz;
alter table public.deals add column if not exists image_url text, add column if not exists media_checked_at timestamptz;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('store-media','store-media', true, 3145728, array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/x-icon','image/vnd.microsoft.icon','image/avif'])
on conflict (id) do nothing;
-- Scheduled every 10 minutes; each run refreshes up to 12 stores and 12 promotions not checked in the last 3 days.
-- select cron.schedule('media-scout','*/10 * * * *', $$ select net.http_post(url := '.../functions/v1/media-scout',
--   headers := jsonb_build_object('Content-Type','application/json','x-radar-secret',(select decrypted_secret from vault.decrypted_secrets where name='radar_cron_secret')),
--   body := '{"limit":12}'::jsonb, timeout_milliseconds := 140000) $$);
