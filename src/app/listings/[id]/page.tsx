"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { StatusPill } from "@/components/ListingCard";

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  status: "ACTIVE" | "SOLD";
  pickupLocation: string | null;
  createdAt: string;
  seller: { id: string; name: string };
};

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/listings/${params.id}`).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Not found"))
      ),
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : { user: null })),
    ])
      .then(([l, u]) => {
        setListing(l.listing);
        setMe(u.user);
      })
      .catch(() => setError("This listing could not be found."))
      .finally(() => setLoading(false));
  }, [params.id]);

  const isOwner = !!(me && listing && me.id === listing.seller.id);

  async function toggleSold() {
    if (!listing) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listing.id}/sold`, {
        method: "PATCH",
      });
      if (res.ok) {
        const d = await res.json();
        setListing({ ...d.listing, seller: listing.seller });
      }
    } finally {
      setBusy(false);
    }
  }

  async function deleteListing() {
    if (!listing) return;
    if (!confirm("Delete this listing permanently? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <Link
            href="/listings"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-textPrimary"
          >
            ← Back to browse
          </Link>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="aspect-square animate-pulse rounded-xl bg-white/5" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-6 w-1/3 animate-pulse rounded bg-white/5" />
                <div className="h-24 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ) : error || !listing ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface/50 py-20 text-center">
              <h2 className="text-lg font-semibold">{error || "Not found"}</h2>
              <p className="mt-1 text-sm text-textMuted">
                The listing may have been removed.
              </p>
              <Link
                href="/listings"
                className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentHover"
              >
                Back to browse
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight">
                  {listing.title}
                </h1>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-bold">₹{listing.price}</span>
                  <StatusPill status={listing.status} />
                </div>

                <dl className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-textMuted">Category</dt>
                    <dd>{listing.category}</dd>
                  </div>
                  {listing.pickupLocation && (
                    <div className="flex justify-between">
                      <dt className="text-textMuted">Pickup</dt>
                      <dd>{listing.pickupLocation}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-textMuted">Seller</dt>
                    <dd>{listing.seller.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-textMuted">Posted</dt>
                    <dd>
                      {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>

                {isOwner ? (
                  <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                    <Link
                      href={`/dashboard/${listing.id}/edit`}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                    >
                      Edit listing
                    </Link>
                    <button
                      onClick={toggleSold}
                      disabled={busy}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
                    >
                      {listing.status === "SOLD" ? "Relist" : "Mark as sold"}
                    </button>
                    <button
                      onClick={deleteListing}
                      disabled={busy}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="mb-3 text-xs text-textMuted">
                      Contact the seller on campus to arrange pickup.
                    </p>
                    <a
                      href={`mailto:?subject=Interested in your listing: ${encodeURIComponent(
                        listing.title
                      )}`}
                      className="inline-block rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accentHover"
                    >
                      Message seller
                    </a>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <h2 className="mb-3 text-lg font-semibold">Description</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-textMuted">
                  {listing.description}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
