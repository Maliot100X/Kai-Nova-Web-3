"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Loader2, User, Crown } from "lucide-react";
import type { FarcasterUser } from "@/types";
import { formatNumber } from "@/lib/utils";

export function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FarcasterUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.users || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold gold-text">Search Users</h2>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search Farcaster users..."
            className="w-full pl-10 pr-4 py-2.5 bg-carbon-50 border border-gold/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/30 transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 bg-gold-gradient rounded-xl text-obsidian font-semibold text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-white/40 py-12">No users found</p>
      )}

      <div className="grid gap-3">
        {results.map((user, idx) => (
          <motion.div
            key={user.fid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel-hover rounded-xl p-4 flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/20 flex-shrink-0">
              {user.pfp_url ? (
                <Image src={user.pfp_url} alt={user.display_name} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="w-full h-full bg-gold/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold/50" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{user.display_name}</span>
                <Crown className="w-3 h-3 text-gold/40" />
              </div>
              <span className="text-xs text-white/40">@{user.username}</span>
              {user.bio && <p className="text-xs text-white/50 mt-1 line-clamp-1">{user.bio}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-white/60">{formatNumber(user.follower_count)} followers</p>
              <p className="text-xs text-white/40">{formatNumber(user.following_count)} following</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
