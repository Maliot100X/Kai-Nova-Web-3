import { NextResponse } from "next/server";
import { CLANKER_CONTRACT_ADDRESS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { name, symbol, imageUrl } = await request.json();

    if (!name || !symbol) {
      return NextResponse.json({ error: "Name and symbol are required" }, { status: 400 });
    }

    // In production, this would use the thirdweb SDK with a server wallet
    // to call the Clanker contract's deployToken function.
    // For now, return the contract info for client-side deployment.
    return NextResponse.json({
      contract: CLANKER_CONTRACT_ADDRESS,
      method: "deployToken",
      params: { name, symbol, image: imageUrl || "", castHash: "" },
      message: "Use thirdweb SDK on the client to send this transaction",
    });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
