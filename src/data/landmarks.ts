export interface Landmark { match: string[]; image: string; credit: string; landmark: string }
// Wikimedia Commons file redirects are used so the photographs remain tied to the named landmark.
export const landmarks: Landmark[] = [
  { match: ['hyderabad'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Charminar%20Hyderabad.jpg', credit: 'Wikimedia Commons', landmark: 'Charminar' },
  { match: ['bengaluru', 'bangalore'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vidhana%20Soudha%20Bangalore.jpg', credit: 'Wikimedia Commons', landmark: 'Vidhana Soudha' },
  { match: ['mumbai'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gateway%20of%20India%20Mumbai.jpg', credit: 'Wikimedia Commons', landmark: 'Gateway of India' },
  { match: ['delhi', 'new delhi'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/India%20Gate%20in%20New%20Delhi.jpg', credit: 'Wikimedia Commons', landmark: 'India Gate' },
  { match: ['chennai'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Marina%20Beach%20Chennai.jpg', credit: 'Wikimedia Commons', landmark: 'Marina Beach' },
  { match: ['kolkata'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Victoria%20Memorial%20Kolkata.jpg', credit: 'Wikimedia Commons', landmark: 'Victoria Memorial' },
  { match: ['paris'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel%20Tower%20Paris%20(2).jpg', credit: 'Wikimedia Commons', landmark: 'Eiffel Tower' },
  { match: ['london'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elizabeth%20Tower%2C%20London.jpg', credit: 'Wikimedia Commons', landmark: 'Big Ben' },
  { match: ['new york', 'new york city'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Statue%20of%20Liberty%207.jpg', credit: 'Wikimedia Commons', landmark: 'Statue of Liberty' },
  { match: ['dubai'], image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Burj%20Khalifa.jpg', credit: 'Wikimedia Commons', landmark: 'Burj Khalifa' },
];
export const fallbackImage = 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85';
export function getLandmark(city: string) { return landmarks.find(item => item.match.includes(city.toLowerCase().trim())); }
