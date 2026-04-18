import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getDashboardData } from "@/lib/data/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
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
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> before opening the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const data = await getDashboardData();

  async function signOutAction() {
    "use server";
    const client = await createSupabaseServerClient();
    await client.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <>
      <div className="section-shell mt-6 flex justify-end">
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-sm border border-white/30 px-3 py-2 text-xs uppercase tracking-[0.12em] text-sand transition hover:border-sand hover:bg-white/10"
          >
            Sign Out
          </button>
        </form>
      </div>
      <AdminDashboard initialData={data} userEmail={user.email || "unknown"} />
    </>
  );
}
