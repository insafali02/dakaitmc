import { createClient } from "@supabase/supabase-js";

import { env, hasSupabaseEnv } from "@/lib/supabase/env";

export function createPublicSupabaseClient() {
  if (!hasSupabaseEnv || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}
