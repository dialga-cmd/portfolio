"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiSteam } from "react-icons/si";
import SectionHeading from "./SectionHeading";
import SectionPose from "./SectionPose";
import { FEATURED_APPIDS, STEAM_PROFILE_URL, otherAchievements } from "@/data/steam";

interface GamingData {
  player: {
    personaName: string;
    avatar: string;
    profileUrl: string;
    memberSinceYear: number | null;
  } | null;
  steamLevel: number | null;
  ownedGamesCount: number | null;
  totalPlaytimeHours: number | null;
  recentlyPlayed: Array<{ appid: number; name: string; playtime2weeks: number }> | null;
  featured: Array<{
    appid: number;
    name: string;
    hoursPlayed: number;
    achievements: { unlocked: number; total: number; percent: number };
    perfect: boolean;
    rareUnlocks: Array<{ name: string; icon: string; game: string; percent: number; tier: "LEGENDARY" | "ULTRA RARE" | "RARE" | "COMMON" }>;
  }> | null;
}

const TIER_COLORS: Record<string, string> = {
  LEGENDARY: "var(--tier-legendary, #f59e0b)",
  "ULTRA RARE": "var(--tier-ultra, #a855f7)",
  RARE: "var(--tier-rare, #3b82f6)",
  COMMON: "var(--tier-common, #22d3ee)",
};

