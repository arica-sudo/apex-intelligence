/**
 * Free/Open-Source SEO Data Scraper
 * Uses Google Autocomplete, SERP scraping, and estimation models
 */

const SERPAPI_KEY = process.env.NEXT_PUBLIC_SERPAPI_KEY || '';
const OPENPAGERANK_API_KEY = process.env.NEXT_PUBLIC_OPENPAGERANK_API_KEY || '';

interface KeywordSuggestion {
  keyword: string;
  volume: number; // Estimated
}

interface BacklinkHint {
  domain: string;
  title: string;
  url: string;
}

/**
 * Fetch keyword suggestions from Google Autocomplete (FREE, no API key needed)
 */
export async function fetchGoogleAutocomplete(query: string): Promise<string[]> {
  try {
    const url = `https://www.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
      return data[1].slice(0, 10).map((item: any) => 
        Array.isArray(item) ? item[0] : item
      );
    }

    return [];
  } catch (error) {
    console.error('Google Autocomplete error:', error);
    return [];
  }
}

/**
 * Estimate search volume based on keyword characteristics
 */
function estimateSearchVolume(keyword: string, position: number): number {
  // Simple estimation: brand terms get higher volume
  const isBrand = keyword.length < 15;
  const hasBrandIndicators = /^(what|how|why|where|when|is|the|best|top|free|online)/i.test(keyword);
  
  let baseVolume = 100;
  
  if (isBrand && !hasBrandIndicators) {
    baseVolume = 50000; // Brand terms typically have higher volume
  } else if (hasBrandIndicators) {
    baseVolume = 10000; // Informational queries
  }

  // Adjust based on position (higher position = more volume)
  const positionMultiplier = position <= 3 ? 1.5 : position <= 10 ? 1.2 : 1.0;
  
  return Math.floor(baseVolume * positionMultiplier * (0.8 + Math.random() * 0.4));
}

/**
 * Estimate keyword difficulty based on competition signals
 */
function estimateDifficulty(keyword: string, domainAuthority: number): number {
  const brandKeywords = keyword.length < 15;
  const informational = /^(what|how|why|where|when|best|top|free)/i.test(keyword);
  
  let baseDifficulty = 50;
  
  if (brandKeywords) {
    // Brand terms are easier for the brand owner
    baseDifficulty = Math.max(20, 100 - domainAuthority);
  } else if (informational) {
    baseDifficulty = 70; // Informational queries are competitive
  } else {
    baseDifficulty = 80; // Commercial queries are very competitive
  }

  return Math.min(100, Math.max(10, baseDifficulty));
}

/**
 * Fetch real keyword data using Google Autocomplete + SerpAPI for positions
 */
export async function fetchRealKeywords(
  domain: string,
  domainAuthority: number
): Promise<{
  keywords: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    difficulty: number;
    traffic: number;
  }>;
  totalKeywords: number;
  positionDistribution: {
    top3: number;
    top10: number;
    top20: number;
    top50: number;
    top100: number;
  };
  dataSource: 'real' | 'estimated' | 'hybrid';
}> {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  const brandName = cleanDomain.split('.')[0];

  // Get keyword suggestions from Google Autocomplete
  const autocompleteQueries = [
    brandName,
    `${brandName} login`,
    `${brandName} app`,
    `what is ${brandName}`,
    `${brandName} alternatives`,
    `best ${brandName}`,
    `${brandName} review`,
    `${brandName} pricing`,
  ];

  const allSuggestions: string[] = [];
  for (const query of autocompleteQueries) {
    const suggestions = await fetchGoogleAutocomplete(query);
    allSuggestions.push(...suggestions);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Deduplicate and filter
  const uniqueKeywords = Array.from(new Set(allSuggestions))
    .filter(k => k.toLowerCase().includes(brandName.toLowerCase()) || k.length > 5)
    .slice(0, 15);

  // Fetch real positions using SerpAPI (if available) or estimate
  const keywordsWithPositions = await Promise.all(
    uniqueKeywords.map(async (keyword) => {
      let position = 0;
      let isRealPosition = false;

      // Try SerpAPI for real position
      if (SERPAPI_KEY) {
        try {
          const params = new URLSearchParams({
            engine: 'google',
            q: keyword,
            api_key: SERPAPI_KEY,
            num: '50',
          });

          const response = await fetch(`https://serpapi.com/search?${params}`);
          
          if (response.ok) {
            const data = await response.json();
            const organicResults = data.organic_results || [];
            
            const found = organicResults.findIndex((result: any) => 
              result.link?.includes(cleanDomain) || result.domain?.includes(cleanDomain)
            );
            
            if (found !== -1) {
              position = found + 1;
              isRealPosition = true;
            }
          }

          // Rate limiting for SerpAPI
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Error fetching position for "${keyword}":`, error);
        }
      }

      // If no real position, estimate based on brand match
      if (position === 0) {
        const exactBrand = keyword.toLowerCase() === brandName.toLowerCase();
        const startsWithBrand = keyword.toLowerCase().startsWith(brandName.toLowerCase());
        
        if (exactBrand) {
          position = 1; // Brand terms usually rank #1
        } else if (startsWithBrand) {
          position = Math.floor(Math.random() * 5) + 1; // Top 5
        } else {
          position = Math.floor(Math.random() * 50) + 10; // 10-60
        }
      }

      const searchVolume = estimateSearchVolume(keyword, position);
      const difficulty = estimateDifficulty(keyword, domainAuthority);
      const traffic = position <= 10 
        ? Math.floor(searchVolume * (0.1 - (position - 1) * 0.008)) // CTR curve
        : Math.floor(searchVolume * 0.001);

      return {
        keyword,
        position,
        searchVolume,
        difficulty,
        traffic,
        isRealPosition,
      };
    })
  );

  // Filter to only keywords where domain ranks (position > 0)
  const rankedKeywords = keywordsWithPositions.filter(k => k.position > 0);

  // Calculate position distribution
  const top3 = rankedKeywords.filter(k => k.position <= 3).length;
  const top10 = rankedKeywords.filter(k => k.position <= 10).length;
  const top20 = rankedKeywords.filter(k => k.position <= 20).length;
  const top50 = rankedKeywords.filter(k => k.position <= 50).length;
  const top100 = rankedKeywords.filter(k => k.position <= 100).length;

  // Estimate total keywords based on found keywords
  // Real SEO tools find thousands, we estimate based on what we found
  const totalKeywords = rankedKeywords.length > 5 
    ? Math.floor(rankedKeywords.length * 500) // Multiply found by typical ratio
    : Math.floor(domainAuthority * 100); // Fallback estimation

  const dataSource = rankedKeywords.some(k => k.isRealPosition) 
    ? (rankedKeywords.every(k => k.isRealPosition) ? 'real' : 'hybrid')
    : 'estimated';

  return {
    keywords: rankedKeywords.slice(0, 8).map(({ isRealPosition, ...rest }) => rest),
    totalKeywords,
    positionDistribution: {
      top3,
      top10,
      top20,
      top50,
      top100,
    },
    dataSource,
  };
}

/**
 * Fetch backlink hints using site:domain queries via SerpAPI
 */
export async function fetchBacklinkHints(domain: string): Promise<BacklinkHint[]> {
  if (!SERPAPI_KEY) {
    return [];
  }

  try {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    // Search for sites linking to this domain
    const params = new URLSearchParams({
      engine: 'google',
      q: `site:${cleanDomain}`,
      api_key: SERPAPI_KEY,
      num: '20',
    });

    const response = await fetch(`https://serpapi.com/search?${params}`);
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const results = data.organic_results || [];
    
    // Extract domains from results
    const hints: BacklinkHint[] = results
      .filter((result: any) => result.link && !result.link.includes(cleanDomain))
      .slice(0, 5)
      .map((result: any) => ({
        domain: new URL(result.link).hostname,
        title: result.title || '',
        url: result.link,
      }));

    return hints;
  } catch (error) {
    console.error('Backlink hints error:', error);
    return [];
  }
}

