import { NextResponse } from "next/server";

const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    const signerUuid = process.env.NEYNAR_SIGNER_UUID;
    if (!apiKey || !signerUuid) {
      return NextResponse.json({ error: "API not configured" }, { status: 500 });
    }

    const { text, parentHash } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const body: Record<string, string> = {
      signer_uuid: signerUuid,
      text,
    };
    if (parentHash) body.parent = parentHash;

    const res = await fetch(`${NEYNAR_API_BASE}/farcaster/cast`, {
      method: "POST",
      headers: {
        accept: "application/json",
        api_key: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: "Cast failed", details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
