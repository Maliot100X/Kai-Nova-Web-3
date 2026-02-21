/**
 * OpenClaw Agent Integration Hooks
 * These are placeholder hooks for future OpenClaw protocol integration.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function registerAgent(profile: Omit<AgentProfile, "id" | "createdAt" | "isAgent">): Promise<AgentProfile> {
  throw new Error("OpenClaw integration not yet configured");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function executeAgentAction(agentId: string, action: AgentAction): Promise<void> {
  throw new Error("OpenClaw integration not yet configured");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAgentStatus(agentId: string): Promise<{ online: boolean; lastAction?: AgentAction }> {
  return { online: false };
}

export async function listAgents(): Promise<AgentProfile[]> {
  return [];
}

export function useOpenClawBridge() {
  return {
    connected: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    send: (msg: unknown) => { /* placeholder */ },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe: (channel: string, cb: (data: unknown) => void) => { /* placeholder */ },
  };
}
