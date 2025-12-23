'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface HapticButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function HapticButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: HapticButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2";

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-apex-primary to-apex-accent
      hover:from-apex-primary/90 hover:to-apex-accent/90
      dark:from-apex-primary dark:to-apex-accent
      text-white
      shadow-lg shadow-apex-primary/20
    `,
    secondary: `
      glass-panel-hover
      text-white dark:text-white
    `,
    ghost: `
      hover:bg-white/5
      text-white/70 hover:text-white
    `
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }} // Haptic-style animation!
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
