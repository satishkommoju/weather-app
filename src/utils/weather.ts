export function condition(code: number) {
  if (code === 0) return 'Clear sky'; if ([1,2].includes(code)) return 'Partly cloudy'; if (code === 3) return 'Overcast';
  if ([45,48].includes(code)) return 'Foggy'; if ([51,53,55,56,57].includes(code)) return 'Drizzle';
  if ([61,63,65,66,67,80,81,82].includes(code)) return 'Rain'; if ([71,73,75,77,85,86].includes(code)) return 'Snow';
  if ([95,96,99].includes(code)) return 'Thunderstorms'; return 'Variable conditions';
}
export function weatherEmoji(code: number, isDay = true) {
  if (code === 0) return isDay ? '☀️' : '🌙'; if ([1,2].includes(code)) return isDay ? '🌤️' : '☁️';
  if ([3,45,48].includes(code)) return '☁️'; if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌧️';
  if ([71,73,75,77,85,86].includes(code)) return '❄️'; if ([95,96,99].includes(code)) return '⛈️'; return '🌡️';
}
export function localClock(timezone: string) { return new Intl.DateTimeFormat('en', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date()); }
export function localDate(timezone: string) { return new Intl.DateTimeFormat('en', { timeZone: timezone, weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()); }
export function timeLabel(value: string) { return value.slice(11, 16); }
export function dayLabel(value: string, index: number) { return index === 0 ? 'Today' : new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${value}T12:00:00`)); }
export function feelsDescription(actual: number, feels: number) {
  const diff = feels - actual; if (diff >= 3) return 'Humidity and the air temperature are making it feel warmer than it is.';
  if (diff <= -3) return 'Wind and other conditions are making it feel cooler than the air temperature.';
  return 'It feels close to the measured air temperature.';
}
