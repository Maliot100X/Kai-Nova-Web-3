import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getTierFromBalance } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "holders";

    const db = createServerClient();

    const { data, error } = await db
      .from("users")
      .select("fid, username, display_name, pfp_url, token_balance")
      .order("token_balance", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ entries: [] });
    }

    const entries: LeaderboardEntry[] = (data || []).map(
      (row: Record<string, unknown>, index: number) => ({
        rank: index + 1,
        fid: row.fid as number,
        username: (row.username as string) || "",
        display_name: (row.display_name as string) || (row.username as string) || "",
        pfp_url: (row.pfp_url as string) || "",
        score: Number(row.token_balance) || 0,
        token_balance: Number(row.token_balance) || 0,
        tier: getTierFromBalance(Number(row.token_balance) || 0),
      })
    );

    // For engagement type, we just return the same ranked list for now
    // (engagement_score is not yet tracked separately)
    return NextResponse.json({ entries, type });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ entries: [] });
  }
}
