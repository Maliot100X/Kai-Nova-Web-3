"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, LogIn, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const NEYNAR_CLIENT_ID = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!;
const NEYNAR_LOGIN_URL = "https://app.neynar.com/login";

// Accept messages from both kainova.xyz and www.kainova.xyz as well as the Neynar auth popup
const ALLOWED_ORIGINS = [
  "https://app.neynar.com",
  "https://kainova.xyz",
  "https://www.kainova.xyz",
];

export function SignInButton() {
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Allow Neynar auth popup plus both kainova domains
      const origin = event.origin.replace(/\/$/, "");
      if (!ALLOWED_ORIGINS.includes(origin)) return;

      const data = event.data;
      if (data && data.is_authenticated && data.user) {
        const u = data.user;
        setUser({
          fid: u.fid,
          username: u.username,
          display_name: u.display_name,
          pfp_url: u.pfp_url,
          bio: u.profile?.bio?.text,
          follower_count: u.follower_count || 0,
          following_count: u.following_count || 0,
          verifications: u.verifications,
          custody_address: u.custody_address,
        });
        setLoading(false);
      }
    },
    [setUser]
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
    // Pass the canonical domain so Neynar can redirect back correctly
    const canonicalOrigin =
      typeof window !== "undefined"
        ? window.location.origin.replace("www.", "")
        : "https://kainova.xyz";
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

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setLoading(false);
      }
    }, 500);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSignIn}
      disabled={loading}
      className="flex items-center gap-3 px-6 py-3 bg-gold-gradient rounded-xl text-obsidian font-bold text-sm shadow-gold hover:shadow-gold-lg transition-shadow disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Crown className="w-5 h-5" />
          <span>Sign in with Farcaster</span>
          <LogIn className="w-4 h-4" />
        </>
      )}
    </motion.button>
  );
}
