'use client';

import { motion } from 'framer-motion';
import { Link2, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { BacklinkData } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BacklinkAnalysisProps {
  data: BacklinkData;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BacklinkAnalysis({ data }: BacklinkAnalysisProps) {
  const authorityData = [
    { name: 'DR 0-30', value: data.authorityDistribution.dr0to30, color: '#ff0055' },
    { name: 'DR 31-50', value: data.authorityDistribution.dr31to50, color: '#ff9500' },
    { name: 'DR 51-70', value: data.authorityDistribution.dr51to70, color: '#00f0ff' },
    { name: 'DR 71-100', value: data.authorityDistribution.dr71to100, color: '#00ff94' },
  ];

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      className="glass-panel p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link2 className="w-6 h-6 text-apex-violet" />
          <h3 className="text-2xl font-semibold">Backlink Profile</h3>
        </div>
        {data.dataSource && (
          <span className={`text-xs px-3 py-1 rounded-full ${
            data.dataSource === 'real' 
              ? 'bg-apex-emerald/20 text-apex-emerald border border-apex-emerald/30'
              : data.dataSource === 'hybrid'
              ? 'bg-apex-cyan/20 text-apex-cyan border border-apex-cyan/30'
              : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
          }`}>
            {data.dataSource === 'real' ? '✓ Real Data' : data.dataSource === 'hybrid' ? '⚡ Hybrid' : '📊 Estimated'}
          </span>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Total Backlinks</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-apex-cyan"
          >
            {data.totalBacklinks.toLocaleString()}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Referring Domains</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-apex-violet"
          >
            {data.referringDomains.toLocaleString()}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Domain Rating</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-apex-emerald"
          >
            {data.domainRating}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Link Velocity</p>
          <div className="flex items-center justify-center gap-3">
            <div className="text-center">
              <div className="flex items-center gap-1 text-apex-emerald mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-lg font-bold">+{data.newBacklinks30d}</span>
              </div>
              <p className="text-xs text-white/50">New</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-apex-crimson mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-lg font-bold">-{data.lostBacklinks30d}</span>
              </div>
              <p className="text-xs text-white/50">Lost</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white/80">
            Authority Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={authorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {authorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 14, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend
                  wrapperStyle={{ color: '#fff' }}
                  formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white/80">
            Quality Insights
          </h4>
          <div className="space-y-3">
            <div className="glass-panel-hover p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">High Authority Links</span>
                <span className="text-apex-emerald font-semibold">
                  {data.authorityDistribution.dr71to100}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.authorityDistribution.dr71to100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-apex-emerald h-2 rounded-full"
                />
              </div>
            </div>

            <div className="glass-panel-hover p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Medium Authority Links</span>
                <span className="text-apex-cyan font-semibold">
                  {data.authorityDistribution.dr51to70}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.authorityDistribution.dr51to70}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-apex-cyan h-2 rounded-full"
                />
              </div>
            </div>

            <div className="glass-panel-hover p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Low Authority Links</span>
                <span className="text-yellow-400 font-semibold">
                  {data.authorityDistribution.dr31to50}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.authorityDistribution.dr31to50}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-yellow-400 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Backlinks */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-white/80">
          Top Referring Domains
        </h4>
        <div className="space-y-3">
          {data.topBacklinks.map((backlink, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="glass-panel-hover p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-apex-violet/20 rounded-lg">
                    <ExternalLink className="w-5 h-5 text-apex-violet" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{backlink.domain}</p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          backlink.type === 'dofollow'
                            ? 'bg-apex-emerald/20 text-apex-emerald'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {backlink.type}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">"{backlink.anchorText}"</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/50 mb-1">DR</p>
                  <p className="text-xl font-bold text-apex-cyan">{backlink.dr}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
