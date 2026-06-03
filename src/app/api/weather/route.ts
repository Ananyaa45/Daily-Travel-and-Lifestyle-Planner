import { NextResponse } from "next/server";
import { getBangaloreWeatherContext } from "@/lib/weather";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const weather = await getBangaloreWeatherContext();
    return NextResponse.json({ weather });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Weather fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
