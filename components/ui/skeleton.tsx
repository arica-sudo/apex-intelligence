'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 dark:from-white/5 dark:via-white/10 dark:to-white/5";

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-panel p-6 space-y-4">
      <Skeleton variant="text" width="60%" height="24px" />
      <Skeleton variant="text" width="100%" height="16px" />
      <Skeleton variant="text" width="80%" height="16px" />
      <div className="flex gap-3 mt-4">
        <Skeleton variant="rectangular" width="100px" height="40px" />
        <Skeleton variant="rectangular" width="100px" height="40px" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width="200px" height="32px" />
        <Skeleton variant="rectangular" width="120px" height="40px" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Large content skeleton */}
      <div className="glass-panel p-6">
        <Skeleton variant="rectangular" width="100%" height="400px" />
      </div>
    </div>
  );
}
