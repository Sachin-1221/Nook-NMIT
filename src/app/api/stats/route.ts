import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [listings, users] = await Promise.all([
      prisma.listing.count(),
      prisma.user.count(),
    ]);
    return NextResponse.json({ listings, users });
  } catch (err) {
    console.error("stats error", err);
    return NextResponse.json({ listings: 0, users: 0 }, { status: 500 });
  }
}
