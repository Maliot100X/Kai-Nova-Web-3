"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { FarcasterUser, TokenPrice, AgentEntry } from "@/types";
import type { NavItemId } from "@/lib/constants";

interface AppState {
  user: FarcasterUser | null;
  isAuthenticated: boolean;
  activeTab: NavItemId;
  tokenBalance: number;
  tokenPrice: TokenPrice | null;
  agents: AgentEntry[];
  sidebarOpen: boolean;
}

interface AppContextValue extends AppState {
  setUser: (user: FarcasterUser | null) => void;
  setActiveTab: (tab: NavItemId) => void;
  setTokenBalance: (balance: number) => void;
  setTokenPrice: (price: TokenPrice | null) => void;
  addAgent: (agent: AgentEntry) => void;
  removeAgent: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    activeTab: "home",
    tokenBalance: 0,
    tokenPrice: null,
    agents: [],
    sidebarOpen: true,
  });

  const setUser = useCallback((user: FarcasterUser | null) => {
    setState((prev) => ({ ...prev, user, isAuthenticated: !!user }));
  }, []);

  const setActiveTab = useCallback((activeTab: NavItemId) => {
    setState((prev) => ({ ...prev, activeTab }));
  }, []);

  const setTokenBalance = useCallback((tokenBalance: number) => {
    setState((prev) => ({ ...prev, tokenBalance }));
  }, []);

  const setTokenPrice = useCallback((tokenPrice: TokenPrice | null) => {
    setState((prev) => ({ ...prev, tokenPrice }));
  }, []);

  const addAgent = useCallback((agent: AgentEntry) => {
    setState((prev) => ({ ...prev, agents: [...prev.agents, agent] }));
  }, []);

  const removeAgent = useCallback((id: string) => {
    setState((prev) => ({ ...prev, agents: prev.agents.filter((a) => a.id !== id) }));
  }, []);

  const setSidebarOpen = useCallback((sidebarOpen: boolean) => {
    setState((prev) => ({ ...prev, sidebarOpen }));
  }, []);

  const signOut = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      tokenBalance: 0,
    }));
  }, []);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch("/api/token/price");
        if (res.ok) {
          const data = await res.json();
          setTokenPrice(data);
        }
      } catch {
        // silently fail, will retry
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, [setTokenPrice]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
        setActiveTab,
        setTokenBalance,
        setTokenPrice,
        addAgent,
        removeAgent,
        setSidebarOpen,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
