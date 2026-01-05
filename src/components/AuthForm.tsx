"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  redirectTo: string;
  intentLabel?: string;
  helperCopy?: string;
};

export default function AuthForm({
  mode,
  redirectTo,
  intentLabel,
  helperCopy,
}: AuthFormProps) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "sign-up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        router.push(redirectTo);
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card w-full rounded-[32px] p-8"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          {intentLabel ?? "Reginald Access"}
        </p>
        <h1 className="text-3xl font-semibold">
          {mode === "sign-up" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-black/60">
          {helperCopy ??
            "Credentials are stored in the Department of Mildly Guarded Secrets."}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
          />
        </label>
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-xs text-black/60">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80"
      >
        {loading
          ? "Working on it..."
          : mode === "sign-up"
            ? "Create account"
            : "Sign in"}
      </button>
    </form>
  );
}
