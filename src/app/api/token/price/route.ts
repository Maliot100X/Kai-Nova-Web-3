import { NextResponse } from "next/server";
import { KNTWS_TOKEN_ADDRESS } from "@/lib/constants";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.geckoterminal.com/api/v2/simple/networks/base/token_price/${KNTWS_TOKEN_ADDRESS}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({
        usd: 0,
        usd_24h_change: 0,
        usd_market_cap: 0,
      });
    }

    const data = await res.json();
    const tokenData = data?.data?.attributes?.token_prices?.[KNTWS_TOKEN_ADDRESS.toLowerCase()];

    const price = tokenData ? parseFloat(tokenData) : 0;

    return NextResponse.json({
      usd: price,
      usd_24h_change: 0,
      usd_market_cap: 0,
    });
  } catch (error) {
    console.error("Price fetch error:", error);
    return NextResponse.json({
      usd: 0,
      usd_24h_change: 0,
      usd_market_cap: 0,
    });
  }
}
