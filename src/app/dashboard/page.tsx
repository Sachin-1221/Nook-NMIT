"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { StatusPill } from "@/components/ListingCard";

type Listing = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: "ACTIVE" | "SOLD";
  category: string;
  seller: { id: string; name: string };
};

type Filter = "ALL" | "ACTIVE" | "SOLD";

export default function DashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const meRes = await fetch("/api/auth/me", { cache: "no-store" });
    const me = await meRes.json();
    if (!me.user) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/listings?sellerId=${me.user.id}&sort=newest`);
    const data = await res.json();
    setListings(data.listings ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleSold(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/listings/${id}/sold`, { method: "PATCH" });
    if (res.ok) {
      const d = await res.json();
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: d.listing.status } : l))
      );
    }
    setBusyId(null);
  }

  async function deleteListing(id: string) {
    if (!confirm("Delete this listing permanently?")) return;
    setBusyId(id);
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
    setBusyId(null);
  }

  const shown =
    filter === "ALL" ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My listings</h1>
              <p className="mt-1 text-sm text-textMuted">
                Manage everything you have posted on Nook.
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-colors hover:bg-accentHover"
            >
              + New listing
            </Link>
          </div>

          <div className="mb-6 flex gap-2">
            {(["ALL", "ACTIVE", "SOLD"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "rounded-full border border-accent bg-accentSoft px-4 py-1.5 text-xs font-medium text-violet-300"
                    : "rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-textMuted transition-colors hover:border-white/20 hover:text-textPrimary"
                }
              >
                {f === "ALL" ? "All" : f === "ACTIVE" ? "Active" : "Sold"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface/50 py-20 text-center">
              <h3 className="text-base font-semibold">
                {listings.length === 0
                  ? "You have not listed anything yet"
                  : `No ${filter.toLowerCase()} listings`}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-textMuted">
                {listings.length === 0
                  ? "Post your first item and start earning from campus."
                  : "Try a different filter above."}
              </p>
              {listings.length === 0 && (
                <Link
                  href="/dashboard/new"
                  className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentHover"
                >
                  Create listing
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {shown.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface p-4 md:flex-row md:items-center"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={l.imageUrl}
                      alt={l.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/listings/${l.id}`}
                      className="truncate text-sm font-semibold hover:text-accent"
                    >
                      {l.title}
                    </Link>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-textMuted">
                      <span className="font-semibold text-textPrimary">
                        ₹{l.price}
                      </span>
                      <span>{l.category}</span>
                      <StatusPill status={l.status} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/dashboard/${l.id}/edit`}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/5"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => toggleSold(l.id)}
                      disabled={busyId === l.id}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
                    >
                      {l.status === "SOLD" ? "Relist" : "Mark sold"}
                    </button>
                    <button
                      onClick={() => deleteListing(l.id)}
                      disabled={busyId === l.id}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
