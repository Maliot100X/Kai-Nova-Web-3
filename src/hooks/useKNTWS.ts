"use client";

import { useReadContract, useActiveAccount } from "thirdweb/react";
import { kntwsContract } from "@/lib/thirdweb";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

const CAST_GATE = 100_000;
const GOLDEN_CAST_GATE = 1_000_000;
const ROYAL_GATE = 500_000;

export interface KNTWSStatus {
  /** Raw balance in token units (already divided by decimals) */
  balance: number;
  /** Can cast to home feed (>= 100k) */
  canCast: boolean;
  /** Can cast to Golden feed (>= 1M) */
  canGoldenCast: boolean;
  /** Royal holder (>= 500k) */
  isRoyal: boolean;
  isLoading: boolean;
  walletAddress: string | undefined;
}

export function useKNTWS(): KNTWSStatus {
  const account = useActiveAccount();
  const { setTokenBalance } = useApp();

  const { data: rawBalance, isLoading } = useReadContract({
    contract: kntwsContract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: account ? [account.address] : ["0x0000000000000000000000000000000000000000"],
  });

  // Convert from wei (18 decimals) to token units
  const balance = rawBalance ? Number(rawBalance) / 1e18 : 0;

  // Sync into global app context so ProfileTab / leaderboard etc. can read it
  useEffect(() => {
    setTokenBalance(balance);
  }, [balance, setTokenBalance]);

  return {
    balance,
    canCast: balance >= CAST_GATE,
    canGoldenCast: balance >= GOLDEN_CAST_GATE,
    isRoyal: balance >= ROYAL_GATE,
    isLoading,
    walletAddress: account?.address,
  };
}
