"use client";

import { useEffect, useState } from "react";

export default function StatsStrip() {
  const [stats, setStats] = useState<{ listings: number; users: number } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ listings: 0, users: 0 }));
  }, []);

  const items = [
    { n: stats ? `${stats.listings}` : "—", l: "Listings" },
    { n: stats ? `${stats.users}` : "—", l: "Students" },
    { n: "10+", l: "Categories" },
    { n: "0%", l: "Fees" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-10 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-2xl font-bold text-accent">{s.n}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-textMuted">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
