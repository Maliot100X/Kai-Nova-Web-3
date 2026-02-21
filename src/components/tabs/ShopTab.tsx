"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowUpDown,
  Crown,
  ExternalLink,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { KNTWS_TOKEN_ADDRESS } from "@/lib/constants";

export function ShopTab() {
  const { tokenPrice, tokenBalance } = useApp();
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState<"buy" | "sell">("buy");

  const handleSwap = () => {
    const uniswapUrl = `https://app.uniswap.org/swap?chain=base&outputCurrency=${KNTWS_TOKEN_ADDRESS}`;
    window.open(uniswapUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold gold-text">Shop & Swap</h2>

      {/* Token Price Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 border-gold/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
            <Crown className="w-6 h-6 text-obsidian" />
          </div>
          <div>
            <h3 className="font-bold text-lg">$KNTWS</h3>
            <p className="text-xs text-white/40">on Base Chain</p>
          </div>
          {tokenPrice && (
            <div className="ml-auto text-right">
              <p className="text-xl font-bold">{formatCurrency(tokenPrice.usd)}</p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className={cn(
                  "w-3 h-3",
                  tokenPrice.usd_24h_change >= 0 ? "text-emerald-400" : "text-red-400"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  tokenPrice.usd_24h_change >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {tokenPrice.usd_24h_change >= 0 ? "+" : ""}{tokenPrice.usd_24h_change.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Balance */}
        <div className="glass-panel rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold/60" />
              <span className="text-sm text-white/60">Your Balance</span>
            </div>
            <span className="text-lg font-bold gold-text">{formatNumber(tokenBalance)} KNTWS</span>
          </div>
        </div>

        {/* Swap UI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setSwapDirection("buy")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors",
                swapDirection === "buy"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-white/40 hover:text-white"
              )}
            >
              Buy
            </button>
            <button
              onClick={() => setSwapDirection("sell")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors",
                swapDirection === "sell"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-white/40 hover:text-white"
              )}
            >
              Sell
            </button>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <label className="text-xs text-white/40 mb-1 block">
              {swapDirection === "buy" ? "Amount (ETH)" : "Amount (KNTWS)"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/20"
              />
              <ArrowUpDown className="w-5 h-5 text-gold/40" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSwap}
            className="w-full py-3 bg-gold-gradient rounded-xl text-obsidian font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg transition-shadow"
          >
            <ShoppingBag className="w-5 h-5" />
            {swapDirection === "buy" ? "Buy $KNTWS" : "Sell $KNTWS"}
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Uniswap", url: `https://app.uniswap.org/swap?chain=base&outputCurrency=${KNTWS_TOKEN_ADDRESS}` },
          { label: "BaseScan", url: `https://basescan.org/token/${KNTWS_TOKEN_ADDRESS}` },
          { label: "DexScreener", url: `https://dexscreener.com/base/${KNTWS_TOKEN_ADDRESS}` },
          { label: "GeckoTerminal", url: `https://www.geckoterminal.com/base/pools/${KNTWS_TOKEN_ADDRESS}` },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel-hover rounded-xl p-3 flex items-center justify-between text-sm"
          >
            <span className="text-white/70">{link.label}</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold/40" />
          </a>
        ))}
      </div>
    </div>
  );
}
