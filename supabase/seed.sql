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
