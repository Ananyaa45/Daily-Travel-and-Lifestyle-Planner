import { AQI_INDIA_RESOURCE_ID, BANGALORE } from "@/lib/weather/constants";

type AqiRecord = {
  city?: string;
  station?: string;
  pollutant_id?: string;
  pollutant_avg?: number | string | null;
  avg_value?: number | string | null;
};

function readAvg(row: AqiRecord): number | null {
  const raw = row.avg_value ?? row.pollutant_avg;
  if (raw === null || raw === undefined || raw === "NA" || raw === "") {
    return null;
  }
  const avg = Number(raw);
  return Number.isFinite(avg) ? avg : null;
}

/** Indian NAQI bucket labels (CPCB). */
export function aqiToLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

function parseRecords(records: AqiRecord[]): { aqi: number; label: string } | null {
  const stationMax = new Map<string, number>();

  for (const row of records) {
    const avg = readAvg(row);
    if (avg === null) continue;
    const station = row.station?.trim() || "city";
    stationMax.set(station, Math.max(stationMax.get(station) ?? 0, avg));
  }

  if (stationMax.size === 0) return null;

  const aqi = Math.round(Math.max(...Array.from(stationMax.values())));
  return { aqi, label: aqiToLabel(aqi) };
}

async function fetchAqiForCity(
  apiKey: string,
  city: string
): Promise<AqiRecord[]> {
  const url = new URL(
    `https://api.data.gov.in/resource/${AQI_INDIA_RESOURCE_ID}`
  );
  url.searchParams.set("api-key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "100");
  url.searchParams.set("filters[city]", city);

  const res = await fetch(url.toString(), {
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { records?: AqiRecord[] };
  return Array.isArray(data.records) ? data.records : [];
}

/**
 * City AQI from India's open data portal (CPCB real-time AQI dataset).
 * Uses max sub-index across stations, per CPCB guidance.
 */
export async function fetchBangaloreAqi(): Promise<{
  aqi: number;
  label: string;
} | null> {
  const apiKey = process.env.DATA_GOV_IN_API_KEY?.trim();
  if (!apiKey) return null;

  for (const city of [BANGALORE.aqiCity, "Bangalore", BANGALORE.name]) {
    const records = await fetchAqiForCity(apiKey, city);
    const parsed = parseRecords(records);
    if (parsed) return parsed;
  }

  return null;
}
