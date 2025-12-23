'use client';

import { motion } from 'framer-motion';
import { BarChart3, Globe, Clock, Users } from 'lucide-react';
import { TrafficData } from '@/lib/types';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrafficAnalysisProps {
  data: TrafficData;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TrafficAnalysis({ data }: TrafficAnalysisProps) {
  const trafficSourcesData = [
    { name: 'Organic', value: data.trafficSources.organic, color: '#00ff94' },
    { name: 'Direct', value: data.trafficSources.direct, color: '#00f0ff' },
    { name: 'Referral', value: data.trafficSources.referral, color: '#9d00ff' },
    { name: 'Social', value: data.trafficSources.social, color: '#ff9500' },
    { name: 'Paid', value: data.trafficSources.paid, color: '#ff0055' },
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
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
          <BarChart3 className="w-6 h-6 text-apex-emerald" />
          <h3 className="text-2xl font-semibold">Traffic Intelligence</h3>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel-hover p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-apex-cyan" />
            <p className="text-white/60 text-sm">Monthly Visits</p>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-apex-cyan"
          >
            {(data.monthlyVisits / 1000000).toFixed(1)}M
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-apex-emerald" />
            <p className="text-white/60 text-sm">Bounce Rate</p>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-apex-emerald"
          >
            {data.bounceRate}%
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-apex-violet" />
            <p className="text-white/60 text-sm">Pages/Session</p>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-apex-violet"
          >
            {data.pagesPerSession}
          </motion.p>
        </div>

        <div className="glass-panel-hover p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <p className="text-white/60 text-sm">Avg. Duration</p>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-yellow-400"
          >
            {formatDuration(data.avgSessionDuration)}
          </motion.p>
        </div>
      </div>

      {/* Traffic History Chart */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-white/80">
          Traffic Trend (Last 6 Months)
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trafficHistory}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                stroke="#fff"
                tick={{ fill: 'rgba(255,255,255,0.6)' }}
              />
              <YAxis
                stroke="#fff"
                tick={{ fill: 'rgba(255,255,255,0.6)' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 14, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: any) => [`${(value / 1000000).toFixed(2)}M visits`, 'Traffic']}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#00f0ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources & Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white/80">
            Traffic Sources
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {trafficSourcesData.map((entry, index) => (
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
                  formatter={(value: any) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white/80">
            Geographic Distribution
          </h4>
          <div className="space-y-3">
            {data.topCountries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-panel-hover p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-apex-cyan" />
                    <span className="font-semibold text-white">{country.country}</span>
                  </div>
                  <span className="text-apex-cyan font-semibold">{country.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${country.percentage}%` }}
                    transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    className="bg-gradient-to-r from-apex-cyan to-apex-violet h-2 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
