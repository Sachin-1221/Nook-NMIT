import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q || q.length < 2) {
      return NextResponse.json({ books: [] });
    }

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      q
    )}&limit=6&fields=title,author_name,cover_i,first_publish_year`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Book service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const books = (data.docs ?? []).map((d: any) => ({
      title: d.title ?? "Untitled",
      author: d.author_name?.[0] ?? "Unknown author",
      year: d.first_publish_year ?? null,
      coverUrl: d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
        : null,
    }));

    return NextResponse.json({ books });
  } catch (err) {
    console.error("open library error", err);
    return NextResponse.json(
      { error: "Book service unavailable" },
      { status: 502 }
    );
  }
}
