import { NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export async function GET(request: Request) {
  try {
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
          api_key: NEYNAR_API_KEY,
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
