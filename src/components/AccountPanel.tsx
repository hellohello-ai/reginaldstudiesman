"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  role: string | null;
};

export default function AccountPanel() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/sign-in");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, bio, role")
        .eq("id", authData.user.id)
        .single();

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
      }
    };

    loadProfile();
  }, [router, supabase]);

  const saveProfile = async () => {
    if (!profile) {
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio })
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? error.message : "Profile updated.");
  };

  const requestAuthor = async () => {
    if (!profile) {
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: "author" })
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? error.message : "Author access granted.");
    setProfile((prev) => (prev ? { ...prev, role: "author" } : prev));
  };

  if (!profile) {
    return (
      <div className="rounded-[32px] border border-black/10 bg-white/70 p-6">
        Loading account profile...
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[32px] p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          Reader Profile
        </p>
        <h2 className="text-2xl font-semibold">Your Institute dossier</h2>
        <p className="text-sm text-black/60">
          Customize your public researcher identity and request author access.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">
          Display name
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
          />
        </label>
        <label className="block text-sm font-semibold">
          Bio
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveProfile}
          disabled={saving}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        <button
          type="button"
          onClick={requestAuthor}
          disabled={saving || profile.role === "author"}
          className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold transition hover:border-black/40 disabled:opacity-60"
        >
          {profile.role === "author" ? "Author access active" : "Request author"}
        </button>
      </div>

      {message ? (
        <p className="mt-4 text-xs text-black/60">{message}</p>
      ) : null}
    </div>
  );
}
