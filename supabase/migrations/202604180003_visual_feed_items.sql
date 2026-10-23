create table if not exists public.visual_feed_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_path text,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_visual_feed_items_published_order
on public.visual_feed_items (is_published, sort_order);

drop trigger if exists set_updated_at_visual_feed_items on public.visual_feed_items;
create trigger set_updated_at_visual_feed_items
before update on public.visual_feed_items
for each row execute function public.set_updated_at();

alter table public.visual_feed_items enable row level security;

drop policy if exists "public_read_visual_feed_items" on public.visual_feed_items;
create policy "public_read_visual_feed_items"
on public.visual_feed_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admin_write_visual_feed_items" on public.visual_feed_items;
create policy "admin_write_visual_feed_items"
on public.visual_feed_items
for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());
