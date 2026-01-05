import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          Reader Access
        </p>
        <h1 className="text-4xl font-semibold">
          Log in to bookmark your favorite studies.
        </h1>
        <p className="text-sm text-black/60">
          Enjoy saved readings, your personal satire shelf, and member-only
          dispatches.
        </p>
        <Link
          href="/sign-up"
          className="text-sm font-semibold text-[var(--accent)]"
        >
          Need an account? Create one ->
        </Link>
      </div>
      <div className="flex-1">
        <AuthForm
          mode="sign-in"
          redirectTo="/articles"
          intentLabel="Reader Registry"
          helperCopy="Sign in to track absurd findings and curate your archive."
        />
      </div>
    </div>
  );
}
