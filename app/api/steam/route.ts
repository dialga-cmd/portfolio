import { NextResponse } from "next/server";
import { getSteamData } from "@/lib/steam";

export async function GET() {
  const result = await getSteamData();
  if (result.ok) {
    return NextResponse.json(result, { headers: { "Cache-Control": process.env.NODE_ENV === "production" ? "s-maxage=3600, stale-while-revalidate" : "no-store" } });
  }
  return NextResponse.json(result, { status: 200, headers: { "Cache-Control": "no-store" } });
}
