export const KNTWS_TOKEN_ADDRESS = process.env.MY_TOKEN_ADDRESS || "0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";
export const CLANKER_CONTRACT_ADDRESS = process.env.CLANKER_CONTRACT || "0xe85a59c628f7d27878aceb4bf3b35733630083a9";

export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = "https://mainnet.base.org";

export const KNIGHT_TIER_THRESHOLD = 1;
export const KING_TIER_THRESHOLD = 1_000_000;

export const NEYNAR_API_BASE = "https://api.neynar.com/v2";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "search", label: "Search", icon: "Search" },
  { id: "leaderboard", label: "Leaderboard", icon: "Trophy" },
  { id: "shop", label: "Shop", icon: "ShoppingBag" },
  { id: "agents", label: "Agents", icon: "Bot" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "launch", label: "Token Launch", icon: "Rocket" },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

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
