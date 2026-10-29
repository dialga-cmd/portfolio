export const FEATURED_APPIDS: number[] = [];

export const STEAM_PROFILE_URL: string = "";

export interface OtherAchievement {
  title: string;
  game: string;
  detail: string;
}

export const otherAchievements: OtherAchievement[] = [];

export interface SteamFallback {
  player: {
    personaName: string;
    avatar: string;
    profileUrl: string;
    memberSinceYear: number | null;
    onlineState?: string;
  } | null;
  steamLevel: number | null;
  ownedGamesCount: number | null;
  totalPlaytimeHours: number | null;
  recentlyPlayed: Array<{ appid: number; name: string; playtime2weeks: number; playtimeForever: number }> | null;
  featured: Array<{
    appid: number;
    name: string;
    hoursPlayed: number;
    achievements: { unlocked: number; total: number; percent: number };
    perfect: boolean;
    rareUnlocks: Array<{ name: string; icon: string; game: string; percent: number; tier: "LEGENDARY" | "ULTRA RARE" | "RARE" | "COMMON" }>;
  }> | null;
}

export const STEAM_FALLBACK: SteamFallback = {
  player: null,
  steamLevel: null,
  ownedGamesCount: null,
  totalPlaytimeHours: null,
  recentlyPlayed: null,
  featured: null,
};
