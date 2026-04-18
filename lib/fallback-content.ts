import type {
  Announcement,
  Faq,
  Rank,
  RankComparisonRow,
  Rule,
  SiteSetting,
  StaffMember,
  StoreCategory,
  StoreItem,
  Tag,
  VisualFeedItem
} from "@/lib/types";

const createdAt = "2026-04-18T00:00:00.000Z";

const publishMeta = {
  is_published: true,
  created_at: createdAt,
  updated_at: createdAt
} as const;

export const fallbackSiteSettings: SiteSetting[] = [
  {
    id: "setting-server-ip",
    key: "server_ip",
    value_text: "play.dakaitmc.net",
    value_json: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "setting-discord-url",
    key: "discord_url",
    value_text: "https://discord.gg/dakaitmc",
    value_json: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "setting-primary-cta",
    key: "primary_cta",
    value_text: "Join Discord",
    value_json: null,
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "setting-store-url",
    key: "store_url",
    value_text: "/store",
    value_json: null,
    sort_order: 4,
    ...publishMeta
  }
];

export const fallbackRanks: Rank[] = [
  {
    id: "rank-free",
    code: "FREE",
    title: "FREE",
    subtitle: "FREE RANK",
    price_pkr: null,
    invite_requirement: "10 Discord Invites",
    chat_colour: null,
    homes: "2x",
    vaults: "✓",
    auction_slots: "2x",
    craft: false,
    recipe: false,
    disposal: false,
    near: false,
    hat: false,
    feed: false,
    invsee: false,
    enderchest: false,
    ptime: false,
    pweather: false,
    kit_name: "Free Kit",
    cta_label: "Join Discord",
    cta_url: "https://discord.gg/dakaitmc",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "rank-vip",
    code: "VIP",
    title: "VIP",
    subtitle: "VIP RANK",
    price_pkr: 150,
    invite_requirement: null,
    chat_colour: "Green",
    homes: "2x",
    vaults: "3x",
    auction_slots: "3x",
    craft: true,
    recipe: false,
    disposal: false,
    near: false,
    hat: false,
    feed: false,
    invsee: false,
    enderchest: false,
    ptime: false,
    pweather: true,
    kit_name: "VIP Kit",
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "rank-elite",
    code: "ELITE",
    title: "ELITE",
    subtitle: "ELITE RANK",
    price_pkr: 250,
    invite_requirement: null,
    chat_colour: "Purple &f",
    homes: "4x",
    vaults: "6x",
    auction_slots: "6x",
    craft: true,
    recipe: true,
    disposal: true,
    near: true,
    hat: true,
    feed: true,
    invsee: true,
    enderchest: false,
    ptime: false,
    pweather: true,
    kit_name: "Elite Kit",
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "rank-deadliest",
    code: "DEADLIEST",
    title: "DEADLIEST",
    subtitle: "DEADLIEST RANK",
    price_pkr: 350,
    invite_requirement: null,
    chat_colour: "Red",
    homes: "6x",
    vaults: "8x",
    auction_slots: "8x",
    craft: true,
    recipe: true,
    disposal: true,
    near: true,
    hat: true,
    feed: true,
    invsee: true,
    enderchest: true,
    ptime: false,
    pweather: true,
    kit_name: "Deadliest Kit",
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 4,
    ...publishMeta
  },
  {
    id: "rank-oblix",
    code: "OBLIX",
    title: "OBLIX",
    subtitle: "OBLIX RANK",
    price_pkr: 500,
    invite_requirement: null,
    chat_colour: "Blue",
    homes: "8x",
    vaults: "10x",
    auction_slots: "10x",
    craft: true,
    recipe: true,
    disposal: true,
    near: true,
    hat: true,
    feed: true,
    invsee: true,
    enderchest: true,
    ptime: true,
    pweather: true,
    kit_name: "Oblix Kit",
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 5,
    ...publishMeta
  }
];

