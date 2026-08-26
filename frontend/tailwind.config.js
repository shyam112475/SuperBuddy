/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Brand - Modern Coral/Burgundy
        brand: {
          50: '#fffbf9',
          100: '#ffe8e2',
          200: '#ffd4c7',
          300: '#ffb5a0',
          400: '#ff8f6e',
          500: '#ff6b4a',
          600: '#e84e2e',
          700: '#c73622',
          800: '#a52b1a',
          900: '#8a2218',
        },

        // Accent - Emerald (trust, growth, safety)
        emerald: {
          50: '#f0fdf8',
          100: '#d9f9ed',
          200: '#b3f0da',
          300: '#80e5c2',
          400: '#4cd9ac',
          500: '#22c98f',
          600: '#18a070',
          700: '#128857',
          800: '#0f6c45',
          900: '#0b5738',
        },

        // Premium Neutral Grays (warm-leaning)
        neutral: {
          0: '#ffffff',
          50: '#fafaf9',
          100: '#f5f3f0',
          150: '#f0eded',
          200: '#e8e6e3',
          300: '#d4d2cf',
          400: '#b8b6b1',
          500: '#9c9a95',
          600: '#7a7875',
          700: '#5a5854',
          800: '#3a3835',
          900: '#1a1815',
        },
      },

      // Extended border radius
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      // Extended shadows for premium feel
      boxShadow: {
        xs: '0 1px 2px 0 rgba(26, 24, 21, 0.05)',
        sm: '0 1px 3px 0 rgba(26, 24, 21, 0.1), 0 1px 2px 0 rgba(26, 24, 21, 0.06)',
        md: '0 4px 6px -1px rgba(26, 24, 21, 0.1), 0 2px 4px -1px rgba(26, 24, 21, 0.06)',
        lg: '0 10px 15px -3px rgba(26, 24, 21, 0.1), 0 4px 6px -2px rgba(26, 24, 21, 0.05)',
        xl: '0 20px 25px -5px rgba(26, 24, 21, 0.1), 0 10px 10px -5px rgba(26, 24, 21, 0.04)',
        '2xl': '0 25px 50px -12px rgba(26, 24, 21, 0.25)',
        'card': '0 4px 16px rgba(26, 24, 21, 0.08)',
        'card-hover': '0 12px 24px rgba(26, 24, 21, 0.12)',
        'button': '0 2px 8px rgba(26, 24, 21, 0.1)',
        'button-hover': '0 6px 16px rgba(26, 24, 21, 0.12)',
        'glass': '0 8px 32px rgba(26, 24, 21, 0.1)',
      },

      // Premium transitions
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },

      // Backdrop blur for glass effect
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },

      // Gradients
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #ff6b4a 0%, #22c98f 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #fafaf9 0%, #f5f3f0 100%)',
        'overlay-bottom': 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
        'overlay-top': 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)',
      },
    },
  },
  plugins: [],
};
