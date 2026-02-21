import { createThirdwebClient, getContract, defineChain } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { KNTWS_TOKEN_ADDRESS } from "./constants";

export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const baseChain = defineChain(8453);

/** Wallet options: in-app (Farcaster/email/social), Coinbase Smart Wallet, MetaMask */
export const supportedWallets = [
  inAppWallet({
    auth: {
      options: ["farcaster", "email", "google", "passkey"],
    },
  }),
  createWallet("com.coinbase.wallet"),
  createWallet("io.metamask"),
];

/** $KNTWS ERC-20 contract on Base */
export const kntwsContract = getContract({
  client: thirdwebClient,
  address: KNTWS_TOKEN_ADDRESS,
  chain: baseChain,
});

/** Clanker v3 factory contract on Base */
export const clankerContract = getContract({
  client: thirdwebClient,
  address: "0x1909b332397144aeb4867b7274a05dbb25bd1fec",
  chain: baseChain,
});
