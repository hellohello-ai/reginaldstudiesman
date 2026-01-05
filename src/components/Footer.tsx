export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[rgba(255,247,237,0.92)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">Reginald Studies</p>
          <p className="text-sm text-black/60">
            Satire, sourced from entirely fictional research grants.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-semibold">
          <span className="rounded-full bg-black px-4 py-2 text-white">
            Now accepting absurd hypotheses
          </span>
          <span className="rounded-full border border-black/10 px-4 py-2">
            97% peer reviewed by pigeons
          </span>
          <span className="rounded-full border border-black/10 px-4 py-2">
            Publishing since yesterday
          </span>
        </div>
      </div>
    </footer>
  );
}
