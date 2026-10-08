import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  price: z.number().positive().max(1000000),
  category: z.string().min(2).max(40),
  imageUrl: z
    .string()
    .min(1)
    .refine(
      (v) => v.startsWith("http") || v.startsWith("data:image/"),
      "Image must be a URL or an uploaded file"
    ),
  pickupLocation: z.string().max(80).optional(),
  contact: z.string().max(120).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category") ?? "";
    const status = searchParams.get("status") ?? "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") ?? "newest";
    const sellerId = searchParams.get("sellerId") ?? "";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (sellerId) where.sellerId = sellerId;
    if (status) where.status = status;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy: any =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: {
        seller: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({
      listings: listings.map((l) => ({
        ...l,
        price: Number(l.price),
      })),
    });
  } catch (err) {
    console.error("list listings error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const listing = await prisma.listing.create({
      data: {
        ...data,
        price: data.price,
        sellerId: session.userId,
      },
      include: {
        seller: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { listing: { ...listing, price: Number(listing.price) } },
      { status: 201 }
    );
  } catch (err) {
    console.error("create listing error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
