import type { WeatherInfo } from "@/lib/types/home";
import { MOCK_WEATHER } from "@/lib/mock/homePlan";
import { fetchBangaloreAqi } from "@/lib/weather/aqiIndia";
import { fetchBangaloreWeather } from "@/lib/weather/openWeather";

/**
 * Live weather + AQI for Bangalore. Falls back to mock values when APIs
 * are unavailable or keys are missing.
 */
export async function getBangaloreWeatherContext(): Promise<WeatherInfo> {
  const [weather, aqi] = await Promise.all([
    fetchBangaloreWeather(),
    fetchBangaloreAqi(),
  ]);

  if (!weather) {
    return {
      ...MOCK_WEATHER,
      aqi: aqi?.aqi ?? null,
      aqiLabel: aqi?.label ?? null,
    };
  }

  return {
    temperature: weather.temperature,
    condition: weather.condition,
    icon: weather.icon,
    aqi: aqi?.aqi ?? null,
    aqiLabel: aqi?.label ?? null,
  };
}
