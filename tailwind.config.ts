import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Dark Mode Colors - Modern Enterprise
        'apex-dark': '#0B0E14', // Deep Charcoal
        'apex-darker': '#060812',

        // Light Mode Colors - Modern Enterprise
        'apex-light': '#F8FAFC', // Soft Slate
        'apex-lighter': '#FFFFFF',

        // Accent Colors (Theme-aware)
        'apex-primary': '#6366F1', // Electric Indigo (Dark)
        'apex-primary-light': '#2563EB', // Cobalt Blue (Light)
        'apex-secondary': '#8B5CF6', // Purple
        'apex-accent': '#3B82F6', // Blue

        // Status Colors
        'apex-success': '#10B981', // Emerald
        'apex-warning': '#F59E0B', // Amber
        'apex-danger': '#EF4444', // Red

        // Legacy Colors
        'apex-cyan': '#06B6D4',
        'apex-violet': '#8B5CF6',
        'apex-emerald': '#10B981',
        'apex-crimson': '#EF4444',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
