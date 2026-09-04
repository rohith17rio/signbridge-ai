/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#0B0F19',       // Deep Space Black
          navy: '#121A2B',     // Dark Navy
          card: '#1A2335',     // Dark Graphite
          border: '#2A364F',   // Cyber Border
        },
        cyan: {
          neon: '#00E5FF',     // Neon Cyan Accent
          glow: 'rgba(0, 229, 255, 0.4)',
        },
        electric: '#3B82F6',   // Electric Blue
        neonGreen: '#22C55E',  // Neon Green Success
        warning: '#F59E0B',    // Orange Warning
        danger: '#EF4444',     // Red Error
        txt: {
          primary: '#FFFFFF',
          secondary: '#B8C5D6',
          disabled: '#6B7280',
        },
        brand: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00e5ff',     // Neon Cyan
          600: '#00b0ff',
          700: '#0091ea',
          800: '#01579b',
          900: '#0b0f19',
          950: '#080c14',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'scan': 'scanLine 3s linear infinite',
        'cyber-pulse': 'cyberPulse 2s ease-in-out infinite',
        'cyan-glow': 'cyanGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        cyberPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        cyanGlow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 229, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
