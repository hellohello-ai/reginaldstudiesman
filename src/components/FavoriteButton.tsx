"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type FavoriteButtonProps = {
  articleId: string;
};

export default function FavoriteButton({ articleId }: FavoriteButtonProps) {
  const supabase = createBrowserSupabaseClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorite = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      const [{ count }, { data: favoriteData }] = await Promise.all([
        supabase
          .from("favorites")
          .select("id", { count: "exact", head: true })
          .eq("article_id", articleId),
        user
          ? supabase
              .from("favorites")
              .select("id")
              .eq("article_id", articleId)
              .eq("user_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      setCount(count ?? 0);
      setIsFavorite(Boolean(favoriteData));
      setLoading(false);
    };

    loadFavorite();
  }, [articleId, supabase]);

  const toggleFavorite = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.location.href = "/sign-in";
      return;
    }

    setLoading(true);
    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", data.user.id);
      setIsFavorite(false);
      setCount((prev) => Math.max(prev - 1, 0));
    } else {
      await supabase
        .from("favorites")
        .insert({ article_id: articleId, user_id: data.user.id });
      setIsFavorite(true);
      setCount((prev) => prev + 1);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        isFavorite
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-black/15 text-black hover:border-black/40"
      }`}
    >
      {isFavorite ? "Favorited" : "Favorite"} - {count}
    </button>
  );
}