export const fallbackRankComparisonRows: RankComparisonRow[] = [
  {
    id: "cmp-chat-colour",
    feature_name: "Chat Colour",
    free_value: "✗",
    vip_value: "✓ Green",
    elite_value: "✓ Purple &f",
    deadliest_value: "✓ Red",
    oblix_value: "✓ Blue",
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "cmp-homes",
    feature_name: "Homes",
    free_value: "✗",
    vip_value: "✓ 2x",
    elite_value: "✓ 4x",
    deadliest_value: "✓ 6x",
    oblix_value: "✓ 8x",
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "cmp-vaults",
    feature_name: "/vaults",
    free_value: "✗",
    vip_value: "✓ 3x",
    elite_value: "✓ 6x",
    deadliest_value: "✓ 8x",
    oblix_value: "✓ 10x",
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "cmp-auction-slots",
    feature_name: "Auction Slots",
    free_value: "✓ 2x",
    vip_value: "✓ 3x",
    elite_value: "✓ 6x",
    deadliest_value: "✓ 8x",
    oblix_value: "✓ 10x",
    sort_order: 4,
    ...publishMeta
  },
  {
    id: "cmp-craft",
    feature_name: "/craft",
    free_value: "✓",
    vip_value: "✓",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 5,
    ...publishMeta
  },
  {
    id: "cmp-recipe",
    feature_name: "/recipe",
    free_value: "✗",
    vip_value: "✓",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 6,
    ...publishMeta
  },
  {
    id: "cmp-disposal",
    feature_name: "/disposal",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 7,
    ...publishMeta
  },
  {
    id: "cmp-near",
    feature_name: "/near",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 8,
    ...publishMeta
  },
  {
    id: "cmp-hat",
    feature_name: "/hat",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 9,
    ...publishMeta
  },
  {
    id: "cmp-feed",
    feature_name: "/feed",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 10,
    ...publishMeta
  },
  {
    id: "cmp-invsee",
    feature_name: "/invsee",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 11,
    ...publishMeta
  },
  {
    id: "cmp-enderchest",
    feature_name: "/enderchest",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✓",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 12,
    ...publishMeta
  },
  {
    id: "cmp-ptime",
    feature_name: "/ptime",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✗",
    deadliest_value: "✓",
    oblix_value: "✓",
    sort_order: 13,
    ...publishMeta
  },
  {
    id: "cmp-pweather",
    feature_name: "/pweather",
    free_value: "✗",
    vip_value: "✗",
    elite_value: "✗",
    deadliest_value: "✗",
    oblix_value: "✓",
    sort_order: 14,
    ...publishMeta
  },
  {
    id: "cmp-kit",
    feature_name: "Kit",
    free_value: "✗",
    vip_value: "✓ VIP",
    elite_value: "✓ Elite",
    deadliest_value: "✓ Deadliest",
    oblix_value: "✓ Oblix",
    sort_order: 15,
    ...publishMeta
  },
  {
    id: "cmp-action",
    feature_name: "Action",
    free_value: "Join Discord",
    vip_value: "Buy Now",
    elite_value: "Buy Now",
    deadliest_value: "Buy Now",
    oblix_value: "Buy Now",
    sort_order: 16,
    ...publishMeta
  }
];

export const fallbackVisualFeedItems: VisualFeedItem[] = [
  {
    id: "visual-feed-1",
    title: "Outpost Skyline",
    subtitle: "Spawn Control",
    image_path: "/media/minecraft/dungeons-main.png",
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "visual-feed-2",
    title: "Raid District",
    subtitle: "Active Conflict",
    image_path: "/media/minecraft/dungeons-flames-nether.png",
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "visual-feed-3",
    title: "Portal Core",
    subtitle: "Transfer Hub",
    image_path: "/media/minecraft/dungeons-hidden-depths.png",
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "visual-feed-4",
    title: "Bounty Board",
    subtitle: "Wanted Feed",
    image_path: "/media/minecraft/dungeons-jungle-awakens.png",
    sort_order: 4,
    ...publishMeta
  },
  {
    id: "visual-feed-5",
    title: "Crate Vault",
    subtitle: "Premium Loot",
    image_path: "/media/minecraft/minecraft-nether-update.png",
    sort_order: 5,
    ...publishMeta
  },
  {
    id: "visual-feed-6",
    title: "Wasteland Grid",
    subtitle: "Frontline Sector",
    image_path: "/media/minecraft/minecraft-bedrock.png",
    sort_order: 6,
    ...publishMeta
  }
];

export const fallbackStoreCategories: StoreCategory[] = [
  {
    id: "cat-crate-keys",
    name: "Crate Keys",
    slug: "crate-keys",
    description: "Party, Elite, Matrix, and Oblix key bundles.",
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "cat-in-game-money",
    name: "In-Game Money",
    slug: "in-game-money",
    description: "Cash bundles to boost your progression.",
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "cat-heart-items",
    name: "Heart Items",
    slug: "heart-items",
    description: "Extra hearts for survival advantage.",
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "cat-elite-kits",
    name: "Elite Kits",
    slug: "elite-kits",
    description: "Complete kits with armor, tools, and resources.",
    sort_order: 4,
    ...publishMeta
  }
];

