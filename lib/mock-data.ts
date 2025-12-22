import { BacklinkData, KeywordData, TrafficData } from './types';

// Known high-authority domains
const KNOWN_DOMAINS: Record<string, { dr: number, traffic: number, keywords: number }> = {
  'amazon.com': { dr: 96, traffic: 2500000000, keywords: 150000 },
  'google.com': { dr: 100, traffic: 90000000000, keywords: 500000 },
  'youtube.com': { dr: 100, traffic: 30000000000, keywords: 300000 },
  'facebook.com': { dr: 96, traffic: 20000000000, keywords: 200000 },
  'wikipedia.org': { dr: 93, traffic: 15000000000, keywords: 400000 },
  'twitter.com': { dr: 94, traffic: 5000000000, keywords: 100000 },
  'instagram.com': { dr: 94, traffic: 6000000000, keywords: 80000 },
  'linkedin.com': { dr: 98, traffic: 1000000000, keywords: 120000 },
  'reddit.com': { dr: 91, traffic: 1800000000, keywords: 500000 },
  'github.com': { dr: 94, traffic: 750000000, keywords: 90000 },
  'microsoft.com': { dr: 97, traffic: 500000000, keywords: 85000 },
  'apple.com': { dr: 97, traffic: 450000000, keywords: 70000 },
  'netflix.com': { dr: 93, traffic: 600000000, keywords: 55000 },
  'spotify.com': { dr: 92, traffic: 400000000, keywords: 48000 },
  'ebay.com': { dr: 92, traffic: 800000000, keywords: 95000 },
  'cnn.com': { dr: 92, traffic: 350000000, keywords: 65000 },
  'nytimes.com': { dr: 95, traffic: 300000000, keywords: 75000 },
  'medium.com': { dr: 94, traffic: 200000000, keywords: 180000 },
};

// Helper to get domain from URL
function getDomain(url: string): string {
  return url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
}

// Generate realistic mock data based on domain authority
export function generateMockBacklinks(domain: string): BacklinkData {
  const cleanDomain = getDomain(domain);
  const knownData = KNOWN_DOMAINS[cleanDomain];

  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };

  // Use known data or generate realistic estimates
  const domainRating = knownData ? knownData.dr : random(40, 85);
  const totalBacklinks = knownData
    ? Math.floor(knownData.keywords * 100)
    : Math.pow(10, random(3, 6));
  const referringDomains = Math.floor(totalBacklinks / random(8, 15));

  return {
    totalBacklinks,
    referringDomains,
    domainRating,
    topBacklinks: [
      { domain: 'techcrunch.com', dr: 93, anchorText: 'innovative solution', type: 'dofollow' },
      { domain: 'forbes.com', dr: 95, anchorText: domain, type: 'dofollow' },
      { domain: 'medium.com', dr: 94, anchorText: 'learn more', type: 'dofollow' },
      { domain: 'wikipedia.org', dr: 93, anchorText: 'reference', type: 'dofollow' },
      { domain: 'nytimes.com', dr: 95, anchorText: 'featured in', type: 'dofollow' },
    ],
    newBacklinks30d: random(100, 2000),
    lostBacklinks30d: random(20, 150),
    authorityDistribution: {
      dr0to30: knownData ? 5 : random(15, 30),
      dr31to50: knownData ? 10 : random(20, 30),
      dr51to70: knownData ? 25 : random(25, 35),
      dr71to100: knownData ? 60 : random(20, 30),
    },
  };
}

export function generateMockKeywords(domain: string): KeywordData {
  const cleanDomain = getDomain(domain);
  const knownData = KNOWN_DOMAINS[cleanDomain];

  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };

  const totalKeywords = knownData ? knownData.keywords : random(1000, 15000);

  return {
    totalKeywords,
    topKeywords: [
      { keyword: domain.split('.')[0], position: 1, searchVolume: 500000, difficulty: 95, traffic: 250000 },
      { keyword: `${domain.split('.')[0]} login`, position: 2, searchVolume: 200000, difficulty: 85, traffic: 120000 },
      { keyword: `${domain.split('.')[0]} app`, position: 1, searchVolume: 150000, difficulty: 80, traffic: 90000 },
      { keyword: `what is ${domain.split('.')[0]}`, position: 3, searchVolume: 100000, difficulty: 65, traffic: 50000 },
      { keyword: `${domain.split('.')[0]} account`, position: 2, searchVolume: 90000, difficulty: 70, traffic: 54000 },
      { keyword: `${domain.split('.')[0]} download`, position: 1, searchVolume: 80000, difficulty: 75, traffic: 48000 },
      { keyword: `${domain.split('.')[0]} sign up`, position: 2, searchVolume: 75000, difficulty: 68, traffic: 45000 },
      { keyword: `${domain.split('.')[0]} support`, position: 4, searchVolume: 60000, difficulty: 60, traffic: 24000 },
    ],
    positionDistribution: {
      top3: Math.floor(totalKeywords * (knownData ? 0.25 : 0.08)),
      top10: Math.floor(totalKeywords * (knownData ? 0.35 : 0.18)),
      top20: Math.floor(totalKeywords * 0.25),
      top50: Math.floor(totalKeywords * 0.25),
      top100: Math.floor(totalKeywords * 0.15),
    },
  };
}

export function generateMockTraffic(domain: string): TrafficData {
  const cleanDomain = getDomain(domain);
  const knownData = KNOWN_DOMAINS[cleanDomain];

  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + 2) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };

  const monthlyVisits = knownData ? knownData.traffic : random(500000, 10000000);

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseTraffic = monthlyVisits * 0.85;

  return {
    monthlyVisits,
    trafficSources: {
      organic: knownData ? random(35, 55) : random(40, 70),
      direct: knownData ? random(25, 40) : random(10, 25),
      referral: random(5, 15),
      social: random(3, 10),
      paid: random(2, 8),
    },
    trafficHistory: months.map((month, i) => ({
      month,
      visits: Math.floor(baseTraffic + (baseTraffic * 0.1 * i / months.length) + random(-baseTraffic * 0.05, baseTraffic * 0.05)),
    })),
    bounceRate: knownData ? random(25, 40) : random(35, 65),
    pagesPerSession: knownData ? parseFloat((random(50, 80) / 10).toFixed(1)) : parseFloat((random(20, 50) / 10).toFixed(1)),
    avgSessionDuration: knownData ? random(180, 420) : random(60, 300),
    topCountries: [
      { country: 'United States', percentage: random(35, 55) },
      { country: 'United Kingdom', percentage: random(6, 12) },
      { country: 'Canada', percentage: random(4, 8) },
      { country: 'Germany', percentage: random(3, 7) },
      { country: 'Australia', percentage: random(2, 5) },
    ],
  };
}
