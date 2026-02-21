"use client";

import { useApp } from "@/context/AppContext";

const ROYAL_THRESHOLD = 500_000;

export interface SovereigntyStatus {
  isRoyal: boolean;
  balance: number;
  threshold: number;
}

export function useSovereignty(): SovereigntyStatus {
  const { tokenBalance } = useApp();
  return {
    isRoyal: tokenBalance >= ROYAL_THRESHOLD,
    balance: tokenBalance,
    threshold: ROYAL_THRESHOLD,
  };
}
