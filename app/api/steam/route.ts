import { NextResponse } from "next/server";
import { FEATURED_APPIDS, STEAM_FALLBACK, STEAM_PROFILE_URL } from "@/data/steam";

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

function getTier(percent: number): "LEGENDARY" | "ULTRA RARE" | "RARE" | "COMMON" {
  if (percent < 1) return "LEGENDARY";
  if (percent < 5) return "ULTRA RARE";
  if (percent < 15) return "RARE";
  return "COMMON";
}

function logEndpoint(name: string, status: number, empty: boolean) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[steam] ${name} status=${status} empty=${empty}`);
  }
}

export async function GET() {
  const errors: Array<{ endpoint: string; status: number | string; message: string }> = [];

  if (process.env.NODE_ENV !== "production") {
    if (!STEAM_ID || !/^\d{17}$/.test(STEAM_ID)) {
      errors.push({ endpoint: "validate", status: 0, message: "STEAM_ID must be the 17-digit SteamID64, not a vanity name" });
    }
  }

  if (!API_KEY || !STEAM_ID) {
    errors.push({ endpoint: "env", status: 0, message: "env vars missing" });
    if (STEAM_FALLBACK.player || STEAM_FALLBACK.featured) {
      return NextResponse.json({ ok: true, data: STEAM_FALLBACK, errors }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" } });
    }
    return NextResponse.json({ ok: false, data: null, errors }, { status: 200 });
  }

  try {
    const [playerRes, levelRes, ownedRes, recentRes] = await Promise.allSettled([
      fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`, { cache: "no-store" as RequestCache }),
      fetch(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${STEAM_ID}`, { cache: "no-store" as RequestCache }),
      fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&include_appinfo=1&include_played_free_games=1`, { cache: "no-store" as RequestCache }),
      fetch(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&count=3`, { cache: "no-store" as RequestCache }),
    ]);

    let player = null;
    if (playerRes.status === "fulfilled") {
      const status = playerRes.value.status;
      const json = await playerRes.value.json();
      const p = json?.response?.players?.[0];
      logEndpoint("GetPlayerSummaries", status, !p);
      if (!p) errors.push({ endpoint: "GetPlayerSummaries", status, message: "empty" });
      if (p) {
        player = {
          personaName: p.personaname,
          avatar: p.avatarfull || p.avatar,
          profileUrl: p.profileurl || STEAM_PROFILE_URL,
          memberSinceYear: p.timecreated ? new Date(p.timecreated * 1000).getFullYear() : null,
        };
      }
    } else {
      errors.push({ endpoint: "GetPlayerSummaries", status: 0, message: "failed" });
    }

    let steamLevel = null;
    if (levelRes.status === "fulfilled") {
      const status = levelRes.value.status;
      const json = await levelRes.value.json();
      steamLevel = json?.response?.player_level ?? null;
      logEndpoint("GetSteamLevel", status, steamLevel === null);
      if (steamLevel === null) errors.push({ endpoint: "GetSteamLevel", status, message: "empty" });
    } else {
      errors.push({ endpoint: "GetSteamLevel", status: 0, message: "failed" });
    }

    let ownedGamesCount = null;
    let totalPlaytimeHours = null;
    if (ownedRes.status === "fulfilled") {
      const status = ownedRes.value.status;
      const json = await ownedRes.value.json();
      ownedGamesCount = json?.response?.game_count ?? null;
      const games = json?.response?.games || [];
      if (games.length === 0) errors.push({ endpoint: "GetOwnedGames", status, message: "empty or private" });
      logEndpoint("GetOwnedGames", status, games.length === 0);
      let total = 0;
      for (const g of games) total += g.playtime_forever || 0;
      totalPlaytimeHours = games.length ? Math.round(total / 60) : null;
    } else {
      errors.push({ endpoint: "GetOwnedGames", status: 0, message: "failed" });
    }

    let recentlyPlayed = null;
    if (recentRes.status === "fulfilled") {
      const status = recentRes.value.status;
      const json = await recentRes.value.json();
      const games = json?.response?.games || [];
      logEndpoint("GetRecentlyPlayedGames", status, games.length === 0);
      recentlyPlayed = games.slice(0, 3).map((g: any) => ({
        appid: g.appid,
        name: g.name,
        playtime2weeks: Math.round((g.playtime_2weeks || 0) / 60),
        playtimeForever: Math.round((g.playtime_forever || 0) / 60),
      }));
    } else {
      errors.push({ endpoint: "GetRecentlyPlayedGames", status: 0, message: "failed" });
    }

    const featured: any[] = [];
    for (const appid of FEATURED_APPIDS) {
      const results = await Promise.allSettled([
        fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&appid=${appid}`, { cache: "no-store" as RequestCache }),
        fetch(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appid}`, { cache: "no-store" as RequestCache }),
        fetch(`https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?appid=${appid}`, { cache: "no-store" as RequestCache }),
      ]);

      let unlocked = 0;
      let total = 0;
      let achievedList: any[] = [];
      if (results[0].status === "fulfilled") {
        const status = results[0].value.status;
        const json = await results[0].value.json();
        achievedList = json?.playerstats?.achievements || [];
        unlocked = achievedList.filter((a: any) => a.achieved === 1).length;
        total = achievedList.length;
        logEndpoint(`GetPlayerAchievements(${appid})`, status, achievedList.length === 0);
        if (achievedList.length === 0) errors.push({ endpoint: `GetPlayerAchievements(${appid})`, status, message: "empty" });
      } else {
        errors.push({ endpoint: `GetPlayerAchievements(${appid})`, status: 0, message: "failed" });
      }

      let globalMap: Record<string, number> = {};
      if (results[2].status === "fulfilled") {
        const status = results[2].value.status;
        const json = await results[2].value.json();
        const list = json?.achievementpercentages?.achievements || [];
        logEndpoint(`GetGlobalAchievementPercentagesForApp(${appid})`, status, list.length === 0);
        for (const a of list) {
          globalMap[a.name] = a.percent;
        }
      }

      let gameName = "";
      if (results[1].status === "fulfilled") {
        const status = results[1].value.status;
        const json = await results[1].value.json();
        gameName = json?.game?.gameName || "";
        if (total === 0) total = json?.game?.availableGameStats?.achievements?.length || 0;
        logEndpoint(`GetSchemaForGame(${appid})`, status, !gameName);
      }

      let hoursPlayed = 0;
      if (ownedRes.status === "fulfilled") {
        const json = await ownedRes.value.json();
        const g = (json?.response?.games || []).find((x: any) => x.appid === appid);
        if (g) hoursPlayed = Math.round((g.playtime_forever || 0) / 60);
      }

      const rareUnlocks: any[] = [];
      for (const a of achievedList) {
        if (a.achieved === 1) {
          const p = globalMap[a.apiname] ?? globalMap[a.name] ?? 100;
          rareUnlocks.push({
            name: a.name || a.apiname,
            icon: a.icon,
            game: gameName,
            percent: p,
            tier: getTier(p),
          });
        }
      }
      rareUnlocks.sort((a, b) => a.percent - b.percent);

      featured.push({
        appid,
        name: gameName,
        hoursPlayed,
        achievements: { unlocked, total, percent: total ? Math.round((unlocked / total) * 100) : 0 },
        perfect: total > 0 && unlocked === total,
        rareUnlocks: rareUnlocks.slice(0, 6),
      });
    }

    const data = {
      player,
      steamLevel,
      ownedGamesCount,
      totalPlaytimeHours,
      recentlyPlayed,
      featured: featured.length ? featured : null,
    };

    const hasData = !!(data.player || data.featured);

    if (!hasData && (STEAM_FALLBACK.player || STEAM_FALLBACK.featured)) {
      return NextResponse.json({ ok: true, data: STEAM_FALLBACK, errors }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" } });
    }

    if (!hasData) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ ok: false, data: null, errors });
      }
      return NextResponse.json({ ok: false, data: null, errors });
    }

    return NextResponse.json({ ok: true, data, errors }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" } });
  } catch (e: any) {
    errors.push({ endpoint: "exception", status: 0, message: e?.message || "failed" });
    if (STEAM_FALLBACK.player || STEAM_FALLBACK.featured) {
      return NextResponse.json({ ok: true, data: STEAM_FALLBACK, errors }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" } });
    }
    return NextResponse.json({ ok: false, data: null, errors });
  }
}
