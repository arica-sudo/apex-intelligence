'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const scanningMessages = [
  "Initiating deep scan...",
  "Analyzing HTML structure...",
  "Detecting technology stack...",
  "Measuring Core Web Vitals...",
  "Evaluating SEO health...",
  "Processing performance metrics...",
  "Scanning security headers...",
  "Mapping site architecture...",
  "Finalizing intelligence report...",
];

export default function ScanningAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % scanningMessages.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-12 text-center"
      >
        {/* Scanning beam animation */}
        <div className="relative h-32 mb-8 overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-apex-cyan/30 to-transparent"
            style={{
              filter: 'blur(20px)',
            }}
          />

          {/* Particle field */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 100 - 50,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 200 - 100,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute w-1 h-1 bg-apex-cyan rounded-full"
              />
            ))}
          </div>

          {/* Central pulsing orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-full bg-apex-cyan/20 border-2 border-apex-cyan"
            />
          </div>
        </div>

        {/* Status messages */}
        <div className="h-20 flex flex-col items-center justify-center">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xl text-white/80 mb-2"
          >
            {scanningMessages[messageIndex]}
          </motion.p>

          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-apex-cyan rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 10,
              ease: "easeInOut",
            }}
            className="h-full bg-gradient-to-r from-apex-cyan via-apex-violet to-apex-emerald"
          />
        </div>

        <p className="mt-4 text-sm text-white/50">
          Analyzing 50+ data points...
        </p>
      </motion.div>
    </div>
  );
}
