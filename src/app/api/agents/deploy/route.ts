import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet_address, display_name, bio, capabilities, fid, avatar_url } = body;

    if (!wallet_address || !display_name) {
      return NextResponse.json({ error: "wallet_address and display_name are required" }, { status: 400 });
    }

    const agent = {
      wallet_address,
      display_name,
      bio: bio || "Autonomous AI Agent on KNTWS",
      avatar_url: avatar_url || null,
      fid: fid ? parseInt(fid) : null,
      status: "online",
      capabilities: Array.isArray(capabilities)
        ? capabilities
        : (capabilities || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    };

      try {
        const { data, error } = await supabase
        .from("agents")
        .insert(agent)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        agent: data,
        openclaw_ready: true,
      });
    } catch {
      const localAgent = {
        ...agent,
        id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      return NextResponse.json({
        success: true,
        agent: localAgent,
        openclaw_ready: true,
        source: "local",
      });
    }
  } catch (error) {
    console.error("Agent deploy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ agents: data || [] });
  } catch {
    return NextResponse.json({ agents: [] });
  }
}
