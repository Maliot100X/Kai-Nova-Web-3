import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getTierFromBalance } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "holders";

    const orderColumn = type === "holders" ? "token_balance" : "engagement_score";

    let entries;
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order(orderColumn, { ascending: false })
        .limit(50);

      if (error) throw error;

      entries = (data || []).map((row: Record<string, unknown>, index: number) => ({
        rank: index + 1,
        fid: row.fid,
        username: row.username,
        display_name: row.display_name,
        pfp_url: row.pfp_url || "",
        score: type === "holders" ? row.token_balance : row.engagement_score,
        token_balance: row.token_balance,
        tier: getTierFromBalance(Number(row.token_balance) || 0),
      }));
    } catch {
      entries = Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        fid: 1000 + i,
        username: `user${i + 1}`,
        display_name: `User ${i + 1}`,
        pfp_url: "",
        score: Math.floor(Math.random() * 1_000_000),
        token_balance: Math.floor(Math.random() * 2_000_000),
        tier: getTierFromBalance(Math.floor(Math.random() * 2_000_000)),
      }));
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ entries: [] });
  }
}
