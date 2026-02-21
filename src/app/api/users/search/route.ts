import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ users: [], error: "API key not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const res = await fetch(
      `${NEYNAR_API_BASE}/farcaster/user/search?q=${encodeURIComponent(query)}&limit=20`,
      {
        headers: {
          accept: "application/json",
          api_key: apiKey,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Search failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ users: data.result?.users || [] });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
