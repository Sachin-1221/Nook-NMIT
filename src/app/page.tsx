import Link from "next/link";

const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Search any textbook",
    body: "Find by title, author, or ISBN. Autofilled from Open Library.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
    title: "Owner-only edits",
    body: "Only you can edit or delete your listings. Every action is verified on the server.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Live currency conversion",
    body: "See prices in INR, USD, or EUR — updated in real time.",
  },
];

const steps = [
  {
    n: "1",
    title: "Create an account",
    body: "Sign up with your college email in seconds.",
  },
  {
    n: "2",
    title: "List an item",
    body: "Add a title, price, photo, and category.",
  },
  {
    n: "3",
    title: "Meet and swap",
    body: "Pick a spot on campus. Done.",
  },
];

const demoListings = [
  { title: "Physics Vol 1", price: "₹450", status: "active" },
  { title: "Casio FX-991", price: "₹1,200", status: "active" },
  { title: "Lab coat size M", price: "₹300", status: "sold" },
  { title: "Mini fridge", price: "₹2,500", status: "active" },
];

function StatusPill({ status }: { status: string }) {
  const isSold = status === "sold";
  return (
    <span
      className={
        isSold
          ? "inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400"
          : "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {isSold ? "SOLD" : "Active"}
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-60" />

      {/* Hero glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[600px] w-[900px] -translate-x-1/2 bg-glow blur-3xl" />

      <div className="relative z-10">
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="text-lg font-bold tracking-tight">Nook</span>
              <span className="text-sm text-textMuted">NMIT</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/listings"
                className="text-textMuted transition-colors hover:text-textPrimary"
              >
                Browse
              </Link>
              <Link
                href="/dashboard/new"
                className="text-textMuted transition-colors hover:text-textPrimary"
              >
                Sell
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-accent px-4 py-2 font-medium text-white ring-1 ring-violet-500/50 transition-colors hover:bg-accentHover"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
          <span className="inline-block -rotate-2 rounded-full border border-violet-500/30 bg-accentSoft px-3 py-1 text-xs font-medium text-violet-300">
            Built for NMIT students
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            Buy and sell within your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              campus.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-textMuted sm:text-lg">
            Textbooks, electronics, lab gear, and dorm essentials — from
            students you can trust.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/listings"
              className="rounded-lg bg-accent px-6 py-3 font-medium text-white shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-colors hover:bg-accentHover"
            >
              Browse Listings
            </Link>
            <Link
              href="/dashboard/new"
              className="rounded-lg border border-white/10 px-6 py-3 font-medium text-textPrimary transition-colors hover:bg-white/5"
            >
              Start Selling
            </Link>
          </div>
          <p className="mt-6 text-xs text-textMuted">
            500+ listings · 200+ students · Verified campus emails
          </p>
        </section>

        {/* Feature cards */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accentSoft text-violet-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-textPrimary">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-textMuted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="text-3xl font-bold text-accent">{s.n}</div>
                <div className="mt-3 text-base font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-textMuted">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent listings */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Recent listings
            </h2>
            <Link
              href="/listings"
              className="text-sm text-textMuted transition-colors hover:text-textPrimary"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {demoListings.map((l) => (
              <div
                key={l.title}
                className="group overflow-hidden rounded-xl border border-white/10 bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]"
              >
                <div className="flex aspect-square items-center justify-center bg-white/5 text-textMuted">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-8 w-8 opacity-40"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
                <div className="p-3">
                  <div className="truncate text-sm font-medium">{l.title}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">{l.price}</span>
                    <StatusPill status={l.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust strip */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-10 md:grid-cols-4">
            {[
              { n: "500+", l: "Listings" },
              { n: "200+", l: "Students" },
              { n: "4", l: "Categories" },
              { n: "0%", l: "Fees" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-bold text-accent">{s.n}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-textMuted">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-textMuted md:flex-row">
            <span>Nook NMIT · Built for NMIT students</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-textPrimary">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-textPrimary">
                Terms
              </Link>
              <Link href="/refund" className="hover:text-textPrimary">
                Refund
              </Link>
            </div>
            <span>© 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
