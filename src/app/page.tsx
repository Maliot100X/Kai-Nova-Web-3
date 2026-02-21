"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { HomeTab } from "@/components/tabs/HomeTab";
import { SearchTab } from "@/components/tabs/SearchTab";
import { LeaderboardTab } from "@/components/tabs/LeaderboardTab";
import { ShopTab } from "@/components/tabs/ShopTab";
import { AgentsTab } from "@/components/tabs/AgentsTab";
import { ProfileTab } from "@/components/tabs/ProfileTab";
import { LaunchTab } from "@/components/tabs/LaunchTab";
import { SignInButton } from "@/components/auth/SignInButton";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import { Crown } from "lucide-react";

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  home: HomeTab,
  search: SearchTab,
  leaderboard: LeaderboardTab,
  shop: ShopTab,
  agents: AgentsTab,
  profile: ProfileTab,
  launch: LaunchTab,
};

export default function Home() {
  const { activeTab, isAuthenticated, user } = useApp();

  const ActiveComponent = TAB_COMPONENTS[activeTab] || HomeTab;

  return (
    <div className="flex h-screen overflow-hidden bg-obsidian">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <MobileHeader />

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-xl border-b border-gold/5">
          <div className="flex items-center justify-between px-6 py-3 max-lg:pt-16">
            <div />
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/50">@{user.username}</span>
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center overflow-hidden">
                  {user.pfp_url ? (
                    <Image src={user.pfp_url} alt="" width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <Crown className="w-4 h-4 text-gold" />
                  )}
                </div>
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
