"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ListingCard, { Listing } from "./ListingCard";

export default function RecentListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings?sort=newest")
      .then((r) => r.json())
      .then((d) => setListings((d.listings ?? []).slice(0, 4)))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface/50 py-12 text-center">
        <p className="text-sm text-textMuted">
          No listings yet.{" "}
          <Link href="/dashboard/new" className="text-accent hover:underline">
            Be the first to list something →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
