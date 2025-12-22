'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { isValidUrl, normalizeUrl } from '@/lib/utils';

interface UrlScannerProps {
  onScan: (url: string) => void;
  isScanning?: boolean;
}

export default function UrlScanner({ onScan, isScanning = false }: UrlScannerProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    onScan(normalizedUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-16 h-16 text-apex-cyan" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-5xl font-bold mb-4 text-gradient-cyan">
          Apex Intelligence
        </h1>
        <p className="text-xl text-white/60">
          Ultra-futuristic competitive intelligence in 30 seconds
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div
          className={`glass-panel p-2 transition-all duration-300 ${
            isFocused ? 'cyber-glow border-apex-cyan/50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-apex-cyan/70 ml-2" />

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter any website URL (e.g., competitor.com)"
              disabled={isScanning}
              className="flex-1 bg-transparent text-white text-lg placeholder:text-white/40 focus:outline-none py-3"
            />

            <motion.button
              type="submit"
              disabled={isScanning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-8 py-3 rounded-lg font-semibold
                bg-gradient-to-r from-apex-cyan to-blue-500
                hover:from-apex-cyan/90 hover:to-blue-500/90
                disabled:from-gray-600 disabled:to-gray-700
                disabled:cursor-not-allowed
                transition-all duration-300
                flex items-center gap-2
                shadow-[0_0_20px_rgba(0,240,255,0.3)]
              `}
            >
              {isScanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Scanning...
                </>
              ) : (
                <>
                  Initiate Scan
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-apex-crimson text-sm ml-2"
          >
            {error}
          </motion.p>
        )}
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-apex-emerald rounded-full animate-pulse" />
          <span>Real-time Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-apex-violet rounded-full animate-pulse" />
          <span>AI-Powered Insights</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-apex-cyan rounded-full animate-pulse" />
          <span>30-Second Reports</span>
        </div>
      </motion.div>
    </div>
  );
}
