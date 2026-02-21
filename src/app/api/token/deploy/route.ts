import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLANKER_CREATOR = "0x1909b332397144aeb4867b7274a05dbb25bd1fec";

export async function POST(request: Request) {
  try {
    const { name, symbol, imageUrl } = await request.json();

    if (!name || !symbol) {
      return NextResponse.json({ error: "Name and symbol are required" }, { status: 400 });
    }

    return NextResponse.json({
      contract: CLANKER_CREATOR,
      method: "deployToken",
      chainId: 8453,
      params: {
        name,
        symbol,
        image: imageUrl || "",
        castHash: "",
      },
      abi: [
        {
          inputs: [
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "image", type: "string" },
            { name: "castHash", type: "string" },
          ],
          name: "deployToken",
          outputs: [{ name: "", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      instructions: "Send this transaction via thirdweb SDK or wallet to deploy your token on Base",
    });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
