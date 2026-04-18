export type Role = "admin" | "editor" | "player";

export type Publishable = {
  id: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: Role;
  created_at: string;
};

export type SiteSetting = Publishable & {
  key: string;
  value_text: string | null;
  value_json: Record<string, unknown> | null;
};

export type Rank = Publishable & {
  code: "FREE" | "VIP" | "ELITE" | "DEADLIEST" | "OBLIX" | string;
  title: string;
  subtitle: string | null;
  price_pkr: number | null;
  invite_requirement: string | null;
  chat_colour: string | null;
  homes: string | null;
  vaults: string | null;
  auction_slots: string | null;
  craft: boolean;
  recipe: boolean;
  disposal: boolean;
  near: boolean;
  hat: boolean;
  feed: boolean;
  invsee: boolean;
  enderchest: boolean;
  ptime: boolean;
  pweather: boolean;
  kit_name: string | null;
  cta_label: string;
  cta_url: string | null;
  image_path: string | null;
};

export type RankComparisonRow = Publishable & {
  feature_name: string;
  free_value: string;
  vip_value: string;
  elite_value: string;
  deadliest_value: string;
  oblix_value: string;
};

export type VisualFeedItem = Publishable & {
  title: string;
  subtitle: string | null;
  image_path: string | null;
};

export type StoreCategory = Publishable & {
  name: string;
  slug: string;
  description: string | null;
};

export type StoreItem = Publishable & {
  category_id: string;
  title: string;
  package_label: string | null;
  description: string | null;
  price_pkr: number;
  cta_label: string;
  cta_url: string | null;
  image_path: string | null;
};

export type Tag = Publishable & {
  name: string;
  rarity: string;
  style: string;
  description: string | null;
  price_pkr: number | null;
  cta_label: string;
  cta_url: string | null;
  image_path: string | null;
};

export type Rule = Publishable & {
  title: string;
  body: string;
};

export type Faq = Publishable & {
  question: string;
  answer: string;
};

export type Announcement = Publishable & {
  title: string;
  body: string;
  image_path: string | null;
  published_at: string | null;
};

export type StaffMember = Publishable & {
  ign: string;
  role: string;
  bio: string | null;
  image_path: string | null;
};

export type DashboardPayload = {
  ranks: Rank[];
  rankComparisonRows: RankComparisonRow[];
  visualFeedItems: VisualFeedItem[];
  storeCategories: StoreCategory[];
  storeItems: StoreItem[];
  tags: Tag[];
  rules: Rule[];
  faqs: Faq[];
  announcements: Announcement[];
  siteSettings: SiteSetting[];
  staffMembers: StaffMember[];
};
