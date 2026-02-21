"use client";

import { Menu, Crown } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function MobileHeader() {
  const { setSidebarOpen } = useApp();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-obsidian/90 backdrop-blur-xl border-b border-gold/10">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-gold transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
            <Crown className="w-4 h-4 text-obsidian" />
          </div>
          <span className="font-bold gold-text text-base">KNTWS</span>
        </div>
        <div className="w-6" />
      </div>
    </header>
  );
}
