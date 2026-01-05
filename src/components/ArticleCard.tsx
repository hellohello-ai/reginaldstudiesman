import Link from "next/link";
import type { ArticleRecord } from "@/lib/types";

type ArticleCardProps = {
  article: ArticleRecord;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group glass-card flex h-full flex-col gap-4 rounded-3xl p-5 transition hover:-translate-y-1"
    >
      <div
        className="h-44 rounded-2xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${article.cover_url ??
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"})`,
        }}
      />
      <div className="flex-1 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          {(article.profiles?.display_name ?? "Anonymous") +
            " - " +
            new Date(article.published_at ?? Date.now()).toLocaleDateString()}
        </span>
        <h3 className="text-xl font-semibold group-hover:text-[var(--accent)]">
          {article.title}
        </h3>
        <p className="text-sm text-black/60">
          {article.excerpt ?? "A report currently under scientific review."}
        </p>
      </div>
      <span className="text-sm font-semibold text-[var(--accent-2)]">
        Read study {"->"}
      </span>
    </Link>
  );
}
