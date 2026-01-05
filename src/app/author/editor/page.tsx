import { redirect } from "next/navigation";
import AuthorEditor from "@/components/AuthorEditor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AuthorEditorPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    redirect("/author/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profile?.role !== "author") {
    redirect("/author/sign-in");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          Editorial Console
        </p>
        <h1 className="text-4xl font-semibold">Compose a new field report</h1>
        <p className="text-sm text-black/60">
          Format with callouts, tables, annotations, and stylish academic flair.
        </p>
      </div>
      <AuthorEditor articleId={searchParams?.id ?? null} />
    </div>
  );
}
