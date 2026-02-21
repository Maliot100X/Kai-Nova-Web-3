export const KNTWS_TOKEN_ADDRESS = "0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";
export const CLANKER_CONTRACT_ADDRESS = process.env.CLANKER_CONTRACT || "0x1909b332397144aeb4867b7274a05dbb25bd1fec";

export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = "https://mainnet.base.org";

export const KNIGHT_TIER_THRESHOLD = 1;
export const KING_TIER_THRESHOLD = 1_000_000;
export const SUBSCRIPTION_THRESHOLD = 500_000;
export const ALPHA_THRESHOLD = 100_000;
export const GLOW_THRESHOLD = 50_000;

export const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "golden", label: "Golden Casts", icon: "Crown" },
  { id: "search", label: "Search", icon: "Search" },
  { id: "leaderboard", label: "Leaderboard", icon: "Trophy" },
  { id: "shop", label: "Shop", icon: "ShoppingBag" },
  { id: "agents", label: "Agents", icon: "Bot" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "launch", label: "Token Launch", icon: "Rocket" },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

export const SOVEREIGN_ITEMS = [
  {
    id: "kings-subscription",
    name: "King's Subscription",
    description: "Permanent Royal Badge. Unlocks exclusive King-tier features, priority feed placement, and sovereign governance rights.",
    cost: 500_000,
    icon: "Crown",
    tier: "king" as const,
    badge: "royal",
  },
  {
    id: "alpha-access",
    name: "Alpha Access",
    description: "Early access to new features, alpha token alerts, and priority casting queue. The inner circle.",
    cost: 100_000,
    icon: "Zap",
    tier: "knight" as const,
    badge: "alpha",
  },
  {
    id: "gold-profile-glow",
    name: "Gold Profile Glow",
    description: "A permanent golden glow effect around your profile. Visible across the entire platform.",
    cost: 50_000,
    icon: "Sparkles",
    tier: "knight" as const,
    badge: "glow",
  },
] as const;

export const CLANKER_DEPLOY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "image", type: "string" },
      { name: "castHash", type: "string" },
    ],
    name: "deployToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const ERC20_BALANCE_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
