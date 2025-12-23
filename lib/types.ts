export interface TechStack {
  cms?: string;
  framework?: string;
  server?: string;
  hosting?: string[];
  cdn?: string | string[];
  analytics?: string[];
  libraries?: string[];
  marketing?: string[];
  payments?: string[];
  chat?: string[];
  abTesting?: string[];
  monitoring?: string[];
  security?: string[];
  fonts?: string[];
  databases?: string[];
  edge?: string[];
  misc?: string[];
}

export interface PerformanceMetrics {
  score: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tbt: number; // Total Blocking Time
  si: number;  // Speed Index
}

export interface SEOHealth {
  score: number;
  hasMetaDescription: boolean;
  hasTitle: boolean;
  titleLength: number;
  metaDescriptionLength: number;
  hasH1: boolean;
  h1Count: number;
  hasCanonical: boolean;
  hasMetaRobots: boolean;
  isNoindex: boolean;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  imageAltsPresent: boolean;
  hasSsl: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
}

// Phase 2 Extensions
export interface BacklinkData {
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
  dataSource?: 'real' | 'estimated' | 'hybrid';
}

export interface KeywordData {
  totalKeywords: number;
  topKeywords: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    difficulty: number;
    traffic: number;
  }>;
  positionDistribution: {
    top3: number;
    top10: number;
    top20: number;
    top50: number;
    top100: number;
  };
  dataSource?: 'real' | 'estimated' | 'hybrid';
}

export interface TrafficData {
  monthlyVisits: number;
  trafficSources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    paid: number;
    email?: number;
  };
  trafficHistory: Array<{
    month: string;
    visits: number;
  }>;
  bounceRate: number;
  pagesPerSession: number;
  avgSessionDuration: number;
  topCountries: Array<{
    country: string;
    percentage: number;
  }>;
  dataSource?: 'real' | 'estimated' | 'hybrid';
}

export interface CompetitorData {
  domain: string;
  title: string;
  authority: number;
}

export interface ScanResult {
  id?: string;
  aiAnalysis?: any;
  url: string;
  domain: string;
  timestamp: number;
  techStack: TechStack;
  performance: PerformanceMetrics;
  seoHealth: SEOHealth;
  // Phase 2 additions
  backlinks?: BacklinkData;
  keywords?: KeywordData;
  traffic?: TrafficData;
  competitors?: CompetitorData[];
  status: 'scanning' | 'completed' | 'error';
  error?: string;
}
