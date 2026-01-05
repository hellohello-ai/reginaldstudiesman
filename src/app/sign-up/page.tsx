import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          New Member Intake
        </p>
        <h1 className="text-4xl font-semibold">
          Become a fully credentialed Reginald observer.
        </h1>
        <p className="text-sm text-black/60">
          Unlock private commentary, save favorites, and apply for author access.
        </p>
        <Link
          href="/sign-in"
          className="text-sm font-semibold text-[var(--accent)]"
        >
          Already registered? Sign in ->
        </Link>
      </div>
      <div className="flex-1">
        <AuthForm
          mode="sign-up"
          redirectTo="/articles"
          intentLabel="Reader Enrollment"
          helperCopy="We only ask for an email and a taste for satire."
        />
      </div>
    </div>
  );
}
