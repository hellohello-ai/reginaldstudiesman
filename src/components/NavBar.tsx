import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-black/10 bg-[rgba(255,247,237,0.92)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
            RS
          </div>
          <div>
            <p className="text-lg font-semibold">Reginald Studies</p>
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Institute of Unfounded Certainty
            </p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <Link href="/articles" className="hover:text-black/70">
            Articles
          </Link>
          <Link href="/author/dashboard" className="hover:text-black/70">
            Author Wing
          </Link>
          <Link href="/account" className="hover:text-black/70">
            Reader Lab
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <AuthStatus />
        </div>
      </div>
    </nav>
  );
}
