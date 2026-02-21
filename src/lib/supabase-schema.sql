-- ============================================
-- KNTWS Sovereign Client - Supabase Schema
-- ============================================

-- Users table (synced from Farcaster)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid BIGINT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  pfp_url TEXT,
  bio TEXT,
  custody_address TEXT,
  token_balance NUMERIC DEFAULT 0,
  tier TEXT DEFAULT 'none' CHECK (tier IN ('none', 'knight', 'king')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid BIGINT UNIQUE NOT NULL REFERENCES users(fid),
  username TEXT NOT NULL,
  display_name TEXT,
  pfp_url TEXT,
  token_balance NUMERIC DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  total_likes BIGINT DEFAULT 0,
  total_recasts BIGINT DEFAULT 0,
  total_casts BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  fid BIGINT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  capabilities TEXT[] DEFAULT '{}',
  created_by BIGINT REFERENCES users(fid),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tips tracking
CREATE TABLE IF NOT EXISTS tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_fid BIGINT NOT NULL REFERENCES users(fid),
  to_fid BIGINT NOT NULL REFERENCES users(fid),
  amount NUMERIC NOT NULL,
  cast_hash TEXT,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Token launches
CREATE TABLE IF NOT EXISTS token_launches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deployer_fid BIGINT NOT NULL REFERENCES users(fid),
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  token_address TEXT,
  image_url TEXT,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_fid ON users(fid);
CREATE INDEX IF NOT EXISTS idx_leaderboard_balance ON leaderboard(token_balance DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_engagement ON leaderboard(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_tips_from ON tips(from_fid);
CREATE INDEX IF NOT EXISTS idx_tips_to ON tips(to_fid);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_launches ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public read leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Public read agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Public read tips" ON tips FOR SELECT USING (true);
CREATE POLICY "Public read launches" ON token_launches FOR SELECT USING (true);
