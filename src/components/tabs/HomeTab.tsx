"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Loader2, Sparkles, Send, Lock, ShoppingCart, AlertTriangle } from "lucide-react";
import { CastCard } from "@/components/feed/CastCard";
import { useApp } from "@/context/AppContext";
import { useKNTWS } from "@/hooks/useKNTWS";
import type { Cast } from "@/types";
import { formatNumber } from "@/lib/utils";

const CAST_GATE = 100_000;
const DEXSCREENER_URL =
  "https://dexscreener.com/base/0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";

export function HomeTab() {
  const { isAuthenticated, user } = useApp();
  const { canCast, balance, isLoading: balanceLoading } = useKNTWS();
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [castText, setCastText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const loadFeed = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (res.ok) {
        const data = await res.json();
        setCasts(data.casts || []);
      }
    } catch {
      // feed load failed silently
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeed();
  };

  const handlePost = async () => {
    if (!castText.trim() || !canCast || !user?.signer_uuid) return;
    setPosting(true);
    setPostError("");
    try {
      const res = await fetch("/api/cast/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: castText.trim(), signerUuid: user.signer_uuid }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error || "Cast failed");
      }
      setCastText("");
      setTimeout(loadFeed, 2000);
    } catch (err) {
      setPostError(err instanceof Error ? err.message : "Failed to cast");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (hash: string) => {
    try {
      await fetch("/api/cast/react", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hash, type: "like" }),
      });
    } catch {
      /* silent */
    }
  };

  const handleRecast = async (hash: string) => {
    try {
      await fetch("/api/cast/react", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hash, type: "recast" }),
      });
    } catch {
      /* silent */
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-lg">
            <Sparkles className="w-10 h-10 text-obsidian" />
          </div>
          <h2 className="text-2xl font-bold gold-text mb-2">Welcome to KNTWS</h2>
          <p className="text-white/50 max-w-md">
            Sign in with your Farcaster account to access the sovereign social feed and token-gated features.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gold-text">Sovereign Feed</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-gold/70 hover:text-gold text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Cast composer — gated at 100k */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <textarea
          value={castText}
          onChange={(e) => setCastText(e.target.value)}
          placeholder={
            canCast
              ? "Speak in the Kingdom..."
              : `Requires ${formatNumber(CAST_GATE)} $KNTWS to cast`
          }
          disabled={!canCast || posting}
          maxLength={320}
          rows={3}
          className="w-full bg-transparent text-sm text-white placeholder:text-white/20 resize-none focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between">
          {/* Gate status */}
          {balanceLoading ? (
            <span className="text-xs text-white/30 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Checking balance...
            </span>
          ) : canCast ? (
            <span className="text-xs text-emerald-400/70">
              ✓ {formatNumber(balance)} $KNTWS — casting enabled
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-gold/60 flex-shrink-0" />
              <span className="text-xs text-gold/60">
                Requires {formatNumber(CAST_GATE)} $KNTWS to speak in the Kingdom.{" "}
                <a
                  href={DEXSCREENER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gold transition-colors"
                >
                  Buy $KNTWS
                </a>
              </span>
            </div>
          )}

          {canCast ? (
            <button
              onClick={handlePost}
              disabled={posting || !castText.trim() || !user?.signer_uuid}
              className="flex items-center gap-2 px-4 py-2 bg-gold-gradient rounded-lg text-obsidian text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Cast
            </button>
          ) : (
            <a
              href={DEXSCREENER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-lg text-gold text-xs font-semibold hover:border-gold/30 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Get $KNTWS
            </a>
          )}
        </div>

        {postError && (
          <p className="text-xs text-red-400">{postError}</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : casts.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <p>No casts found. The feed is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {casts.map((cast) => (
            <CastCard
              key={cast.hash}
              cast={cast}
              onLike={handleLike}
              onRecast={handleRecast}
              userBalance={balance}
            />
          ))}
        </div>
      )}
    </div>
  );
}
