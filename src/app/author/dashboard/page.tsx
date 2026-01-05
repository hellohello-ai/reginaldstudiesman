import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AuthorDashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    redirect("/author/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", authData.user.id)
    .single();

  if (profile?.role !== "author") {
    redirect("/author/sign-in");
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, status, updated_at, slug")
    .eq("author_id", authData.user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            Author Wing
          </p>
          <h1 className="text-4xl font-semibold">
            Welcome, {profile?.display_name ?? "Author"}
          </h1>
          <p className="text-sm text-black/60">
            Draft new findings, revisit ongoing research, and tune editorial
            settings.
          </p>
        </div>
        <Link
          href="/author/editor"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80"
        >
          Start new draft
        </Link>
      </div>

      <div className="mt-10 grid gap-4">
        {(articles ?? []).map((article) => (
          <Link
            key={article.id}
            href={`/author/editor?id=${article.id}`}
            className="glass-card flex flex-col gap-2 rounded-3xl p-5 transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {article.title || "Untitled draft"}
              </h2>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                {article.status}
              </span>
            </div>
            <p className="text-xs text-black/50">
              Last updated {new Date(article.updated_at).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