export default function Gaming() {
  const [data, setData] = useState<GamingData | null>(null);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);
  const [diagnose, setDiagnose] = useState(false);

  useEffect(() => {
    if (FEATURED_APPIDS.length === 0 && !STEAM_PROFILE_URL && otherAchievements.length === 0) {
      setVisible(false);
      return;
    }
    fetch("/api/steam", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setErrors(json.errors || []);
        if (json.ok && json.data) {
          const d = json.data as GamingData;
          if (d.player || (d.featured && d.featured.length)) {
            setData(d);
            setVisible(true);
            return;
          }
        }
        if (otherAchievements.length > 0 || STEAM_PROFILE_URL) {
          setVisible(true);
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          setDiagnose(true);
          setVisible(true);
        }
      })
      .catch((e) => {
        setErrors([{ endpoint: "fetch", status: 0, message: e.message }]);
        if (process.env.NODE_ENV !== "production") {
          setDiagnose(true);
          setVisible(true);
        }
      });
  }, []);

  if (!visible) return null;

  if (diagnose && process.env.NODE_ENV !== "production") {
    return (
      <section id="gaming" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading number="// 06" title="PLAYER PROFILE" />
          <div className="rounded-lg border-2 border-dashed border-amber-400/60 bg-black/40 p-6">
            <p className="text-lg font-semibold text-amber-300">GAMING SECTION HIDDEN</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-amber-100/80">
              {!process.env.NEXT_PUBLIC_STEAM_CHECK && !process.env.STEAM_API_KEY && <li>• env vars missing</li>}
              {errors.map((e, i) => (
                <li key={i}>
                  • {e.endpoint}: status {e.status} — {e.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  const profileUrl = (data && data.player && data.player.profileUrl) || STEAM_PROFILE_URL;
  const featured = (data && data.featured) ? data.featured : [];
  const totalAchUnlocked = featured.reduce((acc, f) => acc + f.achievements.unlocked, 0);
  const perfectGames = featured.filter((f) => f.perfect).length;
  const rareUnlocks: any[] = [];
  for (const f of featured) {
    for (const r of f.rareUnlocks || []) rareUnlocks.push(r);
  }
  rareUnlocks.sort((a, b) => a.percent - b.percent);

  return (
    <section id="gaming" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 06" title="PLAYER PROFILE" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg border border-emerald-400/30 bg-black/40 p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-4">
                {(data && data.player && data.player.avatar) && (
                  <Image
                    src={data.player.avatar}
                    alt={data.player.personaName}
                    width={64}
                    height={64}
                    className="rounded-full border border-emerald-400/40"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium text-emerald-100">{(data && data.player && data.player.personaName) || "Aditya"}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100/70">
                    {(data && data.steamLevel !== null) && <span className="rounded-full border border-emerald-400/40 px-2 py-0.5">LVL {data.steamLevel}</span>}
                    {(data && data.player && data.player.memberSinceYear) && <span>Member since {data.player.memberSinceYear}</span>}
                  </div>
                </div>
                {profileUrl && (
                  <Link
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-2 rounded-full border border-emerald-400/70 px-4 py-1.5 text-sm text-emerald-100 transition hover:bg-emerald-400/10"
                  >
                    <SiSteam />
                    View Steam profile
                  </Link>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(data && data.ownedGamesCount !== null) && <div className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100/80">Games owned {data.ownedGamesCount}</div>}
                {(data && data.totalPlaytimeHours !== null) && <div className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100/80">Total hours played {data.totalPlaytimeHours}</div>}
                {featured.length > 0 && <div className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100/80">Achievements unlocked {totalAchUnlocked}</div>}
                {featured.length > 0 && <div className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-100/80">Perfect games {perfectGames}</div>}
              </div>
            </div>
          </motion.div>
          <div className="flex justify-center">
            <SectionPose name="gaming-controller" />
          </div>
        </div>

        {featured.length > 0 && (
          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {featured.map((game) => (
              <div key={game.appid} className="group rounded-lg border border-emerald-400/30 bg-black/40 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.16)]">
                <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-400/10 text-lg font-semibold text-emerald-100">{game.name.slice(0, 2)}</div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-emerald-100">{game.name}</p>
                    <p className="text-xs text-emerald-100/60">{game.hoursPlayed}h</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-emerald-100/70">
                      <span>
                        {game.achievements.unlocked} / {game.achievements.total}
                      </span>
                      <span>{game.achievements.percent}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-emerald-400/15">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${game.achievements.percent}%` }} />
                    </div>
                  </div>
                  {game.perfect && <span className="self-start rounded-full border border-emerald-400/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald-300">100% PERFECT</span>}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {rareUnlocks.length > 0 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Rarest unlocks</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {rareUnlocks.slice(0, 6).map((r: any, idx: number) => (
                <div key={idx} className="min-w-[240px] rounded-lg border border-emerald-400/30 bg-black/40 p-3">
                  <div className="flex items-center gap-3">
                    {r.icon ? <Image src={r.icon} alt={r.name} width={32} height={32} /> : <div className="h-8 w-8 rounded bg-emerald-400/20" />}
                    <div>
                      <p className="text-sm text-emerald-100">{r.name}</p>
                      <p className="text-xs text-emerald-100/60">{r.game}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span style={{ color: TIER_COLORS[r.tier] }}>{r.tier}</span>
                    <span className="text-emerald-100/70">{r.percent.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {(data && data.recentlyPlayed && data.recentlyPlayed.length > 0) && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Recently played</p>
            <div className="flex flex-wrap gap-2">
              {data.recentlyPlayed.map((g) => (
                <div key={g.appid} className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-100/80">
                  {g.name} · {g.playtime2weeks}h last 2 weeks
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {otherAchievements.length > 0 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Other achievements</p>
            <div className="relative flex flex-col gap-4">
              <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-400/40 to-transparent sm:block" />
              {otherAchievements.map((ach, idx) => (
                <div key={idx} className="relative rounded-lg border border-emerald-400/30 bg-black/40 p-5 sm:ml-10">
                  <div className="absolute -left-6 top-6 hidden h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] sm:block" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-emerald-300">ACHIEVEMENT UNLOCKED</span>
                    <p className="text-base font-medium text-emerald-100">{ach.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-emerald-100/75">
                    {ach.game} · {ach.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <p className="mt-8 font-mono text-xs text-emerald-100/50">Data from Steam. Updated hourly.</p>
      </div>
    </section>
  );
}
