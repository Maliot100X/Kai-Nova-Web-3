"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Trophy,
  ShoppingBag,
  Bot,
  User,
  Rocket,
  Crown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NAV_ITEMS, type NavItemId } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Search,
  Trophy,
  ShoppingBag,
  Bot,
  User,
  Rocket,
  Crown,
};

export function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, tokenPrice } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-screen z-50 flex flex-col",
          "bg-obsidian border-r border-gold/10",
          "lg:relative",
          !sidebarOpen && "max-lg:hidden"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gold/10">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-obsidian" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-lg font-bold gold-text">KNTWS</h1>
                <p className="text-[10px] text-gold/50 tracking-widest uppercase">Sovereign Client</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as NavItemId);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "text-sm font-medium",
                  isActive
                    ? "glass-panel text-gold shadow-gold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-gold")} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-[3px] h-8 bg-gold rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Price Widget */}
        <div className="px-3 pb-3">
          <div className="glass-panel rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center">
                <Crown className="w-3 h-3 text-obsidian" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-gold"
                  >
                    $KNTWS
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {sidebarOpen && tokenPrice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                <p className="text-lg font-bold text-white">{formatCurrency(tokenPrice.usd)}</p>
                <div className="flex items-center gap-1">
                  {tokenPrice.usd_24h_change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      tokenPrice.usd_24h_change >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {tokenPrice.usd_24h_change >= 0 ? "+" : ""}
                    {tokenPrice.usd_24h_change.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            )}
            {sidebarOpen && !tokenPrice && (
              <div className="h-12 animate-pulse bg-white/5 rounded-lg" />
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center py-3 border-t border-gold/10 text-white/40 hover:text-gold transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </motion.aside>
    </>
  );
}
