import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function AuthorSignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          Author Wing
        </p>
        <h1 className="text-4xl font-semibold">
          Sign in to draft, edit, and publish new studies.
        </h1>
        <p className="text-sm text-black/60">
          Author access is granted in your account settings once you pledge to
          submit at least one wildly convincing footnote.
        </p>
        <Link
          href="/account"
          className="text-sm font-semibold text-[var(--accent)]"
        >
          Request author access {"->"}
        </Link>
      </div>
      <div className="flex-1">
        <AuthForm
          mode="sign-in"
          redirectTo="/author/dashboard"
          intentLabel="Author Credentials"
          helperCopy="Enter the Author Wing to shape narrative experiments."
        />
      </div>
    </div>
  );
}
