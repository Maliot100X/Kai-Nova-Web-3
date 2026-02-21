import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FALLBACK_PRICE = { usd: 0, usd_24h_change: 0, usd_market_cap: 0 };

export async function GET() {
  try {
    const tokenAddress = process.env.MY_TOKEN_ADDRESS || "0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";

    const res = await fetch(
      `https://api.geckoterminal.com/api/v2/simple/networks/base/token_price/${tokenAddress}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json(FALLBACK_PRICE);
    }

    const data = await res.json();
    const tokenData = data?.data?.attributes?.token_prices?.[tokenAddress.toLowerCase()];

    const price = tokenData ? parseFloat(tokenData) : 0;

    return NextResponse.json({
      usd: price,
      usd_24h_change: 0,
      usd_market_cap: 0,
    });
  } catch (error) {
    console.error("Price fetch error:", error);
    return NextResponse.json(FALLBACK_PRICE);
  }
}
