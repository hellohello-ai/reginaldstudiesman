import ArticleCard from "@/components/ArticleCard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ArticleRecord } from "@/lib/types";

export default async function ArticlesPage() {
  const supabase = createServerSupabaseClient();
  const { data: articles } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, cover_url, published_at, status, settings, tags, profiles(display_name)"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            Archive
          </p>
          <h1 className="text-4xl font-semibold">Field Reports & Findings</h1>
          <p className="max-w-2xl text-sm text-black/60">
            Browse the full Reginald index of research notes, ethnographies, and
            quietly controversial think pieces.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            "Behavioral Mythology",
            "Temporal Studies",
            "Snack Science",
            "Commute Anthropology",
          ].map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-black/15 px-4 py-2 font-semibold"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {(articles as ArticleRecord[] | null)?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
