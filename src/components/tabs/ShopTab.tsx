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
  Zap,
  Sparkles,
  Check,
  Loader2,
  Lock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useSovereignty } from "@/hooks/useSovereignty";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { KNTWS_TOKEN_ADDRESS, SOVEREIGN_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = { Crown, Zap, Sparkles };

export function ShopTab() {
  const { tokenPrice, tokenBalance, isAuthenticated } = useApp();
  const { isRoyal } = useSovereignty();
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState<"buy" | "sell">("buy");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  const handleSwap = () => {
    const uniswapUrl = `https://app.uniswap.org/swap?chain=base&outputCurrency=${KNTWS_TOKEN_ADDRESS}`;
    window.open(uniswapUrl, "_blank");
  };

  const handleClaim = async (itemId: string, cost: number) => {
    if (tokenBalance < cost || !isAuthenticated) return;
    setClaiming(itemId);

    try {
      const res = await fetch("/api/subscription/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (res.ok) {
        setClaimed((prev) => new Set(prev).add(itemId));
      }
    } catch {
      // claim failed silently
    } finally {
      setClaiming(null);
    }
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


      {/* Claim Royal Status */}
      {isAuthenticated && !isRoyal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-5 border border-gold/30 bg-gradient-to-r from-gold/5 to-transparent"
        >
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-gold" />
            <div>
              <h3 className="font-bold text-sm gold-text">Claim Royal Status</h3>
              <p className="text-xs text-white/40">Hold 500,000+ $KNTWS to unlock the crown</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const url = `https://app.uniswap.org/swap?chain=base&outputCurrency=${KNTWS_TOKEN_ADDRESS}`;
              window.open(url, "_blank");
            }}
            className="w-full py-3 bg-gold-gradient rounded-xl text-obsidian font-bold flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg transition-shadow text-sm"
          >
            <Crown className="w-4 h-4" />
            Claim Royal Status
          </motion.button>
        </motion.div>
      )}

      {isAuthenticated && isRoyal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-5 border border-gold/40 king-glow"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-gold" />
            <div>
              <p className="font-bold text-sm gold-text">&#128081; Royal Status Active</p>
              <p className="text-xs text-white/40">You hold the sovereign threshold. All perks unlocked.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sovereign Items */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-gold" />
          Sovereign Items
        </h3>
        <div className="space-y-3">
          {SOVEREIGN_ITEMS.map((item, idx) => {
            const ItemIcon = iconMap[item.icon] || Crown;
            const canAfford = tokenBalance >= item.cost;
            const isClaimed = claimed.has(item.id);
            const isClaiming = claiming === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "glass-panel-hover rounded-xl p-5 relative overflow-hidden",
                  isClaimed && "border-gold/30"
                )}
              >
                {isClaimed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none" />
                )}
                <div className="flex items-start gap-4 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    item.tier === "king" ? "bg-gold-gradient shadow-gold" : "bg-gold/10 border border-gold/20"
                  )}>
                    <ItemIcon className={cn(
                      "w-6 h-6",
                      item.tier === "king" ? "text-obsidian" : "text-gold"
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      {isClaimed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold">
                          CLAIMED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mb-3 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold gold-text">{formatNumber(item.cost)} $KNTWS</span>
                      {isClaimed ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <Check className="w-4 h-4" />
                          Owned
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaim(item.id, item.cost)}
                          disabled={!canAfford || !isAuthenticated || isClaiming}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                            canAfford && isAuthenticated
                              ? "bg-gold-gradient text-obsidian shadow-gold hover:shadow-gold-lg"
                              : "bg-white/5 text-white/30 cursor-not-allowed"
                          )}
                        >
                          {isClaiming ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : !canAfford ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Crown className="w-3.5 h-3.5" />
                          )}
                          {isClaiming ? "Claiming..." : canAfford ? "Claim" : "Insufficient"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

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
