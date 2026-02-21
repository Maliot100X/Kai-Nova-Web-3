import { NextResponse } from "next/server";

const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const body = await request.json() as {
      text?: string;
      signerUuid?: string;
      parentHash?: string;
    };

    const { text, parentHash } = body;
    // Prefer the client-supplied signer_uuid (from SIWN); fall back to app-level env
    const signerUuid = body.signerUuid || process.env.NEYNAR_SIGNER_UUID;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    if (!signerUuid) {
      return NextResponse.json({ error: "No signer UUID available — sign in with Farcaster first" }, { status: 400 });
    }

    const castBody: Record<string, string> = {
      signer_uuid: signerUuid,
      text,
    };
    if (parentHash) castBody.parent = parentHash;

    const res = await fetch(`${NEYNAR_API_BASE}/farcaster/cast`, {
      method: "POST",
      headers: {
        accept: "application/json",
        api_key: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(castBody),
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
