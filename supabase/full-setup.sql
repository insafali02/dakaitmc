-- Dakait MC full setup SQL (schema + latest data seed)
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'editor', 'player');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role public.app_role not null default 'player',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.ranks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  subtitle text,
  price_pkr integer,
  invite_requirement text,
  chat_colour text,
  homes text,
  vaults text,
  auction_slots text,
  craft boolean not null default false,
  recipe boolean not null default false,
  disposal boolean not null default false,
  near boolean not null default false,
  hat boolean not null default false,
  feed boolean not null default false,
  invsee boolean not null default false,
  enderchest boolean not null default false,
  ptime boolean not null default false,
  pweather boolean not null default false,
  kit_name text,
  cta_label text not null default 'Buy Now',
  cta_url text,
  image_path text,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rank_comparison_rows (
  id uuid primary key default gen_random_uuid(),
  feature_name text not null,
  free_value text not null,
  vip_value text not null,
  elite_value text not null,
  deadliest_value text not null,
  oblix_value text not null,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.store_categories(id) on delete cascade,
  title text not null,
  package_label text,
  description text,
  price_pkr integer not null,
  cta_label text not null default 'Buy Now',
  cta_url text,
  image_path text,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rarity text not null,
  style text not null,
  description text,
  price_pkr integer,
  cta_label text not null default 'Buy Now',
  cta_url text,
  image_path text,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_path text,
  published_at timestamptz,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_text text,
  value_json jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  ign text not null,
  role text not null,
  bio text,
  image_path text,
  is_published boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ranks_published_order on public.ranks (is_published, sort_order);
create index if not exists idx_rank_rows_published_order on public.rank_comparison_rows (is_published, sort_order);
create index if not exists idx_store_categories_published_order on public.store_categories (is_published, sort_order);
create index if not exists idx_store_items_published_order on public.store_items (is_published, sort_order);
create index if not exists idx_tags_published_order on public.tags (is_published, sort_order);
create index if not exists idx_rules_published_order on public.rules (is_published, sort_order);
create index if not exists idx_faqs_published_order on public.faqs (is_published, sort_order);
create index if not exists idx_announcements_published_order on public.announcements (is_published, sort_order);
create index if not exists idx_site_settings_published_order on public.site_settings (is_published, sort_order);
create index if not exists idx_staff_members_published_order on public.staff_members (is_published, sort_order);

drop trigger if exists set_updated_at_ranks on public.ranks;
create trigger set_updated_at_ranks before update on public.ranks
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_rank_comparison_rows on public.rank_comparison_rows;
create trigger set_updated_at_rank_comparison_rows before update on public.rank_comparison_rows
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_store_categories on public.store_categories;
create trigger set_updated_at_store_categories before update on public.store_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_store_items on public.store_items;
create trigger set_updated_at_store_items before update on public.store_items
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_tags on public.tags;
create trigger set_updated_at_tags before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_rules on public.rules;
create trigger set_updated_at_rules before update on public.rules
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_faqs on public.faqs;
create trigger set_updated_at_faqs before update on public.faqs
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_announcements on public.announcements;
create trigger set_updated_at_announcements before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_site_settings on public.site_settings;
create trigger set_updated_at_site_settings before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_staff_members on public.staff_members;
create trigger set_updated_at_staff_members before update on public.staff_members
for each row execute function public.set_updated_at();

create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

alter table public.profiles enable row level security;
alter table public.ranks enable row level security;
alter table public.rank_comparison_rows enable row level security;
alter table public.store_categories enable row level security;
alter table public.store_items enable row level security;
alter table public.tags enable row level security;
alter table public.rules enable row level security;
alter table public.faqs enable row level security;
alter table public.announcements enable row level security;
alter table public.site_settings enable row level security;
alter table public.staff_members enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin_or_editor());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin_or_editor())
with check (auth.uid() = id or public.is_admin_or_editor());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin"
on public.profiles
for delete
to authenticated
using (public.is_admin_or_editor());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'ranks',
    'rank_comparison_rows',
    'store_categories',
    'store_items',
    'tags',
    'rules',
    'faqs',
    'announcements',
    'site_settings',
    'staff_members'
  ]
  loop
    execute format('drop policy if exists "public_read_%1$s" on public.%1$s;', table_name);
    execute format(
      'create policy "public_read_%1$s" on public.%1$s for select to anon, authenticated using (is_published = true);',
      table_name
    );

    execute format('drop policy if exists "admin_write_%1$s" on public.%1$s;', table_name);
    execute format(
      'create policy "admin_write_%1$s" on public.%1$s for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());',
      table_name
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public_media_read" on storage.objects;
create policy "public_media_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "admin_media_upload" on storage.objects;
create policy "admin_media_upload"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media' and public.is_admin_or_editor());

drop policy if exists "admin_media_update" on storage.objects;
create policy "admin_media_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'media' and public.is_admin_or_editor())
with check (bucket_id = 'media' and public.is_admin_or_editor());

drop policy if exists "admin_media_delete" on storage.objects;
create policy "admin_media_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media' and public.is_admin_or_editor());

alter table if exists public.store_items
add column if not exists description text;

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

alter table if exists public.store_items
add column if not exists description text;

delete from public.store_items;
delete from public.store_categories;
delete from public.visual_feed_items;
delete from public.rank_comparison_rows;
delete from public.ranks;
delete from public.tags;
delete from public.rules;
delete from public.faqs;
delete from public.announcements;
delete from public.staff_members;

insert into public.site_settings (key, value_text, sort_order, is_published)
values
  ('server_ip', 'play.dakaitmc.net', 1, true),
  ('discord_url', 'https://discord.gg/dakaitmc', 2, true),
  ('primary_cta', 'Join Discord', 3, true),
  ('store_url', '/store', 4, true)
on conflict (key) do update
set value_text = excluded.value_text,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into public.ranks (
  code, title, subtitle, price_pkr, invite_requirement, chat_colour, homes, vaults, auction_slots,
  craft, recipe, disposal, near, hat, feed, invsee, enderchest, ptime, pweather,
  kit_name, cta_label, cta_url, sort_order, is_published
)
values
  ('FREE', 'FREE', 'FREE RANK', null, '10 Discord Invites', null, '2x', '✓', '2x',
    false, false, false, false, false, false, false, false, false, false,
    'Free Kit', 'Join Discord', 'https://discord.gg/dakaitmc', 1, true),
  ('VIP', 'VIP', 'VIP RANK', 150, null, 'Green', '2x', '3x', '3x',
    true, false, false, false, false, false, false, false, false, true,
    'VIP Kit', 'Buy Now', '#', 2, true),
  ('ELITE', 'ELITE', 'ELITE RANK', 250, null, 'Purple &f', '4x', '6x', '6x',
    true, true, true, true, true, true, true, false, false, true,
    'Elite Kit', 'Buy Now', '#', 3, true),
  ('DEADLIEST', 'DEADLIEST', 'DEADLIEST RANK', 350, null, 'Red', '6x', '8x', '8x',
    true, true, true, true, true, true, true, true, false, true,
    'Deadliest Kit', 'Buy Now', '#', 4, true),
  ('OBLIX', 'OBLIX', 'OBLIX RANK', 500, null, 'Blue', '8x', '10x', '10x',
    true, true, true, true, true, true, true, true, true, true,
    'Oblix Kit', 'Buy Now', '#', 5, true)
on conflict (code) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  price_pkr = excluded.price_pkr,
  invite_requirement = excluded.invite_requirement,
  chat_colour = excluded.chat_colour,
  homes = excluded.homes,
  vaults = excluded.vaults,
  auction_slots = excluded.auction_slots,
  craft = excluded.craft,
  recipe = excluded.recipe,
  disposal = excluded.disposal,
  near = excluded.near,
  hat = excluded.hat,
  feed = excluded.feed,
  invsee = excluded.invsee,
  enderchest = excluded.enderchest,
  ptime = excluded.ptime,
  pweather = excluded.pweather,
  kit_name = excluded.kit_name,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into public.rank_comparison_rows (
  feature_name, free_value, vip_value, elite_value, deadliest_value, oblix_value, sort_order, is_published
)
values
  ('Chat Colour', '✗', '✓ Green', '✓ Purple &f', '✓ Red', '✓ Blue', 1, true),
  ('Homes', '✗', '✓ 2x', '✓ 4x', '✓ 6x', '✓ 8x', 2, true),
  ('/vaults', '✗', '✓ 3x', '✓ 6x', '✓ 8x', '✓ 10x', 3, true),
  ('Auction Slots', '✓ 2x', '✓ 3x', '✓ 6x', '✓ 8x', '✓ 10x', 4, true),
  ('/craft', '✓', '✓', '✓', '✓', '✓', 5, true),
  ('/recipe', '✗', '✓', '✓', '✓', '✓', 6, true),
  ('/disposal', '✗', '✗', '✓', '✓', '✓', 7, true),
  ('/near', '✗', '✗', '✓', '✓', '✓', 8, true),
  ('/hat', '✗', '✗', '✓', '✓', '✓', 9, true),
  ('/feed', '✗', '✗', '✓', '✓', '✓', 10, true),
  ('/invsee', '✗', '✗', '✓', '✓', '✓', 11, true),
  ('/enderchest', '✗', '✗', '✓', '✓', '✓', 12, true),
  ('/ptime', '✗', '✗', '✗', '✓', '✓', 13, true),
  ('/pweather', '✗', '✗', '✗', '✗', '✓', 14, true),
  ('Kit', '✗', '✓ VIP', '✓ Elite', '✓ Deadliest', '✓ Oblix', 15, true),
  ('Action', 'Join Discord', 'Buy Now', 'Buy Now', 'Buy Now', 'Buy Now', 16, true);

insert into public.visual_feed_items (title, subtitle, image_path, sort_order, is_published)
values
  ('Outpost Skyline', 'Spawn Control', '/media/minecraft/dungeons-main.png', 1, true),
  ('Raid District', 'Active Conflict', '/media/minecraft/dungeons-flames-nether.png', 2, true),
  ('Portal Core', 'Transfer Hub', '/media/minecraft/dungeons-hidden-depths.png', 3, true),
  ('Bounty Board', 'Wanted Feed', '/media/minecraft/dungeons-jungle-awakens.png', 4, true),
  ('Crate Vault', 'Premium Loot', '/media/minecraft/minecraft-nether-update.png', 5, true),
  ('Wasteland Grid', 'Frontline Sector', '/media/minecraft/minecraft-bedrock.png', 6, true);

insert into public.store_categories (name, slug, description, sort_order, is_published)
values
  ('Crate Keys', 'crate-keys', 'Party, Elite, Matrix, and Oblix key bundles.', 1, true),
  ('In-Game Money', 'in-game-money', 'Cash bundles to boost your progression.', 2, true),
  ('Heart Items', 'heart-items', 'Extra hearts for survival advantage.', 3, true),
  ('Elite Kits', 'elite-kits', 'Complete kits with armor, tools, and resources.', 4, true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

with categories as (
  select id, slug from public.store_categories
)
insert into public.store_items (
  category_id, title, package_label, description, price_pkr, cta_label, cta_url, sort_order, is_published
)
values
  ((select id from categories where slug = 'crate-keys'), 'PARTY (3x)', 'Party', null, 50, 'Buy Now', '#', 1, true),
  ((select id from categories where slug = 'crate-keys'), 'ELITE (3x)', 'Elite', null, 200, 'Buy Now', '#', 2, true),
  ((select id from categories where slug = 'crate-keys'), 'MATRIX (3x)', 'Matrix', null, 300, 'Buy Now', '#', 3, true),
  ((select id from categories where slug = 'crate-keys'), 'OBLIX (3x)', 'Oblix', null, 400, 'Buy Now', '#', 4, true),
  ((select id from categories where slug = 'in-game-money'), '500K CASH', 'Cash', null, 50, 'Buy Now', '#', 1, true),
  ((select id from categories where slug = 'in-game-money'), '1.5M CASH', 'Cash', null, 100, 'Buy Now', '#', 2, true),
  ((select id from categories where slug = 'in-game-money'), '5M CASH', 'Cash', null, 300, 'Buy Now', '#', 3, true),
  ((select id from categories where slug = 'heart-items'), '1 HEART', 'Heart', null, 50, 'Buy Now', '#', 1, true),
  ((select id from categories where slug = 'heart-items'), '5 HEARTS', 'Heart', null, 250, 'Buy Now', '#', 2, true),
  ((select id from categories where slug = 'heart-items'), '10 HEARTS', 'Heart', null, 500, 'Buy Now', '#', 3, true),
  ((select id from categories where slug = 'elite-kits'), 'VIP KIT', 'VIP KIT', 'Complete VIP Kit Items\nArmor & Tools Set\nStarter Resources', 50, 'Buy Now', '#', 1, true),
  ((select id from categories where slug = 'elite-kits'), 'ELITE KIT', 'ELITE KIT', 'Complete Elite Kit Items\nPremium Armor & Tools\nAdvanced Resources', 100, 'Buy Now', '#', 2, true),
  ((select id from categories where slug = 'elite-kits'), 'IMMORTAL KIT', 'IMMORTAL KIT', 'Complete Immortal Kit Items\nLegendary Armor & Tools\nRare Resources', 150, 'Buy Now', '#', 3, true),
  ((select id from categories where slug = 'elite-kits'), 'OBLIX KIT', 'OBLIX KIT', 'Ultimate Oblix Kit Items\nGod-tier Armor & Tools\nExclusive Resources', 200, 'Buy Now', '#', 4, true);

insert into public.tags (name, rarity, style, description, price_pkr, cta_label, cta_url, sort_order, is_published)
values
  ('OUTLAW', 'Epic', 'Blood Red', 'The wanted aura for feared fighters.', 150, 'Buy Now', '#', 1, true),
  ('SHADOW', 'Rare', 'Steel Gray', 'Low profile, high danger.', 100, 'Buy Now', '#', 2, true),
  ('BANDIT KING', 'Legendary', 'Royal Gold', 'For players who rule the wasteland.', 300, 'Buy Now', '#', 3, true);

insert into public.rules (title, body, sort_order, is_published)
values
  ('No Cheating or Exploits', 'Using hacks, X-ray, dupes, or abuse of bugs results in instant punishment.', 1, true),
  ('Respect All Players', 'Trash talk is fine, harassment and hate speech are not tolerated.', 2, true),
  ('No Unauthorized Real-Money Trading', 'All purchases must happen through official Dakait MC channels.', 3, true);

insert into public.faqs (question, answer, sort_order, is_published)
values
  ('How do I join Dakait MC?', 'Launch Minecraft, add the server IP from the homepage, and jump in.', 1, true),
  ('Where does Buy Now take me?', 'Buy Now opens the Discord server link configured in admin settings.', 2, true),
  ('Can I upgrade to a higher rank later?', 'Yes. You can move up anytime by purchasing a higher rank package.', 3, true);

insert into public.announcements (title, body, published_at, sort_order, is_published)
values
  ('Season Wipe: Dustfall', 'Fresh map, reset economy, and new outlaw events go live this weekend.', now(), 1, true);

insert into public.staff_members (ign, role, bio, sort_order, is_published)
values
  ('SheriffZ', 'Owner', 'Runs the server economy and event roadmap.', 1, true),
  ('DustMarshal', 'Admin', 'Handles moderation and anti-cheat control.', 2, true),
  ('CanyonFox', 'Moderator', 'Keeps community channels active and clean.', 3, true);

-- Optional bootstrap:
-- replace with your admin auth email and run once after signup.
-- update public.profiles set role = 'admin' where email = 'you@example.com';
