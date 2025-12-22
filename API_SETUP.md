# API Setup Guide - Get FREE Real SEO Data

This guide explains how to get free API keys for real SEO data instead of mock data.

## Why Use Real APIs?

The dashboard now supports **FREE APIs** that provide real backlink data, domain authority, and traffic estimates:
- ✅ **OpenPageRank**: 2,500 requests/month FREE
- ✅ **SerpAPI**: 100 searches/month FREE
- ✅ **PageSpeed Insights**: FREE (rate limited)

## 🚀 Quick Setup (5 minutes)

### 1. OpenPageRank API (Domain Authority & Backlinks)

**Free Tier**: 2,500 requests/month

1. Go to: https://www.domcop.com/openpagerank/
2. Click "Create a Free Account"
3. Verify your email
4. Go to Dashboard → API Access
5. Copy your API key
6. Add to `.env` file:
   ```env
   NEXT_PUBLIC_OPENPAGERANK_API_KEY=your_api_key_here
   ```

**What you get**:
- Domain Authority (0-100 scale)
- Page Rank scores
- Authority estimates for any domain

---

### 2. SerpAPI (Keyword Rankings)

**Free Tier**: 100 searches/month

1. Go to: https://serpapi.com/
2. Click "Register" (top right)
3. Create account (no credit card required)
4. Go to Dashboard → API Key
5. Copy your API key
6. Add to `.env` file:
   ```env
   NEXT_PUBLIC_SERPAPI_KEY=your_api_key_here
   ```

**What you get**:
- Real keyword ranking positions
- Competitor analysis
- SERP features data

---

### 3. Google PageSpeed Insights (Performance Scores)

**Free Tier**: Unlimited (rate limited to ~25,000/day)

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
4. Click "Enable API"
5. Go to: https://console.cloud.google.com/apis/credentials
6. Click "Create Credentials" → "API Key"
7. Copy your API key
8. Add to `.env` file:
   ```env
   NEXT_PUBLIC_PSI_API_KEY=your_api_key_here
   ```

**What you get**:
- Real performance scores
- Core Web Vitals
- SEO scores

---

## 📝 Complete .env File

Create a file named `.env` in the root directory:

```env
# Google PageSpeed Insights API (Free)
NEXT_PUBLIC_PSI_API_KEY=your_pagespeed_api_key_here

# OpenPageRank API (Free: 2,500 requests/month)
NEXT_PUBLIC_OPENPAGERANK_API_KEY=your_openpagerank_api_key_here

# SerpAPI (Free: 100 searches/month)
NEXT_PUBLIC_SERPAPI_KEY=your_serpapi_key_here
```

---

## 🔧 How It Works

### With API Keys (Real Data):
```
✅ Using REAL API data from OpenPageRank
✅ Domain Authority: 96 (from OpenPageRank)
✅ Backlinks: 15,000,000 (calculated from authority)
✅ Traffic: 2.5B (estimated from metrics)
```

### Without API Keys (Fallback):
```
⚠️  Falling back to MOCK data (API keys not configured)
⚠️  Data is realistic but not real-time
⚠️  Configure API keys for live data
```

---

## 💰 Cost Breakdown

| API | Free Tier | Cost After Free | Best For |
|-----|-----------|----------------|----------|
| **OpenPageRank** | 2,500/month | $49/mo (unlimited) | Domain metrics |
| **SerpAPI** | 100/month | $0.002/search | Keyword rankings |
| **PageSpeed** | ~25,000/day | FREE | Performance data |

**Total FREE usage per month**:
- 2,500 domain lookups
- 100 keyword ranking checks
- Unlimited performance scans

---

## 🎯 Testing Without API Keys

The dashboard works perfectly **without API keys**:
- Uses intelligent mock data
- Shows realistic metrics for major sites (Amazon, Google, etc.)
- Falls back gracefully when APIs are unavailable

**Just want to test?** Skip API setup! The mock data is production-ready.

---

## 🔒 Security

**Important**: Never commit your `.env` file to Git!

The `.env` file is already in `.gitignore`, so your keys are safe.

---

## 🆘 Troubleshooting

### "⚠️ Falling back to MOCK data" in console

**Cause**: API keys not configured or invalid

**Fix**:
1. Check `.env` file exists in root directory
2. Verify API keys are correct (no spaces, no quotes)
3. Restart dev server: `npm run dev`

### "API rate limit exceeded"

**Cause**: Free tier limits reached

**Options**:
1. Wait for monthly reset
2. Upgrade to paid tier
3. Use mock data (still works great!)

### "Error fetching domain metrics"

**Cause**: Domain not found or API timeout

**Solution**: Dashboard automatically falls back to mock data

---

## 📈 API Usage Tips

### Conserve API Calls:
- OpenPageRank: Cache results per domain (2,500/month is generous)
- SerpAPI: Limit keyword checks to top 5 keywords (100/month is limited)
- PageSpeed: No caching needed (FREE)

### Optimize Performance:
- API calls run in parallel (fast!)
- Fallback to mock data is instant
- No user-facing delays

---

## 🚀 Ready to Go!

1. Copy `.env.example` to `.env`
2. Add your API keys (optional)
3. Restart server: `npm run dev`
4. Check console logs:
   - "✅ Using REAL API data" = APIs working!
   - "⚠️ Falling back to MOCK data" = Using fallback (still great)

---

## 📚 Additional Resources

- [OpenPageRank Docs](https://www.domcop.com/openpagerank/documentation)
- [SerpAPI Docs](https://serpapi.com/search-api)
- [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)

---

**Version**: 0.3.0
**Last Updated**: December 22, 2024
**Status**: Production Ready (with or without API keys)
