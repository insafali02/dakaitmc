"use client";

import { createBrowserClient } from "@supabase/ssr";

import { env, requireSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  requireSupabaseEnv();

  return createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
}
