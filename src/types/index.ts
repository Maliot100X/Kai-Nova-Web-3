export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio?: string;
  follower_count: number;
  following_count: number;
  verifications?: string[];
  custody_address?: string;
  signer_uuid?: string;
}

export interface Cast {
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  author: FarcasterUser;
  text: string;
  timestamp: string;
  embeds?: CastEmbed[];
  reactions: {
    likes: { fid: number }[];
    recasts: { fid: number }[];
  };
  replies: {
    count: number;
  };
}

export interface CastEmbed {
  url?: string;
  cast_id?: { fid: number; hash: string };
}

export interface TokenPrice {
  usd: number;
  usd_24h_change: number;
  usd_market_cap: number;
}

export interface LeaderboardEntry {
  rank: number;
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  score: number;
  token_balance: number;
  tier: "knight" | "king" | "none";
}

export interface AgentEntry {
  id: string;
  wallet_address: string;
  fid?: number;
  display_name: string;
  avatar_url: string;
  bio: string;
  is_agent: true;
  status: "online" | "offline";
  capabilities: string[];
  created_at: string;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  imageUrl: string;
}
