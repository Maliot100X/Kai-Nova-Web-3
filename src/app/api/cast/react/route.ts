import { NextResponse } from "next/server";

const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    const signerUuid = process.env.NEYNAR_SIGNER_UUID;
    if (!apiKey || !signerUuid) {
      return NextResponse.json({ error: "API not configured" }, { status: 500 });
    }

    const { hash, type } = await request.json();

    if (!hash || !type || !["like", "recast"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const res = await fetch(`${NEYNAR_API_BASE}/farcaster/reaction`, {
      method: "POST",
      headers: {
        accept: "application/json",
        api_key: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        reaction_type: type,
        target: hash,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: "Reaction failed", details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("React error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
