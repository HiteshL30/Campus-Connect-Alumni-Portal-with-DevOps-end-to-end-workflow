/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                accent: {
                    50: '#fdf4ff',
                    100: '#fae8ff',
                    400: '#e879f9',
                    500: '#d946ef',
                    600: '#c026d3',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 20px 40px -10px rgba(0, 0, 0, 0.08)',
                'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
                'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
                'neon': '0 0 10px rgba(59,130,246,0.5), 0 0 30px rgba(59,130,246,0.25)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient': 'gradient 6s ease infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'wave': 'wave 1.5s ease-in-out infinite',
                'pulse-ring': 'pulseRing 1.5s ease-out infinite',
                'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards',
                'slide-in-right': 'slideInRight 0.4s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'border-glow': 'borderGlow 3s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(59,130,246,0.3)' },
                    '50%': { boxShadow: '0 0 25px rgba(59,130,246,0.7), 0 0 50px rgba(59,130,246,0.3)' },
                },
                wave: {
                    '0%, 100%': { transform: 'scaleY(1)' },
                    '50%': { transform: 'scaleY(1.5)' },
                },
                pulseRing: {
                    '0%': { transform: 'scale(0.8)', opacity: '0.8' },
                    '100%': { transform: 'scale(2)', opacity: '0' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
                    '70%': { transform: 'scale(0.9)', opacity: '0.9' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                borderGlow: {
                    '0%, 100%': { borderColor: 'rgba(59,130,246,0.3)' },
                    '50%': { borderColor: 'rgba(139,92,246,0.6)' },
                },
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
            },
            backgroundSize: {
                '300%': '300%',
            },
        },
    },
    plugins: [],
}
