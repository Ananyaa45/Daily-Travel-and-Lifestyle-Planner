import { BANGALORE } from "@/lib/weather/constants";

type OpenWeatherResponse = {
  main?: { temp?: number };
  weather?: Array<{ main?: string; description?: string; icon?: string }>;
};

function mapMaterialIcon(main: string): string {
  const key = main.toLowerCase();
  if (key === "clear") return "sunny";
  if (key === "clouds") return "cloud";
  if (key === "rain" || key === "drizzle") return "rainy";
  if (key === "thunderstorm") return "thunderstorm";
  if (key === "snow") return "ac_unit";
  if (key === "mist" || key === "fog" || key === "haze" || key === "smoke") {
    return "foggy";
  }
  return "partly_cloudy_day";
}

function formatCondition(description: string): string {
  return description
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function fetchBangaloreWeather(): Promise<{
  temperature: number;
  condition: string;
  icon: string;
} | null> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY?.trim();
  if (!apiKey) return null;

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", String(BANGALORE.lat));
  url.searchParams.set("lon", String(BANGALORE.lon));
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!res.ok) return null;

  const data = (await res.json()) as OpenWeatherResponse;
  const temp = data.main?.temp;
  const w = data.weather?.[0];
  if (temp === undefined || !w?.main) return null;

  return {
    temperature: Math.round(temp),
    condition: formatCondition(w.description ?? w.main),
    icon: mapMaterialIcon(w.main),
  };
}
