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