export const fallbackStoreItems: StoreItem[] = [
  {
    id: "item-party-3x",
    category_id: "cat-crate-keys",
    title: "PARTY (3x)",
    package_label: "Party",
    description: null,
    price_pkr: 50,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "item-elite-3x",
    category_id: "cat-crate-keys",
    title: "ELITE (3x)",
    package_label: "Elite",
    description: null,
    price_pkr: 200,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "item-matrix-3x",
    category_id: "cat-crate-keys",
    title: "MATRIX (3x)",
    package_label: "Matrix",
    description: null,
    price_pkr: 300,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "item-oblix-3x",
    category_id: "cat-crate-keys",
    title: "OBLIX (3x)",
    package_label: "Oblix",
    description: null,
    price_pkr: 400,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 4,
    ...publishMeta
  },
  {
    id: "item-cash-500k",
    category_id: "cat-in-game-money",
    title: "500K CASH",
    package_label: "Cash",
    description: null,
    price_pkr: 50,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "item-cash-1-5m",
    category_id: "cat-in-game-money",
    title: "1.5M CASH",
    package_label: "Cash",
    description: null,
    price_pkr: 100,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "item-cash-5m",
    category_id: "cat-in-game-money",
    title: "5M CASH",
    package_label: "Cash",
    description: null,
    price_pkr: 300,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "item-heart-1",
    category_id: "cat-heart-items",
    title: "1 HEART",
    package_label: "Heart",
    description: null,
    price_pkr: 50,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "item-heart-5",
    category_id: "cat-heart-items",
    title: "5 HEARTS",
    package_label: "Heart",
    description: null,
    price_pkr: 250,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "item-heart-10",
    category_id: "cat-heart-items",
    title: "10 HEARTS",
    package_label: "Heart",
    description: null,
    price_pkr: 500,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "item-vip-kit",
    category_id: "cat-elite-kits",
    title: "VIP KIT",
    package_label: "VIP KIT",
    description: "Complete VIP Kit Items\nArmor & Tools Set\nStarter Resources",
    price_pkr: 50,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "item-elite-kit",
    category_id: "cat-elite-kits",
    title: "ELITE KIT",
    package_label: "ELITE KIT",
    description: "Complete Elite Kit Items\nPremium Armor & Tools\nAdvanced Resources",
    price_pkr: 100,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "item-immortal-kit",
    category_id: "cat-elite-kits",
    title: "IMMORTAL KIT",
    package_label: "IMMORTAL KIT",
    description: "Complete Immortal Kit Items\nLegendary Armor & Tools\nRare Resources",
    price_pkr: 150,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  },
  {
    id: "item-oblix-kit",
    category_id: "cat-elite-kits",
    title: "OBLIX KIT",
    package_label: "OBLIX KIT",
    description: "Ultimate Oblix Kit Items\nGod-tier Armor & Tools\nExclusive Resources",
    price_pkr: 200,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 4,
    ...publishMeta
  }
];

export const fallbackTags: Tag[] = [
  {
    id: "tag-outlaw",
    name: "OUTLAW",
    rarity: "Epic",
    style: "Blood Red",
    description: "The wanted aura for feared fighters.",
    price_pkr: 150,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "tag-shadow",
    name: "SHADOW",
    rarity: "Rare",
    style: "Steel Gray",
    description: "Low profile, high danger.",
    price_pkr: 100,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "tag-bandit-king",
    name: "BANDIT KING",
    rarity: "Legendary",
    style: "Royal Gold",
    description: "For players who rule the wasteland.",
    price_pkr: 300,
    cta_label: "Buy Now",
    cta_url: "#",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  }
];

export const fallbackRules: Rule[] = [
  {
    id: "rule-1",
    title: "No Cheating or Exploits",
    body: "Using hacks, X-ray, dupes, or abuse of bugs results in instant punishment.",
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "rule-2",
    title: "Respect All Players",
    body: "Trash talk is fine, harassment and hate speech are not tolerated.",
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "rule-3",
    title: "No Unauthorized Real-Money Trading",
    body: "All purchases must happen through official Dakait MC channels.",
    sort_order: 3,
    ...publishMeta
  }
];

export const fallbackFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "How do I join Dakait MC?",
    answer: "Launch Minecraft, add the server IP from the homepage, and jump in.",
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "faq-2",
    question: "Where does Buy Now take me?",
    answer: "Buy Now opens the Discord server link configured in admin settings.",
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "faq-3",
    question: "Can I upgrade to a higher rank later?",
    answer: "Yes. You can move up anytime by purchasing a higher rank package.",
    sort_order: 3,
    ...publishMeta
  }
];

export const fallbackAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Season Wipe: Dustfall",
    body: "Fresh map, reset economy, and new outlaw events go live this weekend.",
    image_path: null,
    published_at: "2026-04-20T18:00:00.000Z",
    sort_order: 1,
    ...publishMeta
  }
];

export const fallbackStaffMembers: StaffMember[] = [
  {
    id: "staff-1",
    ign: "SheriffZ",
    role: "Owner",
    bio: "Runs the server economy and event roadmap.",
    image_path: null,
    sort_order: 1,
    ...publishMeta
  },
  {
    id: "staff-2",
    ign: "DustMarshal",
    role: "Admin",
    bio: "Handles moderation and anti-cheat control.",
    image_path: null,
    sort_order: 2,
    ...publishMeta
  },
  {
    id: "staff-3",
    ign: "CanyonFox",
    role: "Moderator",
    bio: "Keeps community channels active and clean.",
    image_path: null,
    sort_order: 3,
    ...publishMeta
  }
];
