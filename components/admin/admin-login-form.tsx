"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not connect to Supabase. Check your environment variables."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="metal-panel mx-auto max-w-md rounded-md p-6">
      <h1 className="font-heading text-4xl uppercase tracking-[0.12em] text-sand">Admin Login</h1>
      <p className="mt-2 text-sm text-sand/75">Sign in with your Supabase account credentials.</p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-sand/60">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-sm border border-white/20 bg-black/25 px-3 py-2 text-white outline-none transition focus:border-ember"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-sand/60">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-sm border border-white/20 bg-black/25 px-3 py-2 text-white outline-none transition focus:border-ember"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3 rounded-sm border border-rose-400/35 bg-rose-950/25 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand transition hover:bg-ember/35 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Access Admin"}
      </button>
    </form>
  );
}
