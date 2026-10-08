import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.listing.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.sellerId !== session.userId) {
      return NextResponse.json(
        { error: "You can only update your own listings" },
        { status: 403 }
      );
    }

    const nextStatus = existing.status === "ACTIVE" ? "SOLD" : "ACTIVE";

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: { status: nextStatus },
    });

    return NextResponse.json({
      listing: { ...updated, price: Number(updated.price) },
    });
  } catch (err) {
    console.error("sold toggle error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
