"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ListingCard, { Listing } from "@/components/ListingCard";

const CATEGORIES = [
  "All",           // ← only in listings/page.tsx
  "Textbooks",
  "Electronics",
  "Lab gear",
  "Dorm",
  "Sports",
  "Furniture",
  "Clothing",
  "Stationery",
  "Cycles",
  "Musical",
  "Other",
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category && category !== "All") params.set("category", category);
        if (sort) params.set("sort", sort);

        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        if (!cancelled) setListings(data.listings);
      } catch (e: unknown) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, sort]);

  const skeleton = useMemo(
    () => (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-white/10 bg-surface"
          >
            <div className="aspect-square animate-pulse bg-white/5" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Browse listings</h1>
            <p className="mt-1 text-sm text-textMuted">
              {loading
                ? "Loading..."
                : `${listings.length} ${
                    listings.length === 1 ? "item" : "items"
                  } on campus`}
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="flex-1 rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  category === c
                    ? "rounded-full border border-accent bg-accentSoft px-3.5 py-1.5 text-xs font-medium text-violet-300"
                    : "rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-textMuted transition-colors hover:border-white/20 hover:text-textPrimary"
                }
              >
                {c}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            skeleton
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface/50 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-6 w-6 text-textMuted"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="text-base font-semibold">No listings found</h3>
              <p className="mt-1 max-w-sm text-sm text-textMuted">
                Try clearing filters or searching for something else.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
