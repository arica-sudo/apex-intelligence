import { BacklinkData, KeywordData, TrafficData } from './types';

// Generate realistic mock data based on domain authority
export function generateMockBacklinks(domain: string): BacklinkData {
  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };

  const domainRating = random(30, 95);
  const totalBacklinks = Math.pow(10, random(3, 6));
  const referringDomains = Math.floor(totalBacklinks / random(5, 20));

  return {
    totalBacklinks,
    referringDomains,
    domainRating,
    topBacklinks: [
      { domain: 'techcrunch.com', dr: 93, anchorText: 'innovative solution', type: 'dofollow' },
      { domain: 'forbes.com', dr: 95, anchorText: domain, type: 'dofollow' },
      { domain: 'medium.com', dr: 94, anchorText: 'learn more', type: 'dofollow' },
      { domain: 'reddit.com', dr: 91, anchorText: 'check this out', type: 'nofollow' },
      { domain: 'github.com', dr: 96, anchorText: 'documentation', type: 'dofollow' },
    ],
    newBacklinks30d: random(50, 500),
    lostBacklinks30d: random(10, 100),
    authorityDistribution: {
      dr0to30: random(20, 40),
      dr31to50: random(25, 35),
      dr51to70: random(20, 30),
      dr71to100: random(10, 20),
    },
  };
}

export function generateMockKeywords(domain: string): KeywordData {
  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };

  const totalKeywords = random(500, 5000);

  return {
    totalKeywords,
    topKeywords: [
      { keyword: 'seo tools', position: 3, searchVolume: 12000, difficulty: 72, traffic: 3600 },
      { keyword: 'website analyzer', position: 5, searchVolume: 8500, difficulty: 65, traffic: 2125 },
      { keyword: 'competitive analysis', position: 7, searchVolume: 6200, difficulty: 68, traffic: 1240 },
      { keyword: 'backlink checker', position: 12, searchVolume: 15000, difficulty: 75, traffic: 1500 },
      { keyword: 'keyword research tool', position: 8, searchVolume: 9800, difficulty: 70, traffic: 1960 },
      { keyword: 'domain authority', position: 4, searchVolume: 11200, difficulty: 73, traffic: 2800 },
      { keyword: 'site audit', position: 15, searchVolume: 7400, difficulty: 60, traffic: 740 },
      { keyword: 'rank tracker', position: 9, searchVolume: 5600, difficulty: 64, traffic: 1120 },
    ],
    positionDistribution: {
      top3: Math.floor(totalKeywords * 0.08),
      top10: Math.floor(totalKeywords * 0.18),
      top20: Math.floor(totalKeywords * 0.25),
      top50: Math.floor(totalKeywords * 0.32),
      top100: Math.floor(totalKeywords * 0.17),
    },
  };
}

export function generateMockTraffic(domain: string): TrafficData {
  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + 2) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };

  const monthlyVisits = random(100000, 5000000);

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseTraffic = monthlyVisits * 0.7;

  return {
    monthlyVisits,
    trafficSources: {
      organic: random(40, 70),
      direct: random(10, 25),
      referral: random(5, 15),
      social: random(3, 10),
      paid: random(2, 8),
    },
    trafficHistory: months.map((month, i) => ({
      month,
      visits: Math.floor(baseTraffic + (baseTraffic * 0.3 * i / months.length) + random(-baseTraffic * 0.1, baseTraffic * 0.1)),
    })),
    bounceRate: random(35, 65),
    pagesPerSession: parseFloat((random(20, 50) / 10).toFixed(1)),
    avgSessionDuration: random(60, 300),
    topCountries: [
      { country: 'United States', percentage: random(30, 50) },
      { country: 'United Kingdom', percentage: random(8, 15) },
      { country: 'Canada', percentage: random(5, 10) },
      { country: 'Germany', percentage: random(4, 8) },
      { country: 'Australia', percentage: random(3, 6) },
    ],
  };
}
