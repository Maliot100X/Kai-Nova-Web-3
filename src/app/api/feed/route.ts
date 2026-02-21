import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ casts: [], error: "API key not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || "";
    const limit = searchParams.get("limit") || "25";

    const params = new URLSearchParams({
      feed_type: "filter",
      filter_type: "global_trending",
      limit,
    });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`${NEYNAR_API_BASE}/farcaster/feed?${params}`, {
      headers: {
        accept: "application/json",
        api_key: apiKey,
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch feed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
