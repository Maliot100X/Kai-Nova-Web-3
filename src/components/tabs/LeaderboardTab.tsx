"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Crown, Shield, Loader2, Medal } from "lucide-react";
import type { LeaderboardEntry } from "@/types";
import { formatNumber, cn } from "@/lib/utils";

type LeaderboardView = "holders" | "engagers";

export function LeaderboardTab() {
  const [view, setView] = useState<LeaderboardView>("holders");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?type=${view}`);
        if (res.ok) {
          const data = await res.json();
          setEntries(data.entries || []);
        }
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [view]);

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-gold" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-white/40 w-5 text-center">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gold-text">Leaderboard</h2>
        <div className="flex rounded-lg overflow-hidden border border-gold/10">
          {(["holders", "engagers"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                view === v ? "bg-gold text-obsidian" : "text-white/50 hover:text-white"
              )}
            >
              {v === "holders" ? "Top Holders" : "Top Engagers"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gold/20" />
          <p>No leaderboard data yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.fid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={cn(
                "glass-panel-hover rounded-xl p-4 flex items-center gap-4",
                entry.rank <= 3 && "border-gold/20"
              )}
            >
              <div className="w-8 flex justify-center">{rankIcon(entry.rank)}</div>

              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gold/20 flex-shrink-0">
                {entry.pfp_url ? (
                  <Image src={entry.pfp_url} alt={entry.display_name} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full bg-gold/10 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-gold/40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{entry.display_name}</span>
                  {entry.tier === "king" && <span className="king-badge">King</span>}
                  {entry.tier === "knight" && <span className="knight-badge">Knight</span>}
                </div>
                <span className="text-xs text-white/40">@{entry.username}</span>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gold">{formatNumber(entry.score)}</p>
                <p className="text-xs text-white/40 flex items-center gap-1 justify-end">
                  {view === "holders" ? (
                    <><Shield className="w-3 h-3" /> tokens</>
                  ) : (
                    "engagement"
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
