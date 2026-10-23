import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTables = [
  "ranks",
  "rank_comparison_rows",
  "visual_feed_items",
  "store_categories",
  "store_items",
  "tags",
  "rules",
  "faqs",
  "announcements",
  "site_settings",
  "staff_members"
] as const;

type TableName = (typeof allowedTables)[number];

type Direction = "up" | "down";

function isTableName(value: string): value is TableName {
  return allowedTables.includes(value as TableName);
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

  const allowed = ["admin", "editor"].includes(String(profile?.role || ""));

  return {
    supabase,
    ok: allowed,
    error: allowed ? null : "Forbidden"
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    table?: string;
    id?: string;
    direction?: Direction;
  };

  if (!body.table || !body.id || !body.direction || !isTableName(body.table)) {
    return NextResponse.json({ error: "Invalid reorder payload." }, { status: 400 });
  }

  const { supabase, ok, error } = await assertAdmin();
  if (!supabase) {
    return NextResponse.json({ error: error || "Supabase is not configured." }, { status: 500 });
  }
  if (!ok) {
    return NextResponse.json({ error: error || "Forbidden" }, { status: 403 });
  }

  const table = body.table;
  const { data: current, error: currentError } = await supabase
    .from(table)
    .select("id, sort_order")
    .eq("id", body.id)
    .single();

  if (currentError || !current) {
    return NextResponse.json({ error: "Current row not found." }, { status: 404 });
  }

  const ascending = body.direction !== "up";

  const neighborQuery = supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending })
    .limit(1);

  const { data: neighborRows, error: neighborError } =
    body.direction === "up"
      ? await neighborQuery.lt("sort_order", current.sort_order)
      : await neighborQuery.gt("sort_order", current.sort_order);

  if (neighborError) {
    return NextResponse.json({ error: neighborError.message }, { status: 400 });
  }

  const neighbor = neighborRows?.[0];
  if (!neighbor) {
    const { data: sameRows } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });
    return NextResponse.json({ rows: sameRows || [] });
  }

  const { error: swapFirstError } = await supabase
    .from(table)
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);

  if (swapFirstError) {
    return NextResponse.json({ error: swapFirstError.message }, { status: 400 });
  }

  const { error: swapSecondError } = await supabase
    .from(table)
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);

  if (swapSecondError) {
    return NextResponse.json({ error: swapSecondError.message }, { status: 400 });
  }

  const { data: rows, error: listError } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true });

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 400 });
  }

  return NextResponse.json({ rows: rows || [] });
}
