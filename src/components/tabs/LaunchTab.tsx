"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Type,
  Tag,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn, formatAddress } from "@/lib/utils";
import { CLANKER_CONTRACT_ADDRESS } from "@/lib/constants";

type LaunchStatus = "idle" | "deploying" | "success" | "error";

export function LaunchTab() {
  const { isAuthenticated } = useApp();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<LaunchStatus>("idle");
  const [deployedAddress, setDeployedAddress] = useState("");
  const [error, setError] = useState("");

  const handleDeploy = async () => {
    if (!name || !symbol) return;
    setStatus("deploying");
    setError("");

    try {
      const res = await fetch("/api/token/deploy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, symbol, imageUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Deployment failed");
      }

      const data = await res.json();
      setDeployedAddress(data.contract);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  const reset = () => {
    setName("");
    setSymbol("");
    setImageUrl("");
    setStatus("idle");
    setDeployedAddress("");
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Rocket className="w-16 h-16 text-gold/20" />
        <h2 className="text-xl font-bold text-white/60">Sign In Required</h2>
        <p className="text-sm text-white/30">Connect your Farcaster account to launch tokens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold gold-text">Token Launcher</h2>
      <p className="text-sm text-white/40">
        Deploy new tokens using the Clanker creator contract on Base. Compatible with Web, Farcaster Mini App, and Base Wallet.
      </p>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Token Ready!</h3>
          <p className="text-sm text-white/50 mb-4">
            Transaction prepared. Send it via your connected wallet to deploy on Base.
          </p>
          <div className="glass-panel rounded-xl p-4 mb-4">
            <p className="text-xs text-white/40 mb-1">Creator Contract</p>
            <code className="text-sm text-gold break-all">{deployedAddress}</code>
          </div>
          <div className="flex gap-3 justify-center">
            <a
              href={`https://basescan.org/address/${deployedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 glass-panel rounded-lg text-sm text-gold hover:text-gold-light transition-colors"
            >
              View on BaseScan <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gold-gradient rounded-lg text-obsidian text-sm font-semibold"
            >
              Launch Another
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <Type className="w-3.5 h-3.5" /> Token Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Token"
              className="w-full px-4 py-3 bg-carbon-50 border border-gold/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <Tag className="w-3.5 h-3.5" /> Token Symbol *
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="MAT"
              maxLength={10}
              className="w-full px-4 py-3 bg-carbon-50 border border-gold/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition-colors uppercase"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-white/50 mb-2">
              <ImageIcon className="w-3.5 h-3.5" /> Token Image URL (optional)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/token-logo.png"
              className="w-full px-4 py-3 bg-carbon-50 border border-gold/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition-colors"
            />
          </div>

          <div className="glass-panel rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40">Clanker Creator Contract</p>
              <code className="text-xs text-gold/50">{formatAddress(CLANKER_CONTRACT_ADDRESS)}</code>
            </div>
            <Rocket className="w-4 h-4 text-gold/30" />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleDeploy}
            disabled={status === "deploying" || !name || !symbol}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2",
              "bg-gold-gradient text-obsidian shadow-gold hover:shadow-gold-lg transition-shadow",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {status === "deploying" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Deployment...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Deploy Token on Base
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
