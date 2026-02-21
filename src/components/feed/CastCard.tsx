"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Repeat2, MessageCircle, Share2, Coins, Crown } from "lucide-react";
import type { Cast } from "@/types";
import { cn, timeAgo, getTierFromBalance, formatNumber } from "@/lib/utils";

interface CastCardProps {
  cast: Cast;
  onLike?: (hash: string) => void;
  onRecast?: (hash: string) => void;
  onReply?: (hash: string) => void;
  onTip?: (hash: string, fid: number) => void;
  userBalance?: number;
}

export function CastCard({ cast, onLike, onRecast, onReply, onTip, userBalance = 0 }: CastCardProps) {
  const [liked, setLiked] = useState(false);
  const [recasted, setRecasted] = useState(false);
  const [likeCount, setLikeCount] = useState(cast.reactions.likes.length);
  const [recastCount, setRecastCount] = useState(cast.reactions.recasts.length);

  const authorTier = getTierFromBalance(userBalance);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      onLike?.(cast.hash);
    }
  };

  const handleRecast = () => {
    if (!recasted) {
      setRecasted(true);
      setRecastCount((c) => c + 1);
      onRecast?.(cast.hash);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-panel-hover rounded-xl p-4",
        authorTier === "king" && "border-gold/30 king-glow"
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={cn(
          "relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2",
          authorTier === "king" ? "border-gold animate-gold-pulse" :
          authorTier === "knight" ? "border-gold/40" :
          "border-white/10"
        )}>
          {cast.author.pfp_url ? (
            <Image
              src={cast.author.pfp_url}
              alt={cast.author.display_name}
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

        <div className="flex-1 min-w-0">
          {/* Author header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-white truncate">
              {cast.author.display_name}
            </span>
            {authorTier === "king" && <span className="king-badge">King</span>}
            {authorTier === "knight" && <span className="knight-badge">Knight</span>}
            <span className="text-xs text-white/40">@{cast.author.username}</span>
            <span className="text-xs text-white/30">&middot;</span>
            <span className="text-xs text-white/30">{timeAgo(cast.timestamp)}</span>
          </div>

          {/* Cast text */}
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words mb-3">
            {cast.text}
          </p>

          {/* Embeds (images) */}
          {cast.embeds && cast.embeds.length > 0 && (
            <div className="mb-3 rounded-lg overflow-hidden border border-white/5">
              {cast.embeds
                .filter((e) => e.url && /\.(jpg|jpeg|png|gif|webp)/i.test(e.url))
                .map((embed, i) => (
                  <div key={i} className="relative w-full aspect-video">
                    <Image
                      src={embed.url!}
                      alt="Cast embed"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ActionButton
              icon={<MessageCircle className="w-4 h-4" />}
              count={cast.replies.count}
              onClick={() => onReply?.(cast.hash)}
              label="Reply"
            />
            <ActionButton
              icon={<Repeat2 className="w-4 h-4" />}
              count={recastCount}
              onClick={handleRecast}
              active={recasted}
              activeColor="text-emerald-400"
              label="Recast"
            />
            <ActionButton
              icon={<Heart className={cn("w-4 h-4", liked && "fill-current")} />}
              count={likeCount}
              onClick={handleLike}
              active={liked}
              activeColor="text-red-400"
              label="Like"
            />
            <ActionButton
              icon={<Share2 className="w-4 h-4" />}
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 10)}`
                );
              }}
              label="Share"
            />
            <ActionButton
              icon={<Coins className="w-4 h-4" />}
              onClick={() => onTip?.(cast.hash, cast.author.fid)}
              activeColor="text-gold"
              label="Tip $KNTWS"
              isGold
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ActionButton({
  icon,
  count,
  onClick,
  active,
  activeColor,
  label,
  isGold,
}: {
  icon: React.ReactNode;
  count?: number;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  label: string;
  isGold?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex items-center gap-1 px-2 py-1.5 rounded-lg text-white/40 hover:bg-white/5 transition-all",
        active && activeColor,
        isGold && "hover:text-gold"
      )}
    >
      {icon}
      {count !== undefined && count > 0 && (
        <span className="text-xs">{formatNumber(count)}</span>
      )}
    </button>
  );
}
