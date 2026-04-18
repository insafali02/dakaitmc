import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardPayload, Role } from "@/lib/types";

type AdminRole = "admin" | "editor";

async function getUserRole(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return (data?.role as Role | undefined) ?? "player";
}

export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const role = await getUserRole(user.id);
  const allowedRoles: AdminRole[] = ["admin", "editor"];

  if (!allowedRoles.includes(role as AdminRole)) {
    redirect("/");
  }

  return { supabase, user, role };
}

async function getTableRows<T>(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string
) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as T[];
}

export async function getDashboardData(): Promise<DashboardPayload> {
  const { supabase } = await requireAdminSession();

  const [
    ranks,
    rankComparisonRows,
    storeCategories,
    storeItems,
    tags,
    rules,
    faqs,
    announcements,
    siteSettings,
    staffMembers,
    visualFeedItems
  ] = await Promise.all([
    getTableRows(supabase, "ranks"),
    getTableRows(supabase, "rank_comparison_rows"),
    getTableRows(supabase, "store_categories"),
    getTableRows(supabase, "store_items"),
    getTableRows(supabase, "tags"),
    getTableRows(supabase, "rules"),
    getTableRows(supabase, "faqs"),
    getTableRows(supabase, "announcements"),
    getTableRows(supabase, "site_settings"),
    getTableRows(supabase, "staff_members"),
    getTableRows(supabase, "visual_feed_items")
  ]);

  return {
    ranks,
    rankComparisonRows,
    storeCategories,
    storeItems,
    tags,
    rules,
    faqs,
    announcements,
    siteSettings,
    staffMembers,
    visualFeedItems
  } as DashboardPayload;
}
