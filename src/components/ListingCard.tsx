import Link from "next/link";

export type Listing = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: "ACTIVE" | "SOLD";
  category: string;
  seller: { id: string; name: string };
};

export function StatusPill({ status }: { status: "ACTIVE" | "SOLD" }) {
  const isSold = status === "SOLD";
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

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.status === "SOLD" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rotate-[-8deg] rounded-md border-2 border-red-500 px-3 py-1 text-lg font-bold text-red-400">
              SOLD
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-medium">{listing.title}</div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold">₹{listing.price}</span>
          <StatusPill status={listing.status} />
        </div>
      </div>
    </Link>
  );
}
