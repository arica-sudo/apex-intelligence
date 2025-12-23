'use client';

import { motion } from 'framer-motion';
import {
  Gauge,
  Zap,
  Shield,
  Code2,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe2,
  Eye,
  Cpu,
  Cloud,
  Radar,
} from 'lucide-react';
import { ScanResult } from '@/lib/types';

interface ResultCardsProps {
  result: ScanResult;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const getColor = (score: number) => {
    if (score >= 90) return 'text-apex-emerald';
    if (score >= 50) return 'text-yellow-400';
    return 'text-apex-crimson';
  };

  return (
    <div className="flex flex-col items-center relative group">
      <div className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-apex-primary/25 via-apex-secondary/25 to-apex-accent/25 rounded-full" />
      <div className="relative w-32 h-32 mb-3">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={getColor(score)}
            initial={{ strokeDashoffset: 352 }}
            animate={{ strokeDashoffset: 352 - (352 * score) / 100 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: 352,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-3xl font-bold ${getColor(score)}`}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <p className="text-white/60 text-sm">{label}</p>
    </div>
  );
}

export default function ResultCards({ result }: ResultCardsProps) {
  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="glass-panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gradient-cyan mb-2">
              {result.domain}
            </h2>
            <p className="text-white/50 text-sm">
              Scanned: {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <CheckCircle2 className="w-16 h-16 text-apex-emerald" />
          </motion.div>
        </div>
      </motion.div>

      {/* Performance & SEO Scores */}
      <motion.div variants={item} className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <Gauge className="w-6 h-6 text-apex-cyan" />
          <h3 className="text-2xl font-semibold">Performance Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScoreGauge score={result.performance.score} label="Performance Score" />
          <ScoreGauge score={result.seoHealth.score} label="SEO Health Score" />
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'FCP', value: formatTime(result.performance.fcp) },
            { label: 'LCP', value: formatTime(result.performance.lcp) },
            { label: 'CLS', value: result.performance.cls.toFixed(3) },
            { label: 'TBT', value: formatTime(result.performance.tbt) },
            { label: 'SI', value: formatTime(result.performance.si) },
          ].map((metric) => (
            <div key={metric.label} className="text-center glass-panel-hover py-3">
              <p className="text-white/50 text-xs mb-1">{metric.label}</p>
              <p className="text-lg font-semibold text-apex-cyan">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Technology Stack */}
      <motion.div variants={item} className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-6 h-6 text-apex-violet" />
          <h3 className="text-2xl font-semibold">Technology Stack</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.techStack.cms && (
            <div className="glass-panel-hover p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-apex-cyan" />
                <p className="text-white/60 text-sm">CMS</p>
              </div>
              <p className="text-lg font-semibold">{result.techStack.cms}</p>
            </div>
          )}

          {result.techStack.framework && (
            <div className="glass-panel-hover p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-apex-violet" />
                <p className="text-white/60 text-sm">Framework</p>
              </div>
              <p className="text-lg font-semibold">{result.techStack.framework}</p>
            </div>
          )}

          {result.techStack.server && (
            <div className="glass-panel-hover p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-apex-emerald" />
                <p className="text-white/60 text-sm">Server</p>
              </div>
              <p className="text-lg font-semibold">{result.techStack.server}</p>
            </div>
          )}

          {result.techStack.cdn && (
            <div className="glass-panel-hover p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <p className="text-white/60 text-sm">CDN</p>
              </div>
              <p className="text-lg font-semibold">
                {Array.isArray(result.techStack.cdn) ? result.techStack.cdn.join(', ') : result.techStack.cdn}
              </p>
            </div>
          )}

          {result.techStack.hosting && result.techStack.hosting.length > 0 && (
            <div className="glass-panel-hover p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-apex-cyan" />
                <p className="text-white/60 text-sm">Hosting / Edge</p>
              </div>
              <p className="text-lg font-semibold">{result.techStack.hosting.join(', ')}</p>
            </div>
          )}
        </div>

        {[
          { title: 'Analytics & Tracking', items: result.techStack.analytics },
          { title: 'Marketing / Ads', items: result.techStack.marketing },
          { title: 'Payments', items: result.techStack.payments },
          { title: 'Chat / Support', items: result.techStack.chat },
          { title: 'A/B Testing', items: result.techStack.abTesting },
          { title: 'Monitoring / APM', items: result.techStack.monitoring },
          { title: 'Security / WAF', items: result.techStack.security },
          { title: 'Fonts', items: result.techStack.fonts },
          { title: 'Databases', items: result.techStack.databases },
          { title: 'Edge', items: result.techStack.edge },
          { title: 'Libraries', items: result.techStack.libraries },
        ]
          .filter(section => section.items && section.items.length)
          .map(section => (
            <div key={section.title} className="mt-4">
              <p className="text-white/60 text-sm mb-3">{section.title}</p>
              <div className="flex flex-wrap gap-2">
                {section.items!.map((itemLabel, i) => (
                  <span
                    key={`${section.title}-${i}`}
                    className="px-3 py-1 bg-apex-cyan/15 border border-apex-cyan/20 rounded-full text-sm"
                  >
                    {itemLabel}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </motion.div>

      {/* SEO Health Details */}
      <motion.div variants={item} className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-apex-emerald" />
          <h3 className="text-2xl font-semibold">SEO Health Check</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Meta Title</span>
            <div className="flex items-center gap-2">
              {result.seoHealth.hasTitle ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
                  <span className="text-sm text-white/60">
                    ({result.seoHealth.titleLength} chars)
                  </span>
                </>
              ) : (
                <XCircle className="w-5 h-5 text-apex-crimson" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Meta Description</span>
            <div className="flex items-center gap-2">
              {result.seoHealth.hasMetaDescription ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
                  <span className="text-sm text-white/60">
                    ({result.seoHealth.metaDescriptionLength} chars)
                  </span>
                </>
              ) : (
                <XCircle className="w-5 h-5 text-apex-crimson" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">H1 Tag</span>
            <div className="flex items-center gap-2">
              {result.seoHealth.hasH1 ? (
                <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
              ) : (
                <XCircle className="w-5 h-5 text-apex-crimson" />
              )}
              <span className="text-sm text-white/60">({result.seoHealth.h1Count} found)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">SSL Certificate</span>
            {result.seoHealth.hasSsl ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <AlertCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Robots.txt</span>
            {result.seoHealth.hasRobotsTxt ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">XML Sitemap</span>
            {result.seoHealth.hasSitemap ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Canonical</span>
            {result.seoHealth.hasCanonical ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Meta Robots</span>
            {result.seoHealth.hasMetaRobots ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Indexable</span>
            {!result.seoHealth.isNoindex ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Open Graph / Social</span>
            {result.seoHealth.hasOpenGraph || result.seoHealth.hasTwitterCard ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>

          <div className="flex items-center justify-between p-4 glass-panel-hover">
            <span className="text-white/80">Image Alts</span>
            {result.seoHealth.imageAltsPresent ? (
              <CheckCircle2 className="w-5 h-5 text-apex-emerald" />
            ) : (
              <AlertCircle className="w-5 h-5 text-apex-crimson" />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
