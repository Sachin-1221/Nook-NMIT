"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; name: string; email: string } | null;

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
    setSigningOut(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-lg font-bold tracking-tight">Nook</span>
          <span className="text-sm text-textMuted">NMIT</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/listings"
            className="rounded-md px-3 py-1.5 text-textMuted transition-colors hover:bg-white/5 hover:text-textPrimary"
          >
            Browse
          </Link>
          <Link
            href="/dashboard/new"
            className="rounded-md px-3 py-1.5 text-textMuted transition-colors hover:bg-white/5 hover:text-textPrimary"
          >
            Sell
          </Link>
          {loading ? (
            <div className="h-8 w-40 animate-pulse rounded-md bg-white/5" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-textMuted transition-colors hover:bg-white/5 hover:text-textPrimary"
              >
                My listings
              </Link>

              <div className="ml-3 flex items-center gap-2 border-l border-white/10 pl-3">
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-textPrimary sm:inline-block">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-textMuted transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  <LogoutIcon />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-lg bg-accent px-4 py-2 font-medium text-white ring-1 ring-violet-500/50 transition-colors hover:bg-accentHover"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
