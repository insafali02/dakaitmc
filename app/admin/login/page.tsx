import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function AdminLoginPage() {
  if (!hasSupabaseEnv) {
    return (
      <div className="section-shell py-16">
        <div className="metal-panel rounded-md p-6">
          <h1 className="font-heading text-4xl uppercase tracking-[0.12em] text-sand">
            Missing Supabase Environment
          </h1>
          <p className="mt-3 text-sm text-sand/80">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and either{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> or{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in <code>.env.local</code> before
            using the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="section-shell py-16">
      <AdminLoginForm />
    </div>
  );
}
