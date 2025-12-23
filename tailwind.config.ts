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

        // Luxe palette
        'apex-dark': '#070910',    // Obsidian
        'apex-darker': '#04060c',
        'apex-light': '#0b0d13',
        'apex-lighter': '#0f1420',

        'apex-primary': '#4fb7c7',      // Muted cyan
        'apex-primary-light': '#5ac8d8',
        'apex-secondary': '#7c7cf2',    // Soft indigo
        'apex-accent': '#1f9cb5',       // Deep teal

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
