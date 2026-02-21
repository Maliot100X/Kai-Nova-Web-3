"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Plus,
  X,
  Loader2,
  Wifi,
  WifiOff,
  Cpu,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { AgentEntry } from "@/types";
import { formatAddress } from "@/lib/utils";

export function AgentsTab() {
  const { agents, addAgent, removeAgent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    wallet_address: "",
    fid: "",
    display_name: "",
    avatar_url: "",
    bio: "",
    capabilities: "",
  });
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!formData.wallet_address || !formData.display_name) return;
    setImporting(true);

    await new Promise((r) => setTimeout(r, 800));

    const newAgent: AgentEntry = {
      id: `agent-${Date.now()}`,
      wallet_address: formData.wallet_address,
      fid: formData.fid ? parseInt(formData.fid) : undefined,
      display_name: formData.display_name,
      avatar_url: formData.avatar_url || "/api/avatar/default",
      bio: formData.bio || "AI Agent on KNTWS",
      is_agent: true,
      status: "online",
      capabilities: formData.capabilities.split(",").map((s) => s.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    };

    addAgent(newAgent);
    setFormData({ wallet_address: "", fid: "", display_name: "", avatar_url: "", bio: "", capabilities: "" });
    setShowForm(false);
    setImporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gold-text">Agent Hub</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-gradient rounded-xl text-obsidian font-semibold text-sm shadow-gold hover:shadow-gold-lg transition-shadow"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Import Agent"}
        </button>
      </div>

      {/* Import Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-gold" />
                <h3 className="font-semibold text-sm">Import Agent</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Agent Wallet Address *</label>
                  <input
                    type="text"
                    value={formData.wallet_address}
                    onChange={(e) => setFormData((p) => ({ ...p, wallet_address: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-3 py-2 bg-carbon-50 border border-gold/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Farcaster FID (optional)</label>
                  <input
                    type="number"
                    value={formData.fid}
                    onChange={(e) => setFormData((p) => ({ ...p, fid: e.target.value }))}
                    placeholder="123456"
                    className="w-full px-3 py-2 bg-carbon-50 border border-gold/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Display Name *</label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData((p) => ({ ...p, display_name: e.target.value }))}
                    placeholder="Agent Alpha"
                    className="w-full px-3 py-2 bg-carbon-50 border border-gold/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Avatar URL (optional)</label>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData((p) => ({ ...p, avatar_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-carbon-50 border border-gold/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="What does this agent do?"
                  rows={2}
                  className="w-full px-3 py-2 bg-carbon-50 border border-gold/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Capabilities (comma-separated)</label>
                <input
                  type="text"
                  value={formData.capabilities}
                  onChange={(e) => setFormData((p) => ({ ...p, capabilities: e.target.value }))}
                  placeholder="trading, casting, analysis"
                  className="w-full px-3 py-2 bg-carbon-50 border border-gold/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30"
                />
              </div>

              <button
                onClick={handleImport}
                disabled={importing || !formData.wallet_address || !formData.display_name}
                className="w-full py-2.5 bg-gold-gradient rounded-xl text-obsidian font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                {importing ? "Importing..." : "Import Agent"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent List */}
      {agents.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gold/20" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">No Agents Yet</h3>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            Import your first AI agent by clicking the button above. Agents appear alongside human users but carry an AI badge.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel-hover rounded-xl p-4 relative group"
            >
              <button
                onClick={() => removeAgent(agent.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/20 flex-shrink-0">
                  {agent.avatar_url && !agent.avatar_url.includes("/api/") ? (
                    <Image src={agent.avatar_url} alt={agent.display_name} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="w-full h-full bg-gold/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-gold/50" />
                    </div>
                  )}
                  {/* AI Badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white text-[8px] font-bold px-1 rounded-full border border-obsidian">
                    AI
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{agent.display_name}</span>
                    {agent.status === "online" ? (
                      <Wifi className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <p className="text-xs text-white/40 mb-2">{formatAddress(agent.wallet_address)}</p>
                  <p className="text-xs text-white/50 line-clamp-2 mb-2">{agent.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((cap) => (
                      <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold/60 border border-gold/10">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* OpenClaw Teaser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-2xl p-6 text-center"
      >
        <Sparkles className="w-8 h-8 text-gold/30 mx-auto mb-3" />
        <h3 className="font-semibold text-sm text-white/60 mb-1">OpenClaw Integration</h3>
        <p className="text-xs text-white/30 max-w-sm mx-auto">
          OpenClaw protocol hooks are ready in <code className="text-gold/50">/lib/agents/</code>. Advanced autonomous agent orchestration coming soon.
        </p>
      </motion.div>
    </div>
  );
}
