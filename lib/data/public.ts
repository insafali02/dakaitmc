import { unstable_noStore as noStore } from "next/cache";

import {
  fallbackAnnouncements,
  fallbackFaqs,
  fallbackVisualFeedItems,
  fallbackRankComparisonRows,
  fallbackRanks,
  fallbackRules,
  fallbackSiteSettings,
  fallbackStaffMembers,
  fallbackStoreCategories,
  fallbackStoreItems,
  fallbackTags
} from "@/lib/fallback-content";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
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

async function getPublishedRows<T>(table: string, fallback: T[]) {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return fallback;
  return data as T[];
}

export async function getSiteSettings() {
  noStore();
  return getPublishedRows<SiteSetting>("site_settings", fallbackSiteSettings);
}

export async function getRanks() {
  noStore();
  return getPublishedRows<Rank>("ranks", fallbackRanks);
}

export async function getRankComparisonRows() {
  noStore();
  return getPublishedRows<RankComparisonRow>(
    "rank_comparison_rows",
    fallbackRankComparisonRows
  );
}

export async function getVisualFeedItems() {
  noStore();
  return getPublishedRows<VisualFeedItem>("visual_feed_items", fallbackVisualFeedItems);
}

export async function getStoreCategories() {
  noStore();
  return getPublishedRows<StoreCategory>(
    "store_categories",
    fallbackStoreCategories
  );
}

export async function getStoreItems() {
  noStore();
  return getPublishedRows<StoreItem>("store_items", fallbackStoreItems);
}

export async function getTags() {
  noStore();
  return getPublishedRows<Tag>("tags", fallbackTags);
}

export async function getRules() {
  noStore();
  return getPublishedRows<Rule>("rules", fallbackRules);
}

export async function getFaqs() {
  noStore();
  return getPublishedRows<Faq>("faqs", fallbackFaqs);
}

export async function getAnnouncements() {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return fallbackAnnouncements;

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) return fallbackAnnouncements;
  return data as Announcement[];
}

export async function getStaffMembers() {
  noStore();
  return getPublishedRows<StaffMember>("staff_members", fallbackStaffMembers);
}

export async function getHomepageData() {
  const [siteSettings, ranks, announcements, tags] = await Promise.all([
    getSiteSettings(),
    getRanks(),
    getAnnouncements(),
    getTags()
  ]);

  return {
    siteSettings,
    ranks,
    announcements,
    tags
  };
}
