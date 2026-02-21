import { NEYNAR_API_BASE } from "./constants";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;

function getHeaders(): Record<string, string> {
  return {
    accept: "application/json",
    api_key: NEYNAR_API_KEY,
  };
}

export async function fetchFeed(cursor?: string, limit = 25) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/feed?${params}`, {
    headers: getHeaders(),
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error(`Neynar feed error: ${res.status}`);
  return res.json();
}

export async function fetchUserByFid(fid: number) {
  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/user/bulk?fids=${fid}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Neynar user error: ${res.status}`);
  const data = await res.json();
  return data.users?.[0] ?? null;
}

export async function fetchUserCasts(fid: number, limit = 25) {
  const params = new URLSearchParams({ fid: String(fid), limit: String(limit) });
  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/feed/user/casts?${params}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Neynar casts error: ${res.status}`);
  return res.json();
}

export async function likeCast(signerUuid: string, castHash: string) {
  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/reaction`, {
    method: "POST",
    headers: { ...getHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      signer_uuid: signerUuid,
      reaction_type: "like",
      target: castHash,
    }),
  });

  if (!res.ok) throw new Error(`Like error: ${res.status}`);
  return res.json();
}

export async function recastCast(signerUuid: string, castHash: string) {
  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/reaction`, {
    method: "POST",
    headers: { ...getHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      signer_uuid: signerUuid,
      reaction_type: "recast",
      target: castHash,
    }),
  });

  if (!res.ok) throw new Error(`Recast error: ${res.status}`);
  return res.json();
}

export async function publishCast(signerUuid: string, text: string, parentHash?: string) {
  const body: Record<string, string> = { signer_uuid: signerUuid, text };
  if (parentHash) body.parent = parentHash;

  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/cast`, {
    method: "POST",
    headers: { ...getHeaders(), "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Cast error: ${res.status}`);
  return res.json();
}

export async function searchUsers(query: string) {
  const res = await fetch(`${NEYNAR_API_BASE}/farcaster/user/search?q=${encodeURIComponent(query)}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Search error: ${res.status}`);
  return res.json();
}
