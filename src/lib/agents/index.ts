/**
 * OpenClaw Agent Integration Hooks
 * Infrastructure for autonomous agent orchestration on KNTWS.
 * Agents registered here can Cast, Trade, and Tip via the OpenClaw relay.
 */

export interface AgentProfile {
  id: string;
  walletAddress: string;
  fid?: number;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isAgent: true;
  capabilities: string[];
  createdAt: string;
}

export interface AgentAction {
  type: "cast" | "reply" | "like" | "recast" | "tip" | "trade";
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface OpenClawConfig {
  relayUrl: string;
  apiKey: string;
  agentId: string;
}

export async function registerAgent(
  profile: Omit<AgentProfile, "id" | "createdAt" | "isAgent">,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config?: Partial<OpenClawConfig>
): Promise<AgentProfile> {
  const res = await fetch("/api/agents/deploy", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      wallet_address: profile.walletAddress,
      display_name: profile.displayName,
      fid: profile.fid,
      avatar_url: profile.avatarUrl,
      bio: profile.bio,
      capabilities: profile.capabilities,
    }),
  });

  if (!res.ok) throw new Error("Agent registration failed");

  const data = await res.json();
  return {
    id: data.agent.id,
    walletAddress: data.agent.wallet_address,
    fid: data.agent.fid,
    displayName: data.agent.display_name,
    avatarUrl: data.agent.avatar_url,
    bio: data.agent.bio,
    isAgent: true,
    capabilities: data.agent.capabilities || [],
    createdAt: data.agent.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function executeAgentAction(agentId: string, action: AgentAction): Promise<{ queued: boolean }> {
  // OpenClaw relay: queue action for autonomous execution
  // In production, this sends to the OpenClaw WebSocket relay
  console.log(`[OpenClaw] Agent ${agentId} action queued:`, action.type);
  return { queued: true };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAgentStatus(agentId: string): Promise<{ online: boolean; lastAction?: AgentAction }> {
  return { online: false };
}

export async function listAgents(): Promise<AgentProfile[]> {
  try {
    const res = await fetch("/api/agents/deploy");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.agents || []).map((a: Record<string, unknown>) => ({
      id: a.id as string,
      walletAddress: a.wallet_address as string,
      fid: a.fid as number | undefined,
      displayName: a.display_name as string,
      avatarUrl: a.avatar_url as string,
      bio: a.bio as string,
      isAgent: true as const,
      capabilities: (a.capabilities || []) as string[],
      createdAt: a.created_at as string,
    }));
  } catch {
    return [];
  }
}

export function useOpenClawBridge() {
  return {
    connected: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    send: (msg: unknown) => { console.log("[OpenClaw] Bridge send:", msg); },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe: (channel: string, cb: (data: unknown) => void) => {
      console.log(`[OpenClaw] Subscribed to channel: ${channel}`);
    },
    disconnect: () => { console.log("[OpenClaw] Bridge disconnected"); },
  };
}
