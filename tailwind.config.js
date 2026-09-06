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
        sonar: {
          blue: '#1b74e4',
          cyan: '#00bcd4',
          dark: '#0f172a',
          surface: '#1e293b',
          card: '#1e293b',
          border: '#334155',
          accent: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        flutter: {
          blue: '#02569B',
          sky: '#0175C2',
          light: '#13B9FD',
          navy: '#042B59'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"IBM Plex Sans Thai"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        thai: ['"IBM Plex Sans Thai"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
