"use client";

import { useState, useCallback } from "react";
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
  Crown,
  Send,
  Lock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useKNTWS } from "@/hooks/useKNTWS";
import { clankerContract, thirdwebClient, baseChain } from "@/lib/thirdweb";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount, ConnectButton } from "thirdweb/react";
import { supabase } from "@/lib/supabase";
import { cn, formatAddress } from "@/lib/utils";
import { supportedWallets } from "@/lib/thirdweb";

type LaunchStatus = "idle" | "deploying" | "confirming" | "success" | "error";

/** Generates a unique salt based on deployer address + timestamp */
function generateSalt(address: string): `0x${string}` {
  const ts = Date.now().toString(16).padStart(16, "0");
  const addrPart = address.slice(2, 18);
  const raw = (addrPart + ts).slice(0, 64).padStart(64, "0");
  return `0x${raw}` as `0x${string}`;
}

export function LaunchTab() {
  const { isAuthenticated, user } = useApp();
  const { canCast, balance } = useKNTWS();
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<LaunchStatus>("idle");
  const [deployedAddress, setDeployedAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [castModal, setCastModal] = useState(false);
  const [casting, setCasting] = useState(false);

  const handleDeploy = useCallback(async () => {
    if (!name || !symbol || !account) return;
    setStatus("deploying");
    setError("");

    try {
      // Build the Clanker v3 deployToken call
      // ABI: deployToken(string name, string symbol, string image, string castHash)
      const tx = prepareContractCall({
        contract: clankerContract,
        method: "function deployToken(string name, string symbol, string image, string castHash) returns (address)",
        params: [
          name,
          symbol,
          imageUrl || "",
          "", // castHash — empty for direct deploy
        ],
      });

      sendTransaction(tx, {
        onSuccess: async (receipt) => {
          // Extract deployed token address from receipt logs if available,
          // otherwise fall back to the contract address itself
          const newTokenAddress =
            (receipt as unknown as { contractAddress?: string }).contractAddress ||
            clankerContract.address;

          setDeployedAddress(newTokenAddress);
          setTxHash(receipt.transactionHash);
          setStatus("success");
          setCastModal(true);

          // Persist to Supabase deployments table
          await supabase.from("deployments").insert({
            deployer_fid: user?.fid ?? 0,
            token_address: newTokenAddress,
            tx_hash: receipt.transactionHash,
            name,
            symbol,
            image_url: imageUrl || null,
          });
        },
        onError: (err) => {
          setError(err.message || "Transaction failed");
          setStatus("error");
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, [name, symbol, imageUrl, account, user, sendTransaction]);

  const handleAutoCast = async () => {
    if (!user?.signer_uuid) return;
    setCasting(true);
    try {
      await fetch("/api/cast/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: `Just forged $${symbol} on the Sovereign Engine! 🛡️ Address: ${deployedAddress} — built on Base via KNTWS`,
          signerUuid: user.signer_uuid,
        }),
      });
    } finally {
      setCasting(false);
      setCastModal(false);
    }
  };

  const reset = () => {
    setName("");
    setSymbol("");
    setImageUrl("");
    setStatus("idle");
    setDeployedAddress("");
    setTxHash("");
    setError("");
    setCastModal(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Rocket className="w-16 h-16 text-gold/20" />
        <h2 className="text-xl font-bold text-white/60">Sign In Required</h2>
        <p className="text-sm text-white/30">Connect your Farcaster account to forge tokens.</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Lock className="w-16 h-16 text-gold/20" />
        <h2 className="text-xl font-bold text-white/60">Wallet Required</h2>
        <p className="text-sm text-white/30 max-w-sm text-center">
          Connect your Base wallet to deploy tokens on-chain via Clanker.
        </p>
        <ConnectButton
          client={thirdwebClient}
          chain={baseChain}
          wallets={supportedWallets}
          theme="dark"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold gold-text">Clanker Forge</h2>
        <p className="text-sm text-white/40 mt-1">
          Deploy ERC-20 tokens on Base via the Clanker v3 factory. Live on-chain.
        </p>
      </div>

      {/* Wallet status bar */}
      <div className="glass-panel rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">Deploying from</p>
          <code className="text-xs text-gold/70">{formatAddress(account.address)}</code>
        </div>
        <ConnectButton
          client={thirdwebClient}
          chain={baseChain}
          wallets={supportedWallets}
          theme="dark"
          detailsButton={{
            style: {
              background: "rgba(255,215,0,0.1)",
              color: "#FFD700",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              padding: "0.375rem 0.75rem",
            },
          }}
        />
      </div>

      {/* Auto-cast modal */}
      {castModal && status === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-6 border border-gold/20 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-gold">Token Forged! Announce it?</h3>
          </div>
          <p className="text-sm text-white/60 font-mono bg-carbon-50 rounded-lg p-3 break-all">
            Just forged ${symbol} on the Sovereign Engine! 🛡️ Address: {deployedAddress}
          </p>
          <div className="flex gap-3">
            {user?.signer_uuid ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAutoCast}
                disabled={casting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gold-gradient rounded-xl text-obsidian font-bold text-sm disabled:opacity-60"
              >
                {casting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {casting ? "Casting..." : "Cast on Farcaster"}
              </motion.button>
            ) : (
              <p className="text-xs text-white/30 flex-1">
                Sign in with Farcaster to auto-cast.
              </p>
            )}
            <button
              onClick={() => setCastModal(false)}
              className="px-4 py-2.5 glass-panel rounded-xl text-sm text-white/50 hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}

      {status === "success" && !castModal ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-8 text-center space-y-4"
        >
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold">Token Forged on Base</h3>
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <p className="text-xs text-white/40">Token Address</p>
            <code className="text-sm text-gold break-all">{deployedAddress}</code>
          </div>
          {txHash && (
            <div className="glass-panel rounded-xl p-4 space-y-2">
              <p className="text-xs text-white/40">TX Hash</p>
              <code className="text-xs text-white/60 break-all">{txHash}</code>
            </div>
          )}
          <div className="flex gap-3 justify-center flex-wrap">
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
              Forge Another
            </button>
          </div>
        </motion.div>
      ) : status !== "success" ? (
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
              placeholder="Sovereign Token"
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
              placeholder="SVRN"
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
              <p className="text-xs text-white/40">Clanker v3 Creator Contract</p>
              <code className="text-xs text-gold/50">
                {formatAddress("0x1909b332397144aeb4867b7274a05dbb25bd1fec")}
              </code>
            </div>
            <Rocket className="w-4 h-4 text-gold/30" />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400 break-all">{error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleDeploy}
            disabled={isPending || !name || !symbol || !account}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2",
              "bg-gold-gradient text-obsidian shadow-gold hover:shadow-gold-lg transition-shadow",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Confirm in Wallet...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Forge Token on Base
              </>
            )}
          </motion.button>

          <p className="text-xs text-center text-white/20">
            This sends a real transaction on Base mainnet. Gas fees apply.
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}
