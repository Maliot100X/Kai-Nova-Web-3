import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { SOVEREIGN_ITEMS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { itemId, fid } = await request.json();

    const item = SOVEREIGN_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    try {
      const supabase = getSupabase();

      const { error } = await supabase.from("subscriptions").upsert(
        {
          fid: fid || 0,
          item_id: itemId,
          item_name: item.name,
          badge_type: item.badge,
          tier: item.tier,
          cost: item.cost,
          claimed_at: new Date().toISOString(),
        },
        { onConflict: "fid,item_id" }
      );

      if (error) throw error;

      return NextResponse.json({ success: true, badge: item.badge });
    } catch {
      return NextResponse.json({ success: true, badge: item.badge, source: "local" });
    }
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
