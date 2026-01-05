import type { CSSProperties } from "react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ArticleRecord } from "@/lib/types";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createServerSupabaseClient();
  const { data: article } = await supabase
    .from("articles")
    .select(
      "id, title, slug, subtitle, excerpt, cover_url, content_html, published_at, settings, profiles(display_name)"
    )
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!article) {
    notFound();
  }

  const typedArticle = article as ArticleRecord;
  const safeHtml = DOMPurify.sanitize(typedArticle.content_html ?? "");
  const settings = typedArticle.settings ?? {};
  const readingLabel =
    settings.readingPace === "calm"
      ? "Calm"
      : settings.readingPace === "chaotic"
        ? "Chaotic"
        : "Studious";

  const authorName = Array.isArray(typedArticle.profiles)
    ? typedArticle.profiles[0]?.display_name
    : typedArticle.profiles?.display_name;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16">
      <div className="flex flex-col gap-6">
        <Link href="/articles" className="text-sm font-semibold text-black/60">
          {"<-"} Back to studies
        </Link>
        <div
          className="rounded-[36px] bg-white/70 p-8 shadow-[var(--shadow)]"
          style={
            {
              "--accent": settings.accentColor ?? "var(--accent)",
            } as CSSProperties
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
                {settings.kicker ?? "Reginald Field Report"}
              </p>
              <h1 className="text-4xl font-semibold">{typedArticle.title}</h1>
              {typedArticle.subtitle ? (
                <p className="text-lg text-black/70">
                  {typedArticle.subtitle}
                </p>
              ) : null}
              <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                {(authorName ?? "Anonymous") +
                  " - " +
                  new Date(
                    typedArticle.published_at ?? Date.now()
                  ).toLocaleDateString()}
              </p>
            </div>
            <FavoriteButton articleId={typedArticle.id} />
          </div>
          <div
            className="mt-6 h-72 rounded-[28px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${typedArticle.cover_url ??
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop"})`,
            }}
          />
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_220px]">
            <article
              className={`article-body space-y-6 ${
                settings.showDropCap ? "drop-cap" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
            <aside className="space-y-4">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
                  Reading Mood
                </p>
                <p className="text-lg font-semibold">{readingLabel}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
                  Accent Tone
                </p>
                <div
                  className="mt-2 h-10 w-full rounded-full"
                  style={{
                    background: settings.accentColor ?? "var(--accent)",
                  }}
                />
              </div>
              {settings.pullQuote ? (
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm italic">
                  "{settings.pullQuote}"
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
