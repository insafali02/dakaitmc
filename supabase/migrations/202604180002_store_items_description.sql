alter table if exists public.store_items
add column if not exists description text;
