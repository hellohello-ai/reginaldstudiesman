import AccountPanel from "@/components/AccountPanel";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="grid gap-8 md:grid-cols-[1fr_0.7fr]">
        <AccountPanel />
        <div className="space-y-6">
          <div className="glass-card rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
              Membership Status
            </p>
            <h3 className="text-2xl font-semibold">Active observer</h3>
            <p className="text-sm text-black/60">
              You are subscribed to the weekly satirical digest and eligible for
              favorite tracking.
            </p>
          </div>
          <div className="glass-card rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
              Research Library
            </p>
            <p className="text-sm text-black/60">
              Save favorites to build a private shelf of questionable findings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
