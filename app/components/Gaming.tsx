import Image from "next/image";
import Link from "next/link";
import { SiSteam } from "react-icons/si";
import SectionHeading from "./SectionHeading";
import SectionPose from "./SectionPose";
import GameCover from "./GameCover";
import { FEATURED_APPIDS, STEAM_PROFILE_URL } from "@/data/steam";
import { getSteamData } from "@/lib/steam";

const TIER_COLORS: Record<string, string> = {
  LEGENDARY: "var(--tier-legendary, #f59e0b)",
  "ULTRA RARE": "var(--tier-ultra, #a855f7)",
  RARE: "var(--tier-rare, #3b82f6)",
  COMMON: "var(--tier-common, #22d3ee)",
};

function formatMonthYear(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function isDemo(name: string) {
  const lower = name.toLowerCase();
  return lower.includes("demo") || lower.includes("playtest") || lower.includes("soundtrack");
}

export default async function Gaming() {
  const result = await getSteamData();
  const data = result.data as any;
  const errors = result.errors || [];

  const hasPlayer = !!data?.player;
  if (!hasPlayer && !result.ok) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <section id="gaming" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <SectionHeading number="// 06" title="PLAYER PROFILE" />
            <div className="rounded-lg border-2 border-dashed border-amber-400/60 bg-black/40 p-6">
              <p className="text-lg font-semibold text-amber-300">GAMING SECTION HIDDEN</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-amber-100/80">
                {errors.map((e: any, i: number) => (
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
    return null;
  }

  const profileUrl = data?.player?.profileUrl || STEAM_PROFILE_URL;

  let ownedList: any[] = data?.ownedGames || [];
  if (FEATURED_APPIDS.length > 0) {
    ownedList = FEATURED_APPIDS.map((id: number) => (ownedList.find((g: any) => g.appid === id))).filter(Boolean);
  } else {
    ownedList = ownedList
      .filter((g: any) => !isDemo(g.name))
      .sort((a: any, b: any) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
      .slice(0, 6);
  }

  const mostPlayedHours = ownedList.length ? Math.max(...ownedList.map((g: any) => Math.round((g.playtime_forever || 0) / 60))) : 1;

  const featured = data?.featured || [];
  const featuredMap = new Map(featured.map((f: any) => [f.appid, f]));
  const totalAchUnlocked = featured.reduce((acc: number, f: any) => acc + (f.achievements?.unlocked || 0), 0);
  const perfectGames = featured.filter((f: any) => f.perfect).length;

  const rareUnlocks: any[] = [];
  for (const f of featured) {
    for (const r of f.rareUnlocks || []) rareUnlocks.push(r);
  }
  rareUnlocks.sort((a, b) => a.percent - b.percent);

  const recentlyPlayed = (data?.recentlyPlayed || []).filter((g: any) => !isDemo(g.name)).slice(0, 3);
  const storeHeaders = data?.storeHeaders || {};

  return (
    <section id="gaming" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading number="// 06" title="PLAYER PROFILE" />
        {data?.player && (
          <div className="mb-12 mt-12 grid items-center gap-10 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6 rounded-lg border border-emerald-400/40 bg-gradient-to-r from-emerald-400/10 via-black/60 to-black/60 p-6 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-[88px] w-[88px] shrink-0">
                    {data.player.avatar && (
                      <Image
                        src={data.player.avatar}
                        alt={data.player.personaName}
                        width={88}
                        height={88}
                        className="rounded-full border-2 border-emerald-400/70"
                      />
                    )}
                    {data.steamLevel !== null && (
                      <span className="absolute -bottom-2 -right-2 rounded-full border border-emerald-400/70 bg-black px-2 py-0.5 text-xs text-emerald-100">
                        {data.steamLevel}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-emerald-100 sm:text-3xl">{data.player.personaName}</p>
                    <div className="mt-1 flex items-center gap-2 font-mono text-xs text-emerald-100/60">
                      <span>Steam member since {data.player.memberSinceYear}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                    </div>
                  </div>
                </div>
                {profileUrl && (
                  <Link
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-emerald-400/70 px-5 py-2 text-sm text-emerald-100 transition hover:bg-emerald-400/10"
                  >
                    <SiSteam />
                    View Steam profile
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {data.ownedGamesCount !== null && (
                  <div className="w-full rounded-lg border border-emerald-400/30 bg-black/40 px-4 py-3 text-center">
                    <p className="text-xl font-semibold text-emerald-100">{data.ownedGamesCount}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/50">Games owned</p>
                  </div>
                )}
                {data.totalPlaytimeHours !== null && (
                  <div className="w-full rounded-lg border border-emerald-400/30 bg-black/40 px-4 py-3 text-center">
                    <p className="text-xl font-semibold text-emerald-100">{data.totalPlaytimeHours}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/50">Hours played</p>
                  </div>
                )}
                {featured.length > 0 && (
                  <div className="w-full rounded-lg border border-emerald-400/30 bg-black/40 px-4 py-3 text-center">
                    <p className="text-xl font-semibold text-emerald-100">{totalAchUnlocked}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/50">Achievements unlocked</p>
                  </div>
                )}
                {featured.length > 0 && (
                  <div className="w-full rounded-lg border border-emerald-400/30 bg-black/40 px-4 py-3 text-center">
                    <p className="text-xl font-semibold text-emerald-100">{perfectGames}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/50">Perfect games</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <SectionPose name="gaming" />
            </div>
          </div>
        )}

        {ownedList.length > 0 && (
          <div className="mt-6">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Most played</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ownedList.map((game: any, idx: number) => {
                const hours = Math.round((game.playtime_forever || 0) / 60);
                const percent = mostPlayedHours ? Math.min(100, (hours / mostPlayedHours) * 100) : 0;
                const lastPlayed = formatMonthYear(game.rtime_last_played);
                const f: any = featuredMap.get(game.appid);
                return (
                  <div key={game.appid} className="group flex h-full flex-col overflow-hidden rounded-lg border border-emerald-400/30 bg-black/40 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.18)] focus-within:ring-2 focus-within:ring-emerald-400/60">
                    <div className="relative aspect-[16/7.5] w-full overflow-hidden">
                      <GameCover
                        appid={game.appid}
                        name={game.name}
                        storeHeader={storeHeaders[game.appid]}
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 font-mono text-xs text-emerald-100">{hours} HRS</span>
                      {idx < 3 && <span className="absolute left-2 top-2 rounded bg-emerald-400/80 px-2 py-0.5 text-xs text-black">#{idx + 1}</span>}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="truncate text-sm font-medium text-emerald-100">{game.name}</p>
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/50">
                        <span>{hours} hrs played</span>
                        {lastPlayed && <span>Last played {lastPlayed}</span>}
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-emerald-400/15">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${percent}%` }} />
                      </div>
                      {f && f.achievements && f.achievements.total > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-emerald-100/70">
                            <span>
                              {f.achievements.unlocked} / {f.achievements.total}
                            </span>
                            {f.perfect && <span className="rounded-full border border-amber-400/70 px-2 py-0.5 text-[10px] text-amber-300">100%</span>}
                          </div>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-emerald-400/15">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${f.achievements.percent}%` }} />
                          </div>
                        </div>
                      )}
                      <Link
                        href={`https://store.steampowered.com/app/${game.appid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center justify-center gap-2 rounded border border-emerald-400/70 py-1.5 text-sm text-emerald-100 transition group-hover:bg-emerald-400/10"
                      >
                        <SiSteam />
                        View on Steam
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {rareUnlocks.length > 0 && (
          <div className="mt-10">
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
          </div>
        )}

        {recentlyPlayed.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-400/70">Recently played</p>
            <div className="flex flex-wrap gap-3">
              {recentlyPlayed.map((g: any) => (
                <div key={g.appid} className="flex items-center gap-3 rounded-lg border border-emerald-400/30 bg-black/40 px-3 py-2">
                  <div className="relative h-14 w-[120px] overflow-hidden rounded">
                    <GameCover appid={g.appid} name={g.name} storeHeader={storeHeaders[g.appid]} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100">{g.name}</p>
                    <p className="text-xs text-emerald-100/60">{g.playtime2weeks} hrs last 2 weeks</p>
                    <Link href={`https://store.steampowered.com/app/${g.appid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400/80">
                      View on Steam
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 font-mono text-xs text-emerald-100/50">Data from Steam. Updated hourly.</p>
      </div>
    </section>
  );
}
