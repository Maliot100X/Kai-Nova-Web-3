"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Loader2,
  Send,
  RefreshCw,
  Lock,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { useKNTWS } from "@/hooks/useKNTWS";
import { supabase } from "@/lib/supabase";
import { cn, timeAgo, formatNumber } from "@/lib/utils";

const GOLDEN_GATE = 1_000_000;
const DEXSCREENER_URL =
  "https://dexscreener.com/base/0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07";

interface GoldenCast {
  cast_hash: string;
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  content: string;
  created_at: string;
}

export function GoldenCastsTab() {
  const { isAuthenticated, user } = useApp();
  const { canGoldenCast, balance, isLoading: balanceLoading } = useKNTWS();
  const [casts, setCasts] = useState<GoldenCast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [castText, setCastText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const loadGoldenFeed = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("golden_casts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) setCasts(data as GoldenCast[]);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadGoldenFeed();
  }, [loadGoldenFeed]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadGoldenFeed();
  };

  const handlePost = async () => {
    if (!castText.trim() || !canGoldenCast || !user) return;
    setPosting(true);
    setPostError("");
    try {
      const castHash = `golden-${user.fid}-${Date.now()}`;

      // 1. Publish to Farcaster via Neynar if signer_uuid available
      if (user.signer_uuid) {
        await fetch("/api/cast/publish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            text: `👑 [GOLDEN CAST] ${castText.trim()}`,
            signerUuid: user.signer_uuid,
          }),
        });
      }

      // 2. Persist to Supabase golden_casts
      await supabase.from("golden_casts").insert({
        cast_hash: castHash,
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
        content: castText.trim(),
      });

      setCastText("");
      await loadGoldenFeed();
    } catch (err) {
      setPostError(err instanceof Error ? err.message : "Failed to cast");
    } finally {
      setPosting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Crown className="w-16 h-16 text-gold/20" />
        <h2 className="text-xl font-bold text-white/60">Sign In Required</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
            <Crown className="w-4 h-4 text-obsidian" />
          </div>
          <div>
            <h2 className="text-xl font-bold gold-text">Golden Casts</h2>
            <p className="text-xs text-gold/40">Exclusive to 1,000,000+ $KNTWS holders</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-gold/70 hover:text-gold text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
        </button>
      </div>

      {/* Gate banner for non-sovereign users */}
      {!canGoldenCast && !balanceLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-4 border border-gold/20 flex items-start gap-3"
        >
          <Lock className="w-5 h-5 text-gold/50 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gold/80">
              Sovereign Gate — 1,000,000 $KNTWS Required
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              You hold {formatNumber(balance)} $KNTWS. Need{" "}
              {formatNumber(GOLDEN_GATE - balance)} more to speak here.
            </p>
            <a
              href={DEXSCREENER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs text-gold font-semibold hover:underline"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Acquire $KNTWS on DexScreener
            </a>
          </div>
        </motion.div>
      )}

      {/* Composer — only shown if sovereign */}
      {canGoldenCast && (
        <div className="golden-cast-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold text-gold">Sovereign Broadcast</span>
          </div>
          <textarea
            value={castText}
            onChange={(e) => setCastText(e.target.value)}
            placeholder="Speak with sovereign authority..."
            disabled={posting}
            maxLength={320}
            rows={3}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/30 resize-none focus:outline-none disabled:opacity-40"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gold/50">{castText.length}/320</span>
            <button
              onClick={handlePost}
              disabled={posting || !castText.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gold-gradient rounded-lg text-obsidian text-xs font-bold disabled:opacity-40 transition-opacity"
            >
              {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Golden Cast
            </button>
          </div>
          {postError && <p className="text-xs text-red-400">{postError}</p>}
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : casts.length === 0 ? (
        <div className="text-center py-20 text-white/30 space-y-2">
          <Crown className="w-12 h-12 mx-auto text-gold/10" />
          <p>No golden casts yet. Be the first sovereign voice.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {casts.map((cast) => (
            <GoldenCastCard key={cast.cast_hash} cast={cast} />
          ))}
        </div>
      )}
    </div>
  );
}

function GoldenCastCard({ cast }: { cast: GoldenCast }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="golden-cast-card rounded-xl p-4"
    >
      <div className="flex gap-3">
        {/* Avatar with sovereign glow + crown badge */}
        <div className="relative flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gold sovereign-pfp-ring">
            {cast.pfp_url ? (
              <Image
                src={cast.pfp_url}
                alt={cast.display_name}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full bg-gold/20 flex items-center justify-center">
                <Crown className="w-4 h-4 text-gold" />
              </div>
            )}
          </div>
          {/* Crown badge overlay */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center border border-obsidian">
            <Crown className="w-2.5 h-2.5 text-obsidian" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-white">{cast.display_name}</span>
            <span className="sovereign-badge">👑 Sovereign</span>
            <span className="text-xs text-white/30">@{cast.username}</span>
            <span className="text-xs text-white/20">&middot;</span>
            <span className="text-xs text-white/20">{timeAgo(cast.created_at)}</span>
          </div>
          <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words">
            {cast.content}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
