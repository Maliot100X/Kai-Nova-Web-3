"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Loader2, Sparkles } from "lucide-react";
import { CastCard } from "@/components/feed/CastCard";
import { useApp } from "@/context/AppContext";
import type { Cast } from "@/types";

export function HomeTab() {
  const { isAuthenticated } = useApp();
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (res.ok) {
        const data = await res.json();
        setCasts(data.casts || []);
      }
    } catch {
      // feed load failed
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

  const handleLike = async (hash: string) => {
    try {
      await fetch("/api/cast/react", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hash, type: "like" }),
      });
    } catch { /* silent */ }
  };

  const handleRecast = async (hash: string) => {
    try {
      await fetch("/api/cast/react", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hash, type: "recast" }),
      });
    } catch { /* silent */ }
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
            Sign in with your Farcaster account to access the sovereign social feed, token-gated features, and more.
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
