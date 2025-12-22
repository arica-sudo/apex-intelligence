import { NextRequest, NextResponse } from 'next/server';
import { generateMockBacklinks, generateMockKeywords, generateMockTraffic } from '@/lib/mock-data';

// Google PageSpeed Insights API (Free tier)
const PSI_API_KEY = process.env.NEXT_PUBLIC_PSI_API_KEY || '';
const PSI_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

async function fetchPageSpeedInsights(url: string) {
  try {
    const apiUrl = `${PSI_API_URL}?url=${encodeURIComponent(url)}&strategy=mobile&category=PERFORMANCE&category=SEO`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      performance: {
        score: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
        fcp: data.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0,
        lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0,
        cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0,
        tbt: data.lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0,
        si: data.lighthouseResult?.audits?.['speed-index']?.numericValue || 0,
      },
      seoScore: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100),
    };
  } catch (error) {
    console.error('PageSpeed Insights error:', error);
    return null;
  }
}

async function detectTechStack(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    const techStack: any = {
      libraries: [],
      analytics: [],
    };

    // Detect CMS
    if (html.includes('wp-content') || html.includes('wordpress')) {
      techStack.cms = 'WordPress';
    } else if (html.includes('shopify')) {
      techStack.cms = 'Shopify';
    } else if (html.includes('wix.com')) {
      techStack.cms = 'Wix';
    } else if (html.includes('webflow')) {
      techStack.cms = 'Webflow';
    } else if (html.includes('drupal')) {
      techStack.cms = 'Drupal';
    }

    // Detect Framework
    if (html.includes('__NEXT_DATA__') || html.includes('_next/')) {
      techStack.framework = 'Next.js';
    } else if (html.includes('__NUXT__')) {
      techStack.framework = 'Nuxt.js';
    } else if (html.includes('ng-version') || html.includes('angular')) {
      techStack.framework = 'Angular';
    } else if (html.includes('react') || html.includes('_react')) {
      techStack.framework = 'React';
    } else if (html.includes('vue') || html.includes('__vue')) {
      techStack.framework = 'Vue.js';
    }

    // Detect Server
    if (headers['server']) {
      techStack.server = headers['server'];
    } else if (headers['x-powered-by']) {
      techStack.server = headers['x-powered-by'];
    }

    // Detect CDN
    if (headers['cf-ray'] || html.includes('cloudflare')) {
      techStack.cdn = 'Cloudflare';
    } else if (headers['x-amz-cf-id'] || html.includes('cloudfront')) {
      techStack.cdn = 'CloudFront';
    } else if (headers['x-fastly-request-id']) {
      techStack.cdn = 'Fastly';
    }

    // Detect Analytics
    if (html.includes('google-analytics.com') || html.includes('gtag')) {
      techStack.analytics.push('Google Analytics');
    }
    if (html.includes('googletagmanager.com')) {
      techStack.analytics.push('Google Tag Manager');
    }
    if (html.includes('facebook.net/en_US/fbevents.js')) {
      techStack.analytics.push('Facebook Pixel');
    }
    if (html.includes('hotjar')) {
      techStack.analytics.push('Hotjar');
    }

    // Detect Libraries
    if (html.includes('jquery')) techStack.libraries.push('jQuery');
    if (html.includes('bootstrap')) techStack.libraries.push('Bootstrap');
    if (html.includes('tailwind')) techStack.libraries.push('Tailwind CSS');

    return techStack;
  } catch (error) {
    console.error('Tech stack detection error:', error);
    return null;
  }
}

async function analyzeSEO(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Extract meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const h1Match = html.match(/<h1[^>]*>/i);

    const seoHealth = {
      score: 0,
      hasTitle: !!titleMatch,
      titleLength: titleMatch ? titleMatch[1].length : 0,
      hasMetaDescription: !!metaDescMatch,
      metaDescriptionLength: metaDescMatch ? metaDescMatch[1].length : 0,
      hasH1: !!h1Match,
      hasSsl: url.startsWith('https://'),
      hasRobotsTxt: false,
      hasSitemap: false,
    };

    // Check robots.txt
    try {
      const robotsUrl = new URL('/robots.txt', url);
      const robotsRes = await fetch(robotsUrl.toString());
      seoHealth.hasRobotsTxt = robotsRes.ok;
    } catch {}

    // Check sitemap
    try {
      const sitemapUrl = new URL('/sitemap.xml', url);
      const sitemapRes = await fetch(sitemapUrl.toString());
      seoHealth.hasSitemap = sitemapRes.ok;
    } catch {}

    // Calculate SEO score
    let score = 0;
    if (seoHealth.hasTitle && seoHealth.titleLength >= 30 && seoHealth.titleLength <= 60) score += 20;
    if (seoHealth.hasMetaDescription && seoHealth.metaDescriptionLength >= 120 && seoHealth.metaDescriptionLength <= 160) score += 20;
    if (seoHealth.hasH1) score += 15;
    if (seoHealth.hasSsl) score += 20;
    if (seoHealth.hasRobotsTxt) score += 10;
    if (seoHealth.hasSitemap) score += 15;

    seoHealth.score = score;

    return seoHealth;
  } catch (error) {
    console.error('SEO analysis error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Run all scans in parallel
    const [performanceData, techStack, seoHealth] = await Promise.all([
      fetchPageSpeedInsights(url),
      detectTechStack(url),
      analyzeSEO(url),
    ]);

    const domain = new URL(url).hostname;

    // Generate Phase 2 mock data
    const backlinks = generateMockBacklinks(domain);
    const keywords = generateMockKeywords(domain);
    const traffic = generateMockTraffic(domain);

    const result = {
      url,
      domain,
      timestamp: Date.now(),
      techStack: techStack || {},
      performance: performanceData?.performance || {
        score: 0,
        fcp: 0,
        lcp: 0,
        cls: 0,
        tbt: 0,
        si: 0,
      },
      seoHealth: {
        ...seoHealth,
        score: Math.max(seoHealth?.score || 0, performanceData?.seoScore || 0),
      },
      // Phase 2 additions
      backlinks,
      keywords,
      traffic,
      status: 'completed',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan URL', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
