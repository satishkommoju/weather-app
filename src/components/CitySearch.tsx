import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, X, LoaderCircle } from 'lucide-react';
import type { GeoLocation } from '../types/weather';
import { searchCities } from '../services/weatherService';
interface Props { onSelect: (city: GeoLocation) => void }
export default function CitySearch({ onSelect }: Props) {
  const [query, setQuery] = useState(''); const [results, setResults] = useState<GeoLocation[]>([]); const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { if (timer.current) clearTimeout(timer.current); if (query.trim().length < 2) { setResults([]); setError(''); return; }
    timer.current = setTimeout(async () => { setLoading(true); setError(''); try { const found = await searchCities(query.trim()); setResults(found); if (!found.length) setError('No cities found. Try another spelling.'); } catch (e) { setError(e instanceof Error ? e.message : 'Search failed.'); } finally { setLoading(false); } }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);
  return <div className="search-wrap"><div className="search-box"><Search size={18}/><input aria-label="Search city" placeholder="Search for a city…" value={query} onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true); }}/>{loading && <LoaderCircle className="spin" size={17}/ >}{query && <button className="clear" aria-label="Clear search" onClick={() => { setQuery(''); setOpen(false); }}><X size={16}/></button>}</div>
    {open && query.length > 1 && <div className="suggestions">{results.map(city => <button key={city.id} className="suggestion" onClick={() => { onSelect(city); setQuery(''); setOpen(false); }}><MapPin size={16}/><span><b>{city.name}</b><small>{[city.admin1, city.country].filter(Boolean).join(', ')}</small></span></button>)}{error && <p className="search-error">{error}</p>}</div>}
  </div>;
}
