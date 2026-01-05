import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ArticleRecord } from "@/lib/types";

export default async function Home() {
  const supabase = createServerSupabaseClient();
  const { data: featured } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, cover_url, published_at, settings, profiles(display_name)"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="pattern-grid">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
              Unofficial Institute of Satirical Inquiry
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Reginald Studies catalogs the absurd truths we pretend are peer
              reviewed.
            </h1>
            <p className="text-lg text-black/70">
              We publish field reports, mock ethnographies, and lab notes from
              researchers who refuse to color inside the box. Expect ornate
              footnotes, dramatic charts, and a suspiciously large grant budget.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/articles"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80"
              >
                Read the latest studies
              </Link>
              <Link
                href="/author/sign-in"
                className="rounded-full border border-black/20 px-6 py-3 text-sm font-semibold transition hover:border-black/50"
              >
                Enter the Author Wing
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Research Departments",
                  value: "12",
                },
                {
                  label: "Active Field Agents",
                  value: "196",
                },
                {
                  label: "Hypotheses Debunked",
                  value: "3,902",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card rounded-2xl px-4 py-3"
                >
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass-card rounded-[32px] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-black/50">
                  Live Lab Feed
                </p>
                <span className="rounded-full bg-[var(--accent-2)] px-3 py-1 text-xs font-semibold text-white">
                  Streaming
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "On the migratory habits of coffee cups",
                    tone: "Beverage Anthropology",
                  },
                  {
                    title: "The politics of chair squeaks in open offices",
                    tone: "Acoustic Sociology",
                  },
                  {
                    title: "A quantitative approach to procrastination",
                    tone: "Temporal Studies",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-black/10 bg-white/70 p-4"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                      {item.tone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-6 hidden h-32 w-32 rounded-[36px] bg-[var(--accent-3)] shadow-lg md:block" />
            <div className="absolute -top-8 right-16 hidden h-16 w-16 rounded-full bg-[var(--accent-4)] shadow-lg md:block" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {["Editorial Board", "Field Methodology", "Impact Metrics"].map(
            (label, index) => (
              <div
                key={label}
                className="glass-card flex flex-col gap-4 rounded-3xl p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
                  0{index + 1}
                </span>
                <h3 className="text-2xl font-semibold">{label}</h3>
                <p className="text-sm text-black/60">
                  {label === "Editorial Board"
                    ? "Composed of retirees, interns, and a rotating houseplant."
                    : label === "Field Methodology"
                      ? "We observe, annotate, then deploy dramatic charts."
                      : "Measuring cultural influence in cups of tea per minute."}
                </p>
                <span className="text-sm font-semibold text-[var(--accent)]">
                  Learn more {"->"}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
              Featured Studies
            </p>
            <h2 className="text-3xl font-semibold">Today's most dignified satire</h2>
          </div>
          <Link
            href="/articles"
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold transition hover:border-black/40"
          >
            Browse all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {((featured ?? []) as ArticleRecord[]).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group glass-card flex h-full flex-col gap-4 rounded-3xl p-5 transition hover:-translate-y-1"
            >
              <div className="flex-1 space-y-3">
                <div
                  className="h-40 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${article.cover_url ??
                      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop"})`,
                  }}
                />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
                  {((Array.isArray(article.profiles)
                    ? article.profiles[0]?.display_name
                    : article.profiles?.display_name) ?? "Anonymous") +
                    " - " +
                    new Date(article.published_at ?? Date.now()).toLocaleDateString()}
                </span>
                <h3 className="text-xl font-semibold group-hover:text-[var(--accent)]">
                  {article.title}
                </h3>
                <p className="text-sm text-black/60">
                  {article.excerpt ?? "A field report awaiting its punchline."}
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--accent-2)]">
                Read the study {"->"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="grid gap-10 rounded-[36px] bg-[var(--accent)] p-10 text-white md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Author Program
            </p>
            <h2 className="text-3xl font-semibold">
              Bring your satirical research to life.
            </h2>
            <p className="text-sm text-white/80">
              Our author editor offers modular layouts, pull quotes, staged
              footnotes, and beautifully chaotic typography controls.
            </p>
          <Link
            href="/author/sign-in"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          >
            Apply to publish
          </Link>
          </div>
          <div className="space-y-4">
            {[
              "Layered hero treatments",
              "Annotation-ready footnotes",
              "Custom reading moods",
              "Built-in callouts and tables",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
