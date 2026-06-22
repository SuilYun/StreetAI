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
                    900: '#f8fafc',
                    800: '#ffffff',
                    700: '#e2e8f0',
                    600: '#cbd5e1',
                    500: '#94a3b8',
                    400: '#64748b',
                    300: '#475569',
                    200: '#334155',
                    100: '#0f172a',
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
                },
                // Mishmi Tribe color palette
                'forest': {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#1B4332',
                    900: '#14352a',
                    950: '#0a1f18',
                },
                'earth': {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#d6c3b6',
                    400: '#b8977e',
                    500: '#8D6E63',
                    600: '#7a5c52',
                    700: '#654a42',
                    800: '#523d37',
                    900: '#44342f',
                },
                'beige': {
                    DEFAULT: '#F5F5DC',
                    50: '#FEFEF8',
                    100: '#FCFCF0',
                    200: '#F9F9E3',
                    300: '#F5F5DC',
                    400: '#EDEDD0',
                    500: '#E0E0B8',
                    600: '#C9C994',
                    700: '#ADAD6E',
                    800: '#8A8A50',
                    900: '#5E5E36',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                playfair: ['Playfair Display', 'Georgia', 'serif'],
                inter: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-in': 'slideIn 0.3s ease-out',
                'spin-slow': 'spin 8s linear infinite',
                'fade-up': 'fadeUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'scale-in': 'scaleIn 0.5s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'scroll-hint': 'scrollHint 2s ease-in-out infinite',
                'typewriter': 'typewriter 3.5s steps(40, end)',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                scrollHint: {
                    '0%, 100%': { opacity: '1', transform: 'translateY(0)' },
                    '50%': { opacity: '0.5', transform: 'translateY(12px)' },
                },
                typewriter: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },
                blink: {
                    '50%': { borderColor: 'transparent' },
                },
            },
            backgroundImage: {
                'gradient-forest': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
                'gradient-earth': 'linear-gradient(135deg, #8D6E63 0%, #A1887F 50%, #BCAAA4 100%)',
                'gradient-hero': 'linear-gradient(180deg, rgba(27,67,50,0.7) 0%, rgba(27,67,50,0.3) 50%, rgba(27,67,50,0.8) 100%)',
            },
        },
    },
    plugins: [],
}
