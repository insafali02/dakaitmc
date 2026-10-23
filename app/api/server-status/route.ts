import { NextResponse } from "next/server";

import { fetchJavaServerStatus } from "@/lib/server-status";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

const DEFAULT_HOST = "dakaitmc.fun";

async function resolveServerHostFromSettings() {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return DEFAULT_HOST;

  const { data, error } = await supabase
    .from("site_settings")
    .select("value_text")
    .eq("key", "server_ip")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (error) return DEFAULT_HOST;

  const value = data?.[0]?.value_text;
  if (typeof value !== "string") return DEFAULT_HOST;

  const trimmed = value.trim();
  return trimmed || DEFAULT_HOST;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hostParam = searchParams.get("host");
  const host = hostParam?.trim() || (await resolveServerHostFromSettings());

  const status = await fetchJavaServerStatus(host);
  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
