<p align="center">
  <img src="https://img.shields.io/badge/KNTWS-Sovereign_Client-FFD700?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwNTA1MDUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtMiA0IDMgMTJoMTRsMyAtMTIiLz48cGF0aCBkPSJNNSA5IDIgNGg1bDUgOCA1LTggNSAwIi8+PC9zdmc+&logoColor=050505&labelColor=050505" alt="KNTWS" />
</p>

<h1 align="center">
  <br />
  <img src="https://img.shields.io/badge/%F0%9F%91%91-KNTWS-FFD700?style=flat-square&labelColor=050505" width="80" />
  <br />
  KNTWS Sovereign Client
  <br />
  <sub><sup>Kai-Nova Web3</sup></sub>
</h1>

<p align="center">
  <strong>The sovereign Farcaster client powered by <code>$KNTWS</code> on Base.</strong>
  <br />
  Social meets DeFi — token-gated, AI-ready, and built for kings.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/thirdweb-v5-9945FF?style=flat-square&logo=thirdweb" alt="thirdweb" />
  <img src="https://img.shields.io/badge/Base-Chain-0052FF?style=flat-square&logo=coinbase" alt="Base" />
  <img src="https://img.shields.io/badge/Farcaster-Neynar-8B5CF6?style=flat-square" alt="Farcaster" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000?style=flat-square&logo=vercel" alt="Vercel" />
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#getting-started">Get Started</a> &bull;
  <a href="#token-gating">Token Gating</a> &bull;
  <a href="#deployment">Deploy</a>
</p>

---

## Overview

**KNTWS Sovereign Client** is a fully decentralized Farcaster client with integrated DeFi capabilities, built on the Base chain. It combines social networking with token economics, AI agent orchestration, and sovereign identity — all wrapped in a premium obsidian & gold UI.

```
  ┌──────────────────────────────────────────────────────┐
  │                  KNTWS SOVEREIGN CLIENT               │
  │                                                       │
  │   ┌─────────┐  ┌─────────────────────────────────┐   │
  │   │         │  │                                   │   │
  │   │  Royal  │  │        Sovereign Feed              │   │
  │   │ Sidebar │  │    (Farcaster + Token-Gated)       │   │
  │   │         │  │                                   │   │
  │   │  Home   │  │   ┌───────────────────────────┐   │   │
  │   │  Search │  │   │  Cast Card                 │   │   │
  │   │  Board  │  │   │  ♥ Like  ↻ Recast  💬 Reply│   │   │
  │   │  Shop   │  │   │  📤 Share  👑 Tip $KNTWS  │   │   │
  │   │  Agents │  │   └───────────────────────────┘   │   │
  │   │ Profile │  │                                   │   │
  │   │ Launch  │  │                                   │   │
  │   │         │  │                                   │   │
  │   │ ┌─────┐ │  │                                   │   │
  │   │ │$KNTWS│ │  │                                   │   │
  │   │ │Price │ │  │                                   │   │
  │   │ └─────┘ │  │                                   │   │
  │   └─────────┘  └─────────────────────────────────┘   │
  └──────────────────────────────────────────────────────┘
```

---

## Features

### Social Engine (Farcaster)
- **Sign in with Farcaster** via Neynar OAuth popup
- High-performance global trending feed from Neynar Snapchain
- Full cast interactions: Like, Recast, Reply, Share
- User search across the Farcaster network
- Profile view with follower/following stats

### Token-Gating (The Sovereignty)
| Tier | Requirement | Perks |
|------|------------|-------|
| **Knight** | 1+ $KNTWS | Verified Holder Badge, Standard UI |
| **King** | 1,000,000+ $KNTWS | Golden Glowing Border, Exclusive Access, Priority Feed |

- **Tipping**: Send `$KNTWS` tips directly on any cast
- Live token price widget in the sidebar (GeckoTerminal API)

### DeFi Hub
- **Shop/Swap**: Buy and sell `$KNTWS` via Uniswap on Base
- **Token Launcher**: Deploy new ERC-20 tokens using the Clanker contract
- **Leaderboard**: Top Holders and Top Engagers synced with Supabase

### Agent Terminal (AgentHub)
- Import AI agents by wallet address or Farcaster FID
- Agents render identically to human profiles with an "AI" badge
- OpenClaw integration hooks pre-built in `/lib/agents/`
- Agent capabilities tracking and status monitoring

### Royal UI
- Deep Obsidian (`#050505`) with 24K Gold (`#FFD700`) glassmorphism
- Framer Motion animations throughout
- Responsive sidebar with collapsible navigation
- Mobile-first design with adaptive layout

