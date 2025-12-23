'use client';

import { motion } from 'framer-motion';
import { Search, TrendingUp, Target } from 'lucide-react';
import { KeywordData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface KeywordAnalysisProps {
  data: KeywordData;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function KeywordAnalysis({ data }: KeywordAnalysisProps) {
  const positionData = [
    { name: 'Top 3', count: data.positionDistribution.top3, color: '#00ff94' },
    { name: 'Top 10', count: data.positionDistribution.top10, color: '#00f0ff' },
    { name: 'Top 20', count: data.positionDistribution.top20, color: '#9d00ff' },
    { name: 'Top 50', count: data.positionDistribution.top50, color: '#ff9500' },
    { name: 'Top 100', count: data.positionDistribution.top100, color: '#ff0055' },
  ];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return 'text-apex-crimson';
    if (difficulty >= 50) return 'text-yellow-400';
    return 'text-apex-emerald';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-apex-emerald';
    if (position <= 10) return 'text-apex-cyan';
    if (position <= 20) return 'text-apex-violet';
    return 'text-white/60';
  };

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      className="glass-panel p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-apex-cyan" />
          <h3 className="text-2xl font-semibold">Keyword Rankings</h3>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Total Keywords</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gradient-cyan"
          >
            {data.totalKeywords.toLocaleString()}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Top 3 Positions</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-apex-emerald"
          >
            {data.positionDistribution.top3}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Top 10 Positions</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-apex-cyan"
          >
            {data.positionDistribution.top10}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <p className="text-white/60 text-sm mb-2">Est. Monthly Traffic</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-apex-violet"
          >
            {(data.topKeywords ?? []).reduce((sum, k) => sum + (k.traffic || 0), 0).toLocaleString()}
          </motion.p>
        </div>
      </div>

      {/* Position Distribution Chart */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-white/80">
          Position Distribution
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={positionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                stroke="#fff"
                tick={{ fill: 'rgba(255,255,255,0.6)' }}
              />
              <YAxis
                stroke="#fff"
                tick={{ fill: 'rgba(255,255,255,0.6)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 14, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {positionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Keywords Table */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-white/80">
          Top Performing Keywords
        </h4>
        <div className="space-y-3">
          {(data.topKeywords ?? []).map((keyword, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="glass-panel-hover p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Keyword */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-apex-cyan/20 rounded-lg text-sm font-bold text-apex-cyan">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{keyword.keyword}</p>
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div className="md:col-span-2 text-center">
                  <p className="text-xs text-white/50 mb-1">Position</p>
                  <div className="flex items-center justify-center gap-1">
                    <Target className="w-4 h-4" />
                    <span className={`text-lg font-bold ${getPositionColor(keyword.position)}`}>
                      #{keyword.position}
                    </span>
                  </div>
                </div>

                {/* Volume */}
                <div className="md:col-span-2 text-center">
                  <p className="text-xs text-white/50 mb-1">Volume</p>
                  <p className="text-sm font-semibold text-white">
                    {(keyword.searchVolume ?? 0).toLocaleString()}
                  </p>
                </div>

                {/* Difficulty */}
                <div className="md:col-span-2 text-center">
                  <p className="text-xs text-white/50 mb-1">Difficulty</p>
                  <span className={`text-sm font-semibold ${getDifficultyColor(keyword.difficulty)}`}>
                    {keyword.difficulty}%
                  </span>
                </div>

                {/* Traffic */}
                <div className="md:col-span-2 text-center">
                  <p className="text-xs text-white/50 mb-1">Traffic</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-apex-emerald" />
                    <span className="text-sm font-semibold text-apex-emerald">
                      {(keyword.traffic ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
