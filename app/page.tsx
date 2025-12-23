'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import UrlScanner from '@/components/ui/url-scanner';
import ScanningAnimation from '@/components/ui/scanning-animation';
import ResultCards from '@/components/ui/result-cards';
import BacklinkAnalysis from '@/components/ui/backlink-analysis';
import KeywordAnalysis from '@/components/ui/keyword-analysis';
import TrafficAnalysis from '@/components/ui/traffic-analysis';
import { ScanResult } from '@/lib/types';
import { motion } from 'framer-motion';

// Dynamically import heavy 3D components
const ParticleBackground = dynamic(() => import('@/components/ui/particle-background'), { ssr: false });
const CompetitiveUniverse = dynamic(() => import('@/components/ui/competitive-universe'), { ssr: false });

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const result = await response.json();
      setScanResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during scanning');
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* WebGL Particle Background */}
      {scanResult && <ParticleBackground />}

      {/* Animated mesh background */}
      <div className="fixed inset-0 mesh-background opacity-30" />

      {/* Gradient orbs */}
      <div className="fixed top-20 -left-40 w-96 h-96 bg-apex-cyan/10 rounded-full blur-[100px]" />
      <div className="fixed bottom-20 -right-40 w-96 h-96 bg-apex-violet/10 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {!isScanning && !scanResult && !error && (
          <div className="min-h-screen flex items-center justify-center">
            <UrlScanner onScan={handleScan} isScanning={isScanning} />
          </div>
        )}

        {isScanning && (
          <div className="min-h-screen flex items-center justify-center">
            <ScanningAnimation />
          </div>
        )}

        {error && (
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 max-w-2xl text-center"
            >
              <div className="w-16 h-16 bg-apex-crimson/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-apex-crimson"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-apex-crimson mb-3">Scan Failed</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <button
                onClick={handleNewScan}
                className="px-6 py-3 bg-gradient-to-r from-apex-cyan to-blue-500 rounded-lg font-semibold hover:from-apex-cyan/90 hover:to-blue-500/90 transition-all"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        )}

        {scanResult && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-gradient-cyan"
              >
                Intelligence Report
              </motion.h1>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleNewScan}
                className="px-6 py-3 glass-panel-hover font-semibold transition-all"
              >
                New Scan
              </motion.button>
            </div>

            {/* Phase 1 Results */}
            <ResultCards result={scanResult} />

            {/* Phase 2: Advanced Analytics */}
            <div className="mt-6 space-y-6">
              {/* 3D Competitive Universe */}
              {scanResult.backlinks && (
                <CompetitiveUniverse
                  yourDomain={scanResult.domain}
                  competitors={scanResult.competitors}
                />
              )}

              {/* Traffic Analysis */}
              {scanResult.traffic && (
                <TrafficAnalysis data={scanResult.traffic} />
              )}

              {/* Backlink Profile */}
              {scanResult.backlinks && (
                <BacklinkAnalysis data={scanResult.backlinks} />
              )}

              {/* Keyword Rankings */}
              {scanResult.keywords && (
                <KeywordAnalysis data={scanResult.keywords} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/40 text-sm">
        <p>Apex Intelligence v0.2 | Phase 2 Complete</p>
      </footer>
    </main>
  );
}