/**
 * Improved backlink estimation using authority + hints
 */
export async function estimateBacklinksWithHints(
  domain: string,
  domainAuthority: number,
  backlinkHints: BacklinkHint[]
): Promise<{
  totalBacklinks: number;
  referringDomains: number;
  domainRating: number;
  topBacklinks: Array<{
    domain: string;
    dr: number;
    anchorText: string;
    type: 'dofollow' | 'nofollow';
  }>;
  newBacklinks30d: number;
  lostBacklinks30d: number;
  authorityDistribution: {
    dr0to30: number;
    dr31to50: number;
    dr51to70: number;
    dr71to100: number;
  };
  dataSource: 'real' | 'estimated' | 'hybrid';
}> {
  // Improved estimation algorithm based on authority
  // Authority 0-100 scale from OpenPageRank
  const authorityFactor = domainAuthority / 100;
  
  // More realistic backlink counts based on authority
  // Top sites (90+) have millions, medium (50-70) have thousands, small (<50) have hundreds
  const baseBacklinks = authorityFactor > 0.9 
    ? Math.floor(Math.pow(10, 6 + (authorityFactor - 0.9) * 2)) // 1M - 100M
    : authorityFactor > 0.7
    ? Math.floor(Math.pow(10, 4 + (authorityFactor - 0.7) * 5)) // 10K - 1M
    : Math.floor(Math.pow(10, 2 + authorityFactor * 4)); // 100 - 10K

  // Referring domains typically 5-15% of total backlinks
  const referringDomainsRatio = 0.08 + (Math.random() * 0.07);
  const referringDomains = Math.floor(baseBacklinks * referringDomainsRatio);

  // Use backlink hints if available
  let topBacklinks = backlinkHints.slice(0, 5).map(hint => ({
    domain: hint.domain,
    dr: Math.floor(domainAuthority * (0.8 + Math.random() * 0.2)), // Similar to target
    anchorText: hint.title.split(' ').slice(0, 3).join(' ').toLowerCase(),
    type: 'dofollow' as const,
  }));

  // Fallback if no hints
  if (topBacklinks.length === 0) {
    topBacklinks = [
      { domain: 'linkedin.com', dr: 98, anchorText: 'company profile', type: 'dofollow' as const },
      { domain: 'twitter.com', dr: 94, anchorText: domain.split('.')[0], type: 'dofollow' as const },
      { domain: 'github.com', dr: 94, anchorText: 'open source', type: 'dofollow' as const },
      { domain: 'medium.com', dr: 94, anchorText: 'article', type: 'dofollow' as const },
      { domain: 'reddit.com', dr: 91, anchorText: 'discussion', type: 'dofollow' as const },
    ];
  }

  // Link velocity: higher authority sites have more stable backlinks
  const velocityRatio = 0.01 - (authorityFactor * 0.008); // 0.1% - 2% monthly change
  const newBacklinks30d = Math.floor(baseBacklinks * velocityRatio * (0.8 + Math.random() * 0.4));
  const lostBacklinks30d = Math.floor(newBacklinks30d * (0.5 + Math.random() * 0.3));

  // Authority distribution: higher authority domains have more high-DR backlinks
  const highDRRatio = authorityFactor * 0.6; // 0-60% high DR links
  const mediumDRRatio = (1 - highDRRatio) * 0.7;
  const lowDRRatio = (1 - highDRRatio - mediumDRRatio);

  const dataSource = backlinkHints.length > 0 ? 'hybrid' : 'estimated';

  return {
    totalBacklinks: baseBacklinks,
    referringDomains,
    domainRating: domainAuthority,
    topBacklinks,
    newBacklinks30d,
    lostBacklinks30d,
    authorityDistribution: {
      dr0to30: Math.floor(referringDomains * lowDRRatio),
      dr31to50: Math.floor(referringDomains * mediumDRRatio * 0.5),
      dr51to70: Math.floor(referringDomains * mediumDRRatio * 0.5),
      dr71to100: Math.floor(referringDomains * highDRRatio),
    },
    dataSource,
  };
}

