import type { GeoLocation, WeatherPayload } from '../types/weather';
const BASE = 'https://api.open-meteo.com/v1/forecast';
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({ name: query, count: '7', language: 'en', format: 'json' }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error('City search is temporarily unavailable. Please try again.');
  const json = await response.json();
  return (json.results ?? []).map((item: any) => ({ id: item.id, name: item.name, latitude: item.latitude, longitude: item.longitude, country: item.country, admin1: item.admin1, timezone: item.timezone }));
}
export async function getWeather(location: GeoLocation): Promise<WeatherPayload> {
  const url = new URL(BASE);
  url.search = new URLSearchParams({
    latitude: String(location.latitude), longitude: String(location.longitude), timezone: 'auto', forecast_days: '7',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility',
    hourly: 'temperature_2m,apparent_temperature,precipitation_probability,weather_code,relative_humidity_2m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max',
    wind_speed_unit: 'kmh', temperature_unit: 'celsius'
  }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.status === 429 ? 'Weather service is busy. Please try again in a moment.' : 'Live weather is temporarily unavailable.');
  return response.json();
}
