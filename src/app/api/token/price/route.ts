import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TOKEN_ADDRESS = "0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";
const FALLBACK_PRICE = { usd: 0, usd_24h_change: 0, usd_market_cap: 0 };

export async function GET() {
  try {
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 30 },
      }
    );

    if (dexRes.ok) {
      const dexData = await dexRes.json();
      const pair = dexData?.pairs?.[0];
      if (pair) {
        return NextResponse.json({
          usd: parseFloat(pair.priceUsd || "0"),
          usd_24h_change: parseFloat(pair.priceChange?.h24 || "0"),
          usd_market_cap: parseFloat(pair.marketCap || "0"),
        });
      }
    }

    const geckoRes = await fetch(
      `https://api.geckoterminal.com/api/v2/simple/networks/base/token_price/${TOKEN_ADDRESS}`,
      { next: { revalidate: 60 } }
    );

    if (geckoRes.ok) {
      const geckoData = await geckoRes.json();
      const price = geckoData?.data?.attributes?.token_prices?.[TOKEN_ADDRESS.toLowerCase()];
      if (price) {
        return NextResponse.json({
          usd: parseFloat(price),
          usd_24h_change: 0,
          usd_market_cap: 0,
        });
      }
    }

    return NextResponse.json(FALLBACK_PRICE);
  } catch (error) {
    console.error("Price fetch error:", error);
    return NextResponse.json(FALLBACK_PRICE);
  }
}