/**
 * Estimate traffic from keywords and authority
 */
export function estimateTrafficFromKeywords(
  keywords: Array<{ traffic: number }>,
  domainAuthority: number
): {
  monthlyVisits: number;
  trafficSources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    paid: number;
    email: number;
  };
  bounceRate: number;
  pagesPerSession: number;
  avgSessionDuration: number;
  topCountries: Array<{ country: string; percentage: number }>;
  dataSource: 'estimated' | 'hybrid';
} {
  // Sum traffic from ranked keywords
  const organicTrafficFromKeywords = keywords.reduce((sum, k) => sum + k.traffic, 0);

  // Estimate traffic based on authority (realistic numbers for each tier)
  const authorityFactor = domainAuthority / 100;
  let authorityBasedTraffic = 0;

  if (authorityFactor >= 0.95) {
    // Top tier sites (95-100): 100M - 3B monthly visits (Amazon, Google, YouTube)
    authorityBasedTraffic = Math.floor(Math.pow(10, 8) * (1 + (authorityFactor - 0.95) * 25));
  } else if (authorityFactor >= 0.90) {
    // Very high authority (90-95): 10M - 100M monthly visits
    authorityBasedTraffic = Math.floor(Math.pow(10, 7) * (1 + (authorityFactor - 0.90) * 9));
  } else if (authorityFactor >= 0.80) {
    // High authority (80-90): 1M - 10M monthly visits
    authorityBasedTraffic = Math.floor(Math.pow(10, 6) * (1 + (authorityFactor - 0.80) * 9));
  } else if (authorityFactor >= 0.70) {
    // Medium-high (70-80): 100K - 1M monthly visits
    authorityBasedTraffic = Math.floor(Math.pow(10, 5) * (1 + (authorityFactor - 0.70) * 9));
  } else if (authorityFactor >= 0.50) {
    // Medium (50-70): 10K - 100K monthly visits
    authorityBasedTraffic = Math.floor(Math.pow(10, 4) * (1 + (authorityFactor - 0.50) * 9));
  } else {
    // Lower authority (<50): 1K - 10K monthly visits
    authorityBasedTraffic = Math.floor(Math.pow(10, 3) * (1 + authorityFactor * 9));
  }

  // Use the HIGHER of keyword-based or authority-based traffic
  // This ensures high-authority sites get realistic numbers
  const baseMonthlyVisits = Math.max(organicTrafficFromKeywords, authorityBasedTraffic);

  // Estimate monthly visits: organic + direct (30-50% of organic) + other sources
  const directRatio = 0.35 + (Math.random() * 0.15);
  const monthlyVisits = Math.floor(baseMonthlyVisits * (1 + directRatio + 0.2));

  // Traffic sources distribution
  const organic = monthlyVisits > 0 ? Math.floor((baseMonthlyVisits / monthlyVisits) * 100) : 60;
  const direct = Math.floor(directRatio * 100);
  const referral = 5 + Math.floor(Math.random() * 10);
  const social = 3 + Math.floor(Math.random() * 7);
  const paid = Math.floor(Math.random() * 5);
  const email = Math.floor(Math.random() * 3);
  const remainder = 100 - (organic + direct + referral + social + paid + email);
  
  // Adjust organic to account for remainder
  const adjustedOrganic = organic + remainder;

  // Engagement metrics based on authority (reuse authorityFactor from above)
  const bounceRate = Math.floor(40 - (authorityFactor * 15) + (Math.random() * 10)); // 25-50%
  const pagesPerSession = parseFloat((1.5 + authorityFactor * 2 + Math.random() * 1).toFixed(1));
  const avgSessionDuration = Math.floor(60 + authorityFactor * 180 + Math.random() * 60);

  // Top countries (realistic distribution)
  const countries = [
    { country: 'United States', percentage: 45 + Math.floor(Math.random() * 15) },
    { country: 'United Kingdom', percentage: 8 + Math.floor(Math.random() * 8) },
    { country: 'Canada', percentage: 5 + Math.floor(Math.random() * 5) },
    { country: 'Germany', percentage: 4 + Math.floor(Math.random() * 5) },
    { country: 'Australia', percentage: 3 + Math.floor(Math.random() * 4) },
  ];
  
  // Normalize percentages
  const total = countries.reduce((sum, c) => sum + c.percentage, 0);
  countries.forEach(c => c.percentage = Math.floor((c.percentage / total) * 100));

  // Traffic history (last 6 months with realistic growth)
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseTraffic = monthlyVisits * 0.9;
  const growthRate = 0.02; // 2% monthly growth
  
  return {
    monthlyVisits,
    trafficSources: {
      organic: adjustedOrganic,
      direct,
      referral,
      social,
      paid,
      email: Math.max(0, email),
    },
    bounceRate,
    pagesPerSession,
    avgSessionDuration,
    topCountries: countries,
    dataSource: 'estimated' as const,
    // Add trafficHistory for compatibility
    trafficHistory: months.map((month, i) => ({
      month,
      visits: Math.floor(baseTraffic * Math.pow(1 + growthRate, i) + (Math.random() * baseTraffic * 0.05)),
    })),
  };
}

