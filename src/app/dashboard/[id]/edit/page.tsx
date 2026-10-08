"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CATEGORIES = [
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

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  pickupLocation: string | null;
  contact: string | null;
  seller: { id: string };
};

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notAllowed, setNotAllowed] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Textbooks",
    imageUrl: "",
    pickupLocation: "",
    contact: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/listings/${params.id}`).then((r) => r.json()),
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : { user: null })),
    ])
      .then(([l, u]) => {
        const listing: Listing | undefined = l.listing;
        if (!listing) {
          setError("Listing not found");
          return;
        }
        if (!u.user || u.user.id !== listing.seller.id) {
          setNotAllowed(true);
          return;
        }
        setForm({
          title: listing.title,
          description: listing.description,
          price: String(listing.price),
          category: listing.category,
          imageUrl: listing.imageUrl,
          pickupLocation: listing.pickupLocation ?? "",
          contact: listing.contact ?? "",
        });
      })
      .catch(() => setError("Failed to load listing"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 500 * 1024) {
      setError("Image must be under 500 KB. Try compressing it.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageUrl: reader.result as string }));
      setUploading(false);
    };
    reader.onerror = () => {
      setError("Could not read the file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/listings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          pickupLocation: form.pickupLocation || undefined,
          contact: form.contact || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      router.push(`/listings/${params.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteListing() {
    if (!confirm("Delete this listing permanently?")) return;
    setSaving(true);
    const res = await fetch(`/api/listings/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
        <div className="relative z-10">
          <Navbar />
          <main className="mx-auto max-w-3xl px-6 py-10">
            <div className="space-y-4">
              <div className="h-8 w-1/3 animate-pulse rounded bg-white/5" />
              <div className="h-12 animate-pulse rounded bg-white/5" />
              <div className="h-32 animate-pulse rounded bg-white/5" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (notAllowed) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
        <div className="relative z-10">
          <Navbar />
          <main className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h1 className="text-2xl font-bold">Not allowed</h1>
            <p className="mt-2 text-sm text-textMuted">
              You can only edit your own listings.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentHover"
            >
              Back to dashboard
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 py-10">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-textPrimary"
          >
            ← Back to dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit listing</h1>
            <p className="mt-1 text-sm text-textMuted">
              Update the details and save your changes.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Title *</label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Image *</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm transition-colors hover:bg-white/5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>{uploading ? "Reading..." : "Choose file"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Or paste an image URL"
                />
              </div>
              {form.imageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt=""
                    className="h-24 w-24 rounded-lg border border-white/10 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Pickup location (optional)
              </label>
              <input
                type="text"
                maxLength={80}
                value={form.pickupLocation}
                onChange={(e) =>
                  setForm({ ...form, pickupLocation: e.target.value })
                }
                className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Contact info (optional)
              </label>
              <input
                type="text"
                maxLength={120}
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="WhatsApp +91 98765 43210 or email"
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent px-5 py-3 font-medium text-white shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-colors hover:bg-accentHover disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <Link
                href={`/listings/${params.id}`}
                className="rounded-lg border border-white/10 px-5 py-3 font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={deleteListing}
                disabled={saving}
                className="ml-auto rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                Delete listing
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
