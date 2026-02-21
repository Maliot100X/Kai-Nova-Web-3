"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, LogIn, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function SignInButton() {
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    try {
      const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
      const authUrl = `https://app.neynar.com/login?client_id=${clientId}`;

      const width = 500;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        "neynar-signin",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://app.neynar.com") return;
        if (event.data?.is_authenticated) {
          const u = event.data.user;
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
          popup?.close();
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      }, 500);
    } catch {
      setLoading(false);
    }
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
