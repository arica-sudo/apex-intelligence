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
        // Premium SaaS Color Palette (Wiz.io inspired)
        'apex-dark': '#0B0D17',
        'apex-darker': '#060812',
        'apex-primary': '#6366F1', // Indigo
        'apex-secondary': '#8B5CF6', // Purple
        'apex-accent': '#3B82F6', // Blue
        'apex-success': '#10B981', // Emerald
        'apex-warning': '#F59E0B', // Amber
        'apex-danger': '#EF4444', // Red
        'apex-cyan': '#06B6D4', // Cyan (toned down)
        'apex-violet': '#8B5CF6', // Purple
        'apex-emerald': '#10B981', // Emerald
        'apex-crimson': '#EF4444', // Red
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
