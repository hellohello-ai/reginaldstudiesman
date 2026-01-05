"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AuthStatus() {
  const supabase = createBrowserSupabaseClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setEmail(data.user?.email ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!email) {
    return (
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Link
          href="/sign-in"
          className="rounded-full border border-black/15 px-4 py-2 transition hover:border-black/40"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-full bg-black px-4 py-2 text-white transition hover:-translate-y-0.5 hover:bg-black/80"
        >
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <Link href="/account" className="rounded-full px-4 py-2 hover:underline">
        {email}
      </Link>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="rounded-full border border-black/15 px-4 py-2 transition hover:border-black/40"
      >
        Sign out
      </button>
    </div>
  );
}
