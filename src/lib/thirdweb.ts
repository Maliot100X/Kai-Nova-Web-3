import { createThirdwebClient, defineChain } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const baseChain = defineChain(8453);
