"use client";

import { useState, useCallback, useEffect } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { motion } from "framer-motion";
import { Crown, LogIn, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { thirdwebClient, baseChain, supportedWallets } from "@/lib/thirdweb";
import { supabase } from "@/lib/supabase";
import type { FarcasterUser } from "@/types";

const NEYNAR_CLIENT_ID = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!;
const NEYNAR_LOGIN_URL = "https://app.neynar.com/login";

/** Syncs authenticated Farcaster user + wallet address to Supabase users table */
async function syncUserToSupabase(user: FarcasterUser, walletAddress?: string) {
  try {
    await supabase.from("users").upsert(
      {
        fid: user.fid,
        wallet_address: walletAddress || user.custody_address || null,
        custody_address: user.custody_address || null,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
        bio: user.bio || null,
        follower_count: user.follower_count,
        following_count: user.following_count,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "fid" }
    );
  } catch (err) {
    console.error("Supabase sync failed:", err);
  }
}

export function SignInButton() {
  const { setUser, user } = useApp();
  const [loading, setLoading] = useState(false);
  const account = useActiveAccount();

  // When wallet connects after Farcaster sign-in, sync updated address
  useEffect(() => {
    if (user && account?.address) {
      syncUserToSupabase(user, account.address);
    }
  }, [account?.address, user]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Accept messages from Neynar auth or same origin
      const allowedOrigins = [
        "https://app.neynar.com",
        "https://kainova.xyz",
        "https://www.kainova.xyz",
        typeof window !== "undefined" ? window.location.origin : "",
      ].filter(Boolean);

      const origin = event.origin.replace(/\/$/, "");
      if (!allowedOrigins.includes(origin)) return;

      const data = event.data as Record<string, unknown>;
      if (!data?.is_authenticated || !data?.user) return;

      const u = data.user as Record<string, unknown>;
      const profile = u.profile as Record<string, unknown> | undefined;
      const bio = profile?.bio as Record<string, unknown> | undefined;

      const farcasterUser: FarcasterUser = {
        fid: u.fid as number,
        username: u.username as string,
        display_name: (u.display_name as string) || (u.username as string),
        pfp_url: (u.pfp_url as string) || "",
        bio: bio?.text as string | undefined,
        follower_count: (u.follower_count as number) || 0,
        following_count: (u.following_count as number) || 0,
        verifications: u.verifications as string[] | undefined,
        custody_address: u.custody_address as string | undefined,
        signer_uuid: u.signer_uuid as string | undefined,
      };

      setUser(farcasterUser);
      syncUserToSupabase(farcasterUser, account?.address);
      setLoading(false);
    },
    [setUser, account?.address]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  function handleSignIn() {
    if (!NEYNAR_CLIENT_ID) {
      console.error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not set");
      return;
    }

    setLoading(true);

    const authUrl = new URL(NEYNAR_LOGIN_URL);
    authUrl.searchParams.set("client_id", NEYNAR_CLIENT_ID);
    // Use canonical (non-www) origin as redirect_uri
    const canonicalOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.kainova.xyz";
    authUrl.searchParams.set("redirect_uri", canonicalOrigin);

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl.toString(),
      "neynar-siwf",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );

    if (!popup) {
      setLoading(false);
      return;
    }

    // Detect when user closes popup without completing
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Thirdweb wallet connector — Base mainnet, Coinbase Smart Wallet + MetaMask + inApp */}
      <ConnectButton
        client={thirdwebClient}
        chain={baseChain}
        wallets={supportedWallets}
        theme="dark"
        connectButton={{
          label: "Connect Wallet",
          style: {
            background: "linear-gradient(135deg, #FFD700, #B8860B)",
            color: "#050505",
            fontWeight: "700",
            fontSize: "0.875rem",
            borderRadius: "0.75rem",
            padding: "0.625rem 1.25rem",
            border: "none",
          },
        }}
        detailsButton={{
          style: {
            background: "rgba(255,215,0,0.1)",
            color: "#FFD700",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "0.75rem",
          },
        }}
      />

      {/* Neynar SIWN — Farcaster identity */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-gold-gradient rounded-xl text-obsidian font-bold text-sm shadow-gold hover:shadow-gold-lg transition-shadow disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Crown className="w-4 h-4" />
            <span>Farcaster Sign In</span>
            <LogIn className="w-3.5 h-3.5" />
          </>
        )}
      </motion.button>
    </div>
  );
}
