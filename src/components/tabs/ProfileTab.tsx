"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Crown,
  Users,
  UserPlus,
  Shield,
  Copy,
  ExternalLink,
  LogOut,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useSovereignty } from "@/hooks/useSovereignty";
import { SignInButton } from "@/components/auth/SignInButton";
import { cn, formatNumber, formatAddress, getTierFromBalance } from "@/lib/utils";
import { KNTWS_TOKEN_ADDRESS } from "@/lib/constants";

export function ProfileTab() {
  const { user, isAuthenticated, tokenBalance, signOut } = useApp();
  const { isRoyal } = useSovereignty();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Crown className="w-16 h-16 text-gold/20" />
        <h2 className="text-xl font-bold text-white/60">Sign In Required</h2>
        <p className="text-sm text-white/30 max-w-sm text-center">
          Connect your Farcaster account to view your sovereign profile.
        </p>
        <SignInButton />
      </div>
    );
  }

  const tier = getTierFromBalance(tokenBalance);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "glass-panel rounded-2xl p-6 relative overflow-hidden",
          (isRoyal || tier === "king") && "king-glow border-gold/30"
        )}
      >
        {(isRoyal || tier === "king") && (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
        )}

        <div className="flex items-start gap-5 relative z-10">
          {/* Profile picture with golden glow */}
          <div
            className={cn(
              "relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2",
              isRoyal
                ? "border-gold shadow-[0_0_20px_rgba(255,215,0,0.6),0_0_40px_rgba(255,215,0,0.3)] royal-pfp-glow"
                : tier === "king"
                ? "border-gold shadow-gold-lg"
                : tier === "knight"
                ? "border-gold/40"
                : "border-white/10"
            )}
          >
            {user.pfp_url ? (
              <Image src={user.pfp_url} alt={user.display_name} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="w-full h-full bg-gold/10 flex items-center justify-center">
                <Crown className="w-8 h-8 text-gold/40" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold">{user.display_name}</h2>
              {isRoyal && (
                <span className="royal-badge">&#128081; ROYAL HOLDER</span>
              )}
              {!isRoyal && tier === "king" && <span className="king-badge">King</span>}
              {!isRoyal && tier === "knight" && <span className="knight-badge">Knight</span>}
            </div>
            <p className="text-sm text-white/40 mb-2">@{user.username}</p>
            {user.bio && <p className="text-sm text-white/60 mb-3 max-w-md">{user.bio}</p>}

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-white/30" />
                <span className="text-sm font-semibold">{formatNumber(user.follower_count)}</span>
                <span className="text-xs text-white/40">followers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-white/30" />
                <span className="text-sm font-semibold">{formatNumber(user.following_count)}</span>
                <span className="text-xs text-white/40">following</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Token Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-gold" />
          <h3 className="font-semibold">$KNTWS Holdings</h3>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold gold-text">{formatNumber(tokenBalance)}</p>
            <p className="text-xs text-white/40 mt-1">$KNTWS Tokens</p>
          </div>
          <div className="text-right">
            {isRoyal ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold/20 text-gold border border-gold/30">
                <Crown className="w-3.5 h-3.5" />
                Royal Holder
              </div>
            ) : (
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                tier === "king" ? "bg-gold/20 text-gold border border-gold/30" :
                tier === "knight" ? "bg-gold/10 text-gold/70 border border-gold/20" :
                "bg-white/5 text-white/40 border border-white/10"
              )}>
                <Shield className="w-3.5 h-3.5" />
                {tier === "king" ? "King Tier" : tier === "knight" ? "Knight Tier" : "No Tier"}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Wallet Info */}
      {user.custody_address && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="font-semibold text-sm mb-3">Connected Wallet</h3>
          <div className="flex items-center gap-3">
            <code className="text-sm text-gold/70 flex-1">{formatAddress(user.custody_address)}</code>
            <button
              onClick={() => navigator.clipboard.writeText(user.custody_address!)}
              className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-gold transition-colors"
              title="Copy address"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={`https://basescan.org/address/${user.custody_address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-gold transition-colors"
              title="View on BaseScan"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Token Contract */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-4 flex items-center justify-between"
      >
        <div>
          <p className="text-xs text-white/40">$KNTWS Contract</p>
          <code className="text-xs text-gold/50">{formatAddress(KNTWS_TOKEN_ADDRESS)}</code>
        </div>
        <a
          href={`https://basescan.org/token/${KNTWS_TOKEN_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-gold transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>

      {/* Sign Out */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={signOut}
        className="w-full py-3 rounded-xl border border-red-500/20 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </motion.button>
    </div>
  );
}
