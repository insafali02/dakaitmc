import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env, requireSupabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  requireSupabaseEnv();

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        } catch {
          // Setting cookies can fail in Server Components; middleware refresh handles that flow.
        }
      }
    }
  });
}
