export interface GeoLocation { id: number; name: string; latitude: number; longitude: number; country?: string; admin1?: string; timezone?: string }
export interface WeatherPayload {
  latitude: number; longitude: number; timezone: string; current: Record<string, number | string>;
  hourly: Record<string, (number | string)[]>; daily: Record<string, (number | string)[]>;
}
export interface WeatherState { location: GeoLocation; data: WeatherPayload; fetchedAt: Date }
