/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mission': {
                    900: '#f8fafc',   // page background (was dark navy)
                    800: '#ffffff',   // card/panel background
                    700: '#e2e8f0',   // borders
                    600: '#cbd5e1',   // subtle borders
                    500: '#94a3b8',   // muted elements
                    400: '#64748b',   // secondary text
                    300: '#475569',   // body text
                    200: '#334155',   // strong text
                    100: '#0f172a',   // headings / primary text
                },
                'detect': {
                    pothole: '#ef4444',
                    crack: '#f59e0b',
                    erosion: '#8b5cf6',
                    safe: '#10b981',
                },
                'accent': {
                    blue: '#3b82f6',
                    cyan: '#06b6d4',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-in': 'slideIn 0.3s ease-out',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
