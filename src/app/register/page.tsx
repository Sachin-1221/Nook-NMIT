"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-glow blur-3xl" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-xl font-bold tracking-tight">Nook</span>
            <span className="text-sm text-textMuted">NMIT</span>
          </Link>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-textMuted">
              Join students buying and selling on campus.
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border border-white/10 bg-[#131720] px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Aarav Mehta"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">College email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border border-white/10 bg-[#131720] px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="you@nmit.ac.in"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#131720] px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="At least 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-white shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-colors hover:bg-accentHover disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-textMuted">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
