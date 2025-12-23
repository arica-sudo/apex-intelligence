'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }} // Haptic-style feedback!
      className="
        relative w-14 h-8 rounded-full
        bg-gradient-to-r from-apex-primary to-apex-accent
        dark:from-apex-primary dark:to-apex-secondary
        shadow-lg
        flex items-center justify-between px-1
        transition-all duration-300
      "
      aria-label="Toggle theme"
    >
      {/* Toggle indicator */}
      <motion.div
        className="
          absolute w-6 h-6 rounded-full
          bg-white dark:bg-apex-dark
          shadow-md
        "
        animate={{
          x: theme === 'dark' ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* Sun icon (Light mode) */}
      <Sun
        className={`w-4 h-4 z-10 transition-opacity ${
          theme === 'light' ? 'text-yellow-500 opacity-100' : 'text-white opacity-50'
        }`}
      />

      {/* Moon icon (Dark mode) */}
      <Moon
        className={`w-4 h-4 z-10 transition-opacity ${
          theme === 'dark' ? 'text-indigo-300 opacity-100' : 'text-white opacity-50'
        }`}
      />
    </motion.button>
  );
}
