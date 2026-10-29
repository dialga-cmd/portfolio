"use client";

import { useState } from "react";

interface GameCoverProps {
  appid: number;
  name: string;
  storeHeader?: string | null;
  className?: string;
  sizes?: string;
}

export default function GameCover({ appid, name, storeHeader, className = "", sizes }: GameCoverProps) {
  const candidates = [
    `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`,
    storeHeader,
  ].filter(Boolean) as string[];

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const monogram = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (failed || idx >= candidates.length) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-emerald-900/40 to-black ${className}`} style={{ aspectRatio: "16/7.5" }}>
        <span className="text-lg font-semibold tracking-[0.3em] text-emerald-100/60">{monogram}</span>
      </div>
    );
  }

  return (
    <img
      src={candidates[idx]}
      alt={name}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx + 1 < candidates.length) {
          setIdx(idx + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
