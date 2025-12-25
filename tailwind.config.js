/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Organic Green Palette
                'primary': '#0A0A0A',           // Deep black
                'secondary': '#1A1A1A',          // Soft black
                'olive': {
                    900: '#5D8736',              // Dark olive - primary accent
                    700: '#6B9340',
                    600: '#809D3C',              // Medium olive
                    500: '#8EAB4A',
                    400: '#A9C46C',              // Light olive
                    300: '#B8CF82',
                    200: '#D4E4AA',
                    100: '#F4FFC3',              // Cream lime - light accent
                    50: '#FAFFEB',
                },
                'muted': '#6B6B6B',              // Muted gray
                'light': '#F5F5F5',              // Off white
                'cream': '#FAFAFA',              // Pure cream
                // Alias for easier use
                'accent': '#5D8736',
                'accent-light': '#A9C46C',
            },
            fontFamily: {
                'display': ['var(--font-display)', 'system-ui', 'sans-serif'],
                'body': ['var(--font-body)', 'system-ui', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'display-xl': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
                'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
                'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'reveal': 'reveal 1s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(40px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                reveal: {
                    '0%': { clipPath: 'inset(0 100% 0 0)' },
                    '100%': { clipPath: 'inset(0 0 0 0)' },
                },
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
};
