import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Cloud, Droplets, Gauge, LocateFixed, RefreshCw, Sunrise, Sunset, Wind, Eye, Sun, CloudRain, MapPin, Clock3 } from 'lucide-react';
import type { GeoLocation, WeatherState } from '../types/weather';
import CitySearch from './CitySearch';
import { getWeather } from '../services/weatherService';
import { condition, dayLabel, feelsDescription, localClock, localDate, timeLabel, weatherEmoji } from '../utils/weather';
import { fallbackImage, getLandmark } from '../data/landmarks';
const defaultCity: GeoLocation = { id: 1269843, name: 'Hyderabad', latitude: 17.385, longitude: 78.4867, country: 'India', timezone: 'Asia/Kolkata' };
export default function WeatherDashboard() {
  const [state, setState] = useState<WeatherState | null>(null); const [city, setCity] = useState<GeoLocation>(defaultCity);
  const [busy, setBusy] = useState(true); const [error, setError] = useState(''); const [unit, setUnit] = useState<'C'|'F'>('C'); const [imageFailed, setImageFailed] = useState(false);
  const landmark = getLandmark(city.name); const background = imageFailed ? fallbackImage : landmark?.image ?? fallbackImage;
  async function load(location: GeoLocation) { setBusy(true); setError(''); try { const data = await getWeather(location); setCity(location); setState({ location, data, fetchedAt: new Date() }); setImageFailed(false); } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); } finally { setBusy(false); } }
  useEffect(() => { void load(defaultCity); }, []);
  const current = state?.data.current; const daily = state?.data.daily; const hourly = state?.data.hourly;
  const temp = (value: number) => Math.round(unit === 'C' ? value : value * 9 / 5 + 32);
  const wind = (value: number) => Math.round(value);
  const hourlyRows = useMemo(() => { if (!hourly) return []; const now = String(current?.time ?? ''); const start = Math.max(0, hourly.time.findIndex(t => String(t) >= now)); return Array.from({ length: 24 }, (_, i) => start + i).filter(i => i < hourly.time.length); }, [hourly, current?.time]);
  const weatherCode = Number(current?.weather_code ?? 0); const isDay = Number(current?.is_day ?? 1) === 1;
  const feels = Number(current?.apparent_temperature ?? 0); const actual = Number(current?.temperature_2m ?? 0);
  const detailItems = current ? [
    { label: 'Humidity', value: `${current.relative_humidity_2m}%`, sub: 'Relative humidity', icon: Droplets },
    { label: 'Wind', value: `${wind(Number(current.wind_speed_10m))} km/h`, sub: `${current.wind_direction_10m}° direction`, icon: Wind },
    { label: 'UV index', value: Number(current.uv_index).toFixed(1), sub: 'Current UV level', icon: Sun },
    { label: 'Visibility', value: `${(Number(current.visibility) / 1000).toFixed(1)} km`, sub: 'Viewing distance', icon: Eye },
    { label: 'Pressure', value: `${Math.round(Number(current.pressure_msl))} hPa`, sub: 'Sea-level pressure', icon: Gauge },
    { label: 'Precipitation', value: `${Number(current.precipitation).toFixed(1)} mm`, sub: 'Current amount', icon: CloudRain },
  ] : [];
  function useMyLocation() { if (!navigator.geolocation) { setError('Location is not supported by this browser.'); return; } setBusy(true); navigator.geolocation.getCurrentPosition(async pos => { const loc: GeoLocation = { id: Date.now(), name: 'Your location', latitude: pos.coords.latitude, longitude: pos.coords.longitude }; try { const data = await getWeather(loc); setCity(loc); setState({ location: loc, data, fetchedAt: new Date() }); setImageFailed(false); setError(''); } catch (e) { setError(e instanceof Error ? e.message : 'Could not load local weather.'); } finally { setBusy(false); } }, () => { setBusy(false); setError('Location permission was denied. You can search for a city instead.'); }); }
  return <main className="app-shell">
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,17,25,.78) 0%, rgba(8,17,25,.40) 52%, rgba(8,17,25,.18) 100%), linear-gradient(0deg, rgba(8,17,25,.92) 0%, transparent 58%), url("${background}")` }}>
      <div className="hero-shade"/><header className="topbar"><a className="brand" href="#top"><span className="brand-mark">A</span><span>atmosphere<span className="brand-dot">.</span></span></a><div className="header-actions"><CitySearch onSelect={load}/><button className="icon-button location-btn" onClick={useMyLocation} aria-label="Use my location"><LocateFixed size={18}/><span>My location</span></button><div className="unit-switch"><button className={unit==='C'?'active':''} onClick={() => setUnit('C')}>°C</button><button className={unit==='F'?'active':''} onClick={() => setUnit('F')}>°F</button></div></div></header>
      <div className="hero-content" id="top"><div className="eyebrow"><span className="live-dot"/> LIVE CONDITIONS <span className="eyebrow-line"/></div><div className="place-line"><MapPin size={17}/><span>{city.name}{city.country ? `, ${city.country}` : ''}</span></div>
        {state && <><div className="local-time"><Clock3 size={14}/>{localDate(state.data.timezone)} <span>·</span> {localClock(state.data.timezone)} local time</div><div className="temperature-row"><span className="temperature">{temp(actual)}°</span><div className="condition-block"><span className="weather-emoji">{weatherEmoji(weatherCode, isDay)}</span><span className="condition-name">{condition(weatherCode)}</span><span className="high-low"><ArrowUp size={13}/>{temp(Number(daily?.temperature_2m_max?.[0] ?? actual))}° <ArrowDown size={13}/>{temp(Number(daily?.temperature_2m_min?.[0] ?? actual))}° today</span></div></div>
          <div className="feels-card"><div><span className="feels-label">FEELS LIKE</span><strong>{temp(feels)}°</strong></div><p>{feelsDescription(actual, feels)}</p></div></>}
        {busy && <div className="hero-loading"><span className="loader"/> {state ? 'Refreshing weather…' : 'Finding the weather…'}</div>}
        {error && <div className="error-banner">{error} <button onClick={() => load(city)}><RefreshCw size={14}/> Retry</button></div>}
      </div>
      <div className="hero-footer"><span>{landmark ? `A view of ${landmark.landmark}` : 'A city, in its element'}</span><span>PHOTO · {landmark?.credit ?? 'Unsplash'}</span></div>
      <img className="image-preload" src={background} onError={() => setImageFailed(true)} alt="" />
    </section>
    {state && <div className="content-wrap"><div className="section-heading"><div><span className="section-kicker">RIGHT NOW</span><h2>The atmosphere</h2></div><div className="updated"><span className="live-dot"/> Updated {state.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<button onClick={() => load(city)} aria-label="Refresh weather"><RefreshCw size={15}/></button></div></div>
      <section className="details-grid">{detailItems.map(item => <article className="detail-card" key={item.label}><div className="detail-top"><span>{item.label}</span><item.icon size={18}/></div><strong>{item.value}</strong><small>{item.sub}</small></article>)}
        <article className="detail-card sun-card"><div className="detail-top"><span>Sunrise & sunset</span><Sunrise size={18}/></div><div className="sun-times"><div><Sunrise size={17}/><strong>{String(daily?.sunrise?.[0] ?? '').slice(11,16) || '—'}</strong><small>Sunrise</small></div><div><Sunset size={17}/><strong>{String(daily?.sunset?.[0] ?? '').slice(11,16) || '—'}</strong><small>Sunset</small></div></div></article>
      </section>
      <section className="forecast-section"><div className="section-heading compact"><div><span className="section-kicker">THE NEXT 24 HOURS</span><h2>Hour by hour</h2></div><span className="subtle-label">Local time</span></div><div className="hourly-scroll">{hourlyRows.map(i => <article className="hour-card" key={String(hourly?.time[i])}><span className="hour-time">{i === hourlyRows[0] ? 'Now' : timeLabel(String(hourly?.time[i]))}</span><span className="hour-icon">{weatherEmoji(Number(hourly?.weather_code[i]))}</span><strong>{temp(Number(hourly?.temperature_2m[i]))}°</strong><span className="rain-chance"><Droplets size={12}/>{hourly?.precipitation_probability[i] ?? 0}%</span></article>)}</div></section>
      <section className="forecast-section week-section"><div className="section-heading compact"><div><span className="section-kicker">LOOKING AHEAD</span><h2>7-day forecast</h2></div><span className="subtle-label">Next seven days</span></div><div className="week-list">{daily?.time.map((date, i) => <article className="week-row" key={String(date)}><span className="week-day">{dayLabel(String(date), i)}</span><span className="week-condition"><span>{weatherEmoji(Number(daily.weather_code[i]))}</span>{condition(Number(daily.weather_code[i]))}</span><span className="week-rain"><Droplets size={13}/>{daily.precipitation_probability_max[i] ?? 0}%</span><div className="temp-range"><strong>{temp(Number(daily.temperature_2m_max[i]))}°</strong><span className="range-track"><i style={{ left: `${Math.max(0, Math.min(75, (Number(daily.temperature_2m_min[i]) + 10) * 1.2))}%`, width: `${Math.max(14, Math.min(80, (Number(daily.temperature_2m_max[i]) - Number(daily.temperature_2m_min[i])) * 2.2))}%` }}/></span><span>{temp(Number(daily.temperature_2m_min[i]))}°</span></div></article>)}</div></section>
      <footer className="app-footer"><span>ATMOSPHERE<span className="brand-dot">.</span> WEATHER, WITH A SENSE OF PLACE.</span><span>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Updated {state.fetchedAt.toLocaleString()}</span></footer>
    </div>}
    {!state && !busy && <div className="empty-state"><Cloud size={32}/><h2>Weather is taking a moment.</h2><p>Check your connection or try searching for another city.</p></div>}
  </main>;
}
