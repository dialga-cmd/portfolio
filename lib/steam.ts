import { FEATURED_APPIDS, STEAM_FALLBACK, STEAM_PROFILE_URL } from "@/data/steam";

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

function getTier(percent: number): "LEGENDARY" | "ULTRA RARE" | "RARE" | "COMMON" {
  if (percent < 1) return "LEGENDARY";
  if (percent < 5) return "ULTRA RARE";
  if (percent < 15) return "RARE";
  return "COMMON";
}

export async function getSteamData() {
  const errors: Array<{ endpoint: string; status: number | string; message: string }> = [];

  if (process.env.NODE_ENV !== "production") {
    if (!STEAM_ID || !/^\d{17}$/.test(STEAM_ID)) {
      errors.push({ endpoint: "validate", status: 0, message: "STEAM_ID must be the 17-digit SteamID64, not a vanity name" });
    }
  }

  if (!API_KEY || !STEAM_ID) {
    errors.push({ endpoint: "env", status: 0, message: "env vars missing" });
    if (STEAM_FALLBACK.player || STEAM_FALLBACK.featured) {
      return { ok: true, data: STEAM_FALLBACK, errors };
    }
    return { ok: false, data: null, errors };
  }

  const cacheOption = process.env.NODE_ENV !== "production" ? ("no-store" as RequestCache) : undefined;

  try {
    const fetchOpts = (process.env.NODE_ENV !== "production") ? { cache: "no-store" as RequestCache } : { next: { revalidate: 3600 } };
    const [playerRes, levelRes, ownedRes, recentRes] = await Promise.allSettled([
      fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`, fetchOpts),
      fetch(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${STEAM_ID}`, fetchOpts),
      fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&include_appinfo=1&include_played_free_games=1`, fetchOpts),
      fetch(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&count=3`, fetchOpts),
    ]);

    let player = null;
    if (playerRes.status === "fulfilled") {
      const status = playerRes.value.status;
      const json = await playerRes.value.json();
      const p = json?.response?.players?.[0];
      if (process.env.NODE_ENV !== "production") console.log(`[steam] GetPlayerSummaries status=${status} empty=${!p}`);
      if (!p) errors.push({ endpoint: "GetPlayerSummaries", status, message: "empty" });
      if (p) {
        player = {
          personaName: p.personaname,
          avatar: p.avatarfull || p.avatar,
          profileUrl: p.profileurl || STEAM_PROFILE_URL,
          memberSinceYear: p.timecreated ? new Date(p.timecreated * 1000).getFullYear() : null,
          onlineState: p.personastate ? "online" : (p.personastate !== undefined ? "offline" : undefined),
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
      if (process.env.NODE_ENV !== "production") console.log(`[steam] GetSteamLevel status=${status} empty=${steamLevel === null}`);
      if (steamLevel === null) errors.push({ endpoint: "GetSteamLevel", status, message: "empty" });
    } else {
      errors.push({ endpoint: "GetSteamLevel", status: 0, message: "failed" });
    }

    let ownedGamesCount = null;
    let totalPlaytimeHours = null;
    let ownedGames: any[] = [];
    if (ownedRes.status === "fulfilled") {
      const status = ownedRes.value.status;
      const json = await ownedRes.value.json();
      ownedGamesCount = json?.response?.game_count ?? null;
      ownedGames = json?.response?.games || [];
      if (ownedGames.length === 0) errors.push({ endpoint: "GetOwnedGames", status, message: "empty or private" });
      if (process.env.NODE_ENV !== "production") console.log(`[steam] GetOwnedGames status=${status} empty=${ownedGames.length === 0}`);
      let total = 0;
      for (const g of ownedGames) total += g.playtime_forever || 0;
      totalPlaytimeHours = ownedGames.length ? Math.round(total / 60) : null;
    } else {
      errors.push({ endpoint: "GetOwnedGames", status: 0, message: "failed" });
    }

    let recentlyPlayed = null;
    if (recentRes.status === "fulfilled") {
      const status = recentRes.value.status;
      const json = await recentRes.value.json();
      const games = json?.response?.games || [];
      if (process.env.NODE_ENV !== "production") console.log(`[steam] GetRecentlyPlayedGames status=${status} empty=${games.length === 0}`);
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
        fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&appid=${appid}`, fetchOpts),
        fetch(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${appid}`, fetchOpts),
        fetch(`https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?appid=${appid}`, fetchOpts),
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
        if (process.env.NODE_ENV !== "production") console.log(`[steam] GetPlayerAchievements(${appid}) status=${status} empty=${achievedList.length === 0}`);
        if (achievedList.length === 0) errors.push({ endpoint: `GetPlayerAchievements(${appid})`, status, message: "empty" });
      } else {
        errors.push({ endpoint: `GetPlayerAchievements(${appid})`, status: 0, message: "failed" });
      }

      let globalMap: Record<string, number> = {};
      if (results[2].status === "fulfilled") {
        const status = results[2].value.status;
        const json = await results[2].value.json();
        const list = json?.achievementpercentages?.achievements || [];
        if (process.env.NODE_ENV !== "production") console.log(`[steam] GetGlobalAchievementPercentagesForApp(${appid}) status=${status} empty=${list.length === 0}`);
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
        if (process.env.NODE_ENV !== "production") console.log(`[steam] GetSchemaForGame(${appid}) status=${status} empty=${!gameName}`);
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

    const storeHeaders: Record<number, string> = {};
    const gamesToFetch = [...ownedGames.slice(0, 12), ...(recentlyPlayed || []).map((g: any) => g)].map((g: any) => g.appid).filter((v: number, i: number, arr: number[]) => arr.indexOf(v) === i);
    await Promise.allSettled(
      gamesToFetch.map(async (appid: number) => {
        try {
          const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic`, { next: { revalidate: 86400 } });
          const json = await res.json();
          const img = json?.[appid]?.data?.header_image;
          if (img) storeHeaders[appid] = img;
        } catch {}
      })
    );

    const data = {
      player,
      steamLevel,
      ownedGamesCount,
      totalPlaytimeHours,
      ownedGames,
      storeHeaders,
      recentlyPlayed,
      featured: featured.length ? featured : null,
    };

    const hasData = !!data.player;

    if (!hasData && (STEAM_FALLBACK.player || STEAM_FALLBACK.featured)) {
      return { ok: true, data: STEAM_FALLBACK, errors };
    }

    if (!hasData) {
      return { ok: false, data: null, errors };
    }

    return { ok: true, data, errors };
  } catch (e: any) {
    errors.push({ endpoint: "exception", status: 0, message: e?.message || "failed" });
    if (STEAM_FALLBACK.player || STEAM_FALLBACK.featured) {
      return { ok: true, data: STEAM_FALLBACK, errors };
    }
    return { ok: false, data: null, errors };
  }
}
