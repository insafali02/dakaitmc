import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const tableColumns = {
  ranks: [
    "code",
    "title",
    "subtitle",
    "price_pkr",
    "invite_requirement",
    "chat_colour",
    "homes",
    "vaults",
    "auction_slots",
    "craft",
    "recipe",
    "disposal",
    "near",
    "hat",
    "feed",
    "invsee",
    "enderchest",
    "ptime",
    "pweather",
    "kit_name",
    "cta_label",
    "cta_url",
    "image_path",
    "is_published"
  ],
  rank_comparison_rows: [
    "feature_name",
    "free_value",
    "vip_value",
    "elite_value",
    "deadliest_value",
    "oblix_value",
    "is_published"
  ],
  visual_feed_items: ["title", "subtitle", "image_path", "is_published"],
  store_categories: ["name", "slug", "description", "is_published"],
  store_items: [
    "category_id",
    "title",
    "package_label",
    "description",
    "price_pkr",
    "cta_label",
    "cta_url",
    "image_path",
    "is_published"
  ],
  tags: [
    "name",
    "rarity",
    "style",
    "description",
    "price_pkr",
    "cta_label",
    "cta_url",
    "image_path",
    "is_published"
  ],
  rules: ["title", "body", "is_published"],
  faqs: ["question", "answer", "is_published"],
  announcements: ["title", "body", "image_path", "published_at", "is_published"],
  site_settings: ["key", "value_text", "value_json", "is_published"],
  staff_members: ["ign", "role", "bio", "image_path", "is_published"]
} as const;

type TableName = keyof typeof tableColumns;

function normalizePayload(payload: Record<string, unknown>, table: TableName) {
  const allowed = new Set<string>(tableColumns[table] as readonly string[]);
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowed.has(key))
  ) as Record<string, unknown>;
}

async function assertAdmin() {
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return {
      supabase: null,
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Supabase environment variables are missing."
    };
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { supabase, ok: false, error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowed = ["admin", "editor"];
  const ok = allowed.includes(String(profile?.role || ""));

  return { supabase, ok, error: ok ? null : "Forbidden" };
}

async function listRows(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, table: TableName) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function nextSortOrder(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: TableName
) {
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  if (error) return 1;
  return (data?.[0]?.sort_order || 0) + 1;
}

function isTableName(value: string): value is TableName {
  return value in tableColumns;
}

type RouteContext = {
  params: Promise<{ table: string }>;
};

async function resolveTable(context: RouteContext) {
  const params = await context.params;
  return params.table;
}

export async function POST(request: Request, context: RouteContext) {
  const tableValue = await resolveTable(context);
  if (!isTableName(tableValue)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const { supabase, ok, error: authError } = await assertAdmin();
  if (!supabase) {
    return NextResponse.json({ error: authError || "Supabase is not configured." }, { status: 500 });
  }
  if (!ok) {
    return NextResponse.json({ error: authError || "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { payload?: Record<string, unknown> };
  const payload = normalizePayload(body.payload || {}, tableValue);
  const sort_order = await nextSortOrder(supabase, tableValue);

  const { error: insertError } = await supabase.from(tableValue).insert({
    ...payload,
    sort_order,
    is_published: payload.is_published ?? true
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  const rows = await listRows(supabase, tableValue);
  return NextResponse.json({ rows });
}

export async function PATCH(request: Request, context: RouteContext) {
  const tableValue = await resolveTable(context);
  if (!isTableName(tableValue)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const { supabase, ok, error: authError } = await assertAdmin();
  if (!supabase) {
    return NextResponse.json({ error: authError || "Supabase is not configured." }, { status: 500 });
  }
  if (!ok) {
    return NextResponse.json({ error: authError || "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: string;
    payload?: Record<string, unknown>;
  };

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const payload = normalizePayload(body.payload || {}, tableValue);
  const { error: updateError } = await supabase.from(tableValue).update(payload).eq("id", body.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const rows = await listRows(supabase, tableValue);
  return NextResponse.json({ rows });
}

export async function DELETE(request: Request, context: RouteContext) {
  const tableValue = await resolveTable(context);
  if (!isTableName(tableValue)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const { supabase, ok, error: authError } = await assertAdmin();
  if (!supabase) {
    return NextResponse.json({ error: authError || "Supabase is not configured." }, { status: 500 });
  }
  if (!ok) {
    return NextResponse.json({ error: authError || "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error: deleteError } = await supabase.from(tableValue).delete().eq("id", body.id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  const rows = await listRows(supabase, tableValue);
  return NextResponse.json({ rows });
}