---

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── feed/          # Neynar feed proxy
│   │   ├── cast/
│   │   │   ├── react/     # Like & Recast
│   │   │   └── publish/   # Post new casts
│   │   ├── users/
│   │   │   └── search/    # User search
│   │   ├── token/
│   │   │   ├── price/     # $KNTWS price (GeckoTerminal)
│   │   │   └── deploy/    # Clanker token deployment
│   │   └── leaderboard/   # Supabase leaderboard
│   ├── layout.tsx         # Root layout + providers
│   ├── page.tsx           # Main SPA with tab routing
│   ├── providers.tsx      # ThirdwebProvider + AppProvider
│   └── globals.css        # Obsidian/Gold theme + utilities
├── components/
│   ├── auth/
│   │   └── SignInButton   # Farcaster OAuth
│   ├── feed/
│   │   └── CastCard       # Rich cast display
│   ├── layout/
│   │   ├── Sidebar        # Royal navigation
│   │   └── MobileHeader   # Mobile top bar
│   └── tabs/
│       ├── HomeTab         # Sovereign feed
│       ├── SearchTab       # User search
│       ├── LeaderboardTab  # Rankings
│       ├── ShopTab         # Swap UI
│       ├── AgentsTab       # Agent hub
│       ├── ProfileTab      # User profile
│       └── LaunchTab       # Token deployer
├── context/
│   └── AppContext.tsx      # Global state management
├── lib/
│   ├── agents/            # OpenClaw hooks (ready)
│   ├── constants.ts       # Addresses, ABIs, config
│   ├── neynar.ts          # Neynar API client
│   ├── supabase.ts        # Supabase client
│   ├── thirdweb.ts        # thirdweb client + Base chain
│   └── utils.ts           # Formatters + tier logic
└── types/
    └── index.ts           # TypeScript interfaces
```

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Neynar API key ([neynar.com](https://neynar.com))
- A thirdweb client ID ([thirdweb.com](https://thirdweb.com))
- A Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/Maliot100X/Kai-Nova-Web3.git
cd Kai-Nova-Web3

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

Run the SQL schema in your Supabase SQL editor:

```bash
# Located at: src/lib/supabase-schema.sql
```

This creates tables for: `users`, `leaderboard`, `agents`, `tips`, and `token_launches`.

---

## Token Gating

The $KNTWS token (`0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07`) on Base Chain powers the entire sovereignty system:

```
┌─────────────────────────────────────────────┐
│              TOKEN TIER SYSTEM               │
├──────────┬──────────────┬───────────────────┤
│  Tier    │  Threshold   │  Visual           │
├──────────┼──────────────┼───────────────────┤
│  None    │  0 tokens    │  Standard UI      │
│  Knight  │  1+ tokens   │  Gold Badge       │
│  King    │  1M+ tokens  │  Glowing Border   │
└──────────┴──────────────┴───────────────────┘
```

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Maliot100X/Kai-Nova-Web3)

1. Connect your GitHub repository
2. Add all environment variables from `.env.example`
3. Deploy

### Environment Variables for Vercel

| Variable | Description |
|----------|-------------|
| `NEYNAR_API_KEY` | Neynar API key for Farcaster |
| `NEXT_PUBLIC_NEYNAR_CLIENT_ID` | Neynar client ID (public) |
| `NEYNAR_SIGNER_UUID` | Neynar signer UUID |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | thirdweb client ID (public) |
| `THIRDWEB_SECRET_KEY` | thirdweb secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret |
| `MY_TOKEN_ADDRESS` | $KNTWS token contract |
| `CLANKER_CONTRACT` | Clanker deployer contract |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + Glassmorphism |
| Animation | Framer Motion |
| Web3 | thirdweb SDK v5 |
| Social | Neynar (Farcaster) |
| Database | Supabase (PostgreSQL) |
| Chain | Base (Coinbase L2) |
| Icons | Lucide React |
| Deploy | Vercel |

---

## Contract Addresses

| Contract | Address | Network |
|----------|---------|---------|
| $KNTWS Token | `0xC8E8f31A328E8300F9a463d7A8411bE2f6599b07` | Base |
| Clanker Deployer | `0xe85a59c628f7d27878aceb4bf3b35733630083a9` | Base |

---

## License

MIT License. Built with sovereignty in mind.

---

<p align="center">
  <sub>Built by the KNTWS Sovereign Team</sub>
  <br />
  <img src="https://img.shields.io/badge/Powered_by-$KNTWS-FFD700?style=flat-square&labelColor=050505" />
</p>
