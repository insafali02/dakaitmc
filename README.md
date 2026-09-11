# Dakait MC Website

Production-ready Next.js + Supabase website and admin panel for **Dakait MC**.

## What You Get

- Bold outlaw-themed public website (English-only)
- Routes:
  - `/`
  - `/ranks`
  - `/store`
  - `/tags`
  - `/rules`
  - `/faq`
  - `/staff`
- Protected `/admin` panel with:
  - Supabase Auth login
  - Role-based access (`admin`, `editor`)
  - Full CRUD + reorder + publish/unpublish
  - Image upload to Supabase Storage (`media` bucket)
- Supabase SQL migration with:
  - Full schema
  - RLS policies
  - Storage policies
- Seed script with exact rank/store content provided in the brief

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Postgres, Auth, Storage, RLS)
- Vercel deployment target

## Project Structure

```text
app/
  admin/
  api/admin/
  ranks/
  store/
  tags/
  rules/
  faq/
  staff/
components/
  admin/
  layout/
  sections/
lib/
  data/
  supabase/
supabase/
  migrations/202604180001_init.sql
  migrations/202604180002_store_items_description.sql
  migrations/202604180003_visual_feed_items.sql
  full-setup.sql
  seed.sql
```

## 1) Local Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env.local` (or manual copy on Windows)
3. Fill `.env.local`:
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...`)
   - optional: `DATABASE_URL=postgresql://postgres:...@db.<project-ref>.supabase.co:5432/postgres`
4. Run app:
   - `npm run dev`

## 2) Supabase Setup

1. Create a new Supabase project.
2. In SQL Editor, run migrations:
   - `supabase/migrations/202604180001_init.sql`
   - `supabase/migrations/202604180002_store_items_description.sql`
   - `supabase/migrations/202604180003_visual_feed_items.sql`
3. Run seed:
   - `supabase/seed.sql`
4. In Supabase Auth, create your admin user (email/password) by signing up once via `/admin/login` or dashboard.

Alternative one-shot setup:
- Run `supabase/full-setup.sql` in SQL Editor (schema + latest seed in one paste).

## 3) Make First User Admin

Run this SQL (replace email):

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

Optional editor role:

```sql
update public.profiles
set role = 'editor'
where email = 'editor@example.com';
```

## 4) Storage Setup

Migration creates:
- `media` bucket (public read)
- admin/editor-only upload/update/delete policies

Image path values are stored in table fields like `image_path`.

## 5) Vercel Deployment

1. Push this project to GitHub.
2. Import repo in Vercel.
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
4. Deploy.

## 6) Content Management Flow

1. Visit `/admin/login`
2. Sign in with admin/editor account
3. Go to `/admin/dashboard`
4. Use the left-side admin sections:
   - `Server` (Server IP + Discord URL)
   - `Visual Feed` (Home page visual feed card name/description/image)
   - `Ranks`
   - `Store` (Categories + Items, including Elite Kits)
   - `FAQ`
   - `Announcements`
5. Edit and manage:
   - Create records
   - Edit existing records
   - Reorder with Up/Down
   - Publish/Unpublish
   - Delete records
   - Upload media files

Changes appear on public pages immediately through Supabase.

## Notes

- No service role key is used on the client.
- Public pages only read `is_published = true` data.
- Write actions are protected by both route checks and RLS policies.
- Store/Rank `Buy Now` buttons fall back to `discord_url` from site settings when item/rank `cta_url` is empty or `#`.

# dakaitmc
