"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type BookResult = {
  title: string;
  author: string;
  year: number | null;
  coverUrl: string | null;
};

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Textbooks",
    imageUrl: "",
    pickupLocation: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [bookQuery, setBookQuery] = useState("");
  const [books, setBooks] = useState<BookResult[]>([]);
  const [searching, setSearching] = useState(false);

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

  async function searchBooks() {
    if (bookQuery.trim().length < 2) return;
    setSearching(true);
    try {
      const res = await fetch(
        `/api/external/books?q=${encodeURIComponent(bookQuery.trim())}`
      );
      const data = await res.json();
      setBooks(data.books ?? []);
    } catch {
      setBooks([]);
    } finally {
      setSearching(false);
    }
  }

  function applyBook(b: BookResult) {
    setForm((f) => ({
      ...f,
      title: b.title,
      description: f.description || `${b.title} by ${b.author}.`,
      imageUrl: b.coverUrl ?? f.imageUrl,
      category: "Textbooks",
    }));
    setBooks([]);
    setBookQuery("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.imageUrl) {
      setError("Please upload an image or paste an image URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
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
        setError(data.error || "Failed to create listing");
        return;
      }
      router.push(`/listings/${data.listing.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-textPrimary"
          >
            ← Back to dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">List an item</h1>
            <p className="mt-1 text-sm text-textMuted">
              It takes less than a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-5 lg:col-span-2"
            >
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
                  className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Physics Vol 1 — HC Verma"
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
                  className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Barely used, no highlights, includes both parts."
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
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="450"
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
                    className="flex-1 rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Or paste an image URL"
                  />
                </div>
                <p className="text-xs text-textMuted">
                  Upload a file (max 500 KB) or paste an image URL.
                </p>
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
                  className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="NMIT Library"
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
                  className="rounded-lg border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="WhatsApp +91 98765 43210 or email"
                />
                <p className="text-xs text-textMuted">
                  Buyers will see this when they view your listing.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-accent px-5 py-3 font-medium text-white shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-colors hover:bg-accentHover disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish listing"}
              </button>
            </form>

            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-white/10 bg-surface p-5">
                <div className="mb-3 text-sm font-semibold">
                  Search Open Library
                </div>
                <p className="mb-3 text-xs text-textMuted">
                  Type a book title or author to autofill.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        searchBooks();
                      }
                    }}
                    placeholder="physics"
                    className="flex-1 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={searchBooks}
                    disabled={searching}
                    className="rounded-lg bg-white/5 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    {searching ? "..." : "Find"}
                  </button>
                </div>

                {books.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {books.map((b, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => applyBook(b)}
                          className="flex w-full items-center gap-3 rounded-lg border border-white/5 p-2 text-left transition-colors hover:border-accent/40 hover:bg-white/5"
                        >
                          {b.coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={b.coverUrl}
                              alt=""
                              className="h-12 w-9 shrink-0 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-9 shrink-0 rounded bg-white/5" />
                          )}
                          <div className="min-w-0">
                            <div className="truncate text-xs font-medium">
                              {b.title}
                            </div>
                            <div className="truncate text-[11px] text-textMuted">
                              {b.author}
                              {b.year ? ` · ${b.year}` : ""}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-surface p-5">
                <div className="mb-3 text-sm font-semibold">Live preview</div>
                <div className="overflow-hidden rounded-lg border border-white/10 bg-background">
                  <div className="aspect-square overflow-hidden bg-white/5">
                    {form.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-textMuted">
                        Image preview
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="truncate text-sm font-medium">
                      {form.title || "Title"}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        ₹{form.price || "0"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
