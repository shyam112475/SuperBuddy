/**
 * SuperBuddy Premium Design System
 * 
 * Establishes visual language for premium, modern, Airbnb-inspired experience
 * All colors, spacing, typography, shadows, transitions defined here
 */

// ============================================================================
// COLOR PALETTE - Premium, Modern, Sophisticated
// ============================================================================

export const colors = {
  // Primary Brand Color - Warm, Inviting, Modern Coral/Burgundy
  // Used for CTAs, highlights, premium states
  primary: {
    50: '#fffbf9',
    100: '#ffe8e2',
    200: '#ffd4c7',
    300: '#ffb5a0',
    400: '#ff8f6e',
    500: '#ff6b4a', // Main primary
    600: '#e84e2e', // Darker shade
    700: '#c73622',
    800: '#a52b1a',
    900: '#8a2218',
  },

  // Secondary Accent - Emerald Green (trust, growth, nature)
  // Used for success states, verification, safety indicators
  accent: {
    50: '#f0fdf8',
    100: '#d9f9ed',
    200: '#b3f0da',
    300: '#80e5c2',
    400: '#4cd9ac',
    500: '#22c98f', // Main accent
    600: '#18a070',
    700: '#128857',
    800: '#0f6c45',
    900: '#0b5738',
  },

  // Neutrals - Premium, warm-leaning grays
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

  // Alert/Warning States
  warning: {
    50: '#fffbf0',
    100: '#fef3d9',
    500: '#f59e0b',
    600: '#d97706',
  },

  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },

  success: {
    50: '#f0fdf4',
    100: '#dbeafe',
    500: '#22c98f',
    600: '#16a34a',
  },

  // Glass/Overlay
  glass: {
    dark: 'rgba(26, 24, 21, 0.8)',
    light: 'rgba(255, 255, 255, 0.95)',
  },
};

// ============================================================================
// SPACING SCALE - Generous, breathing whitespace
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  80: '20rem',
  96: '24rem',
};

// ============================================================================
// TYPOGRAPHY - Intentional hierarchy, premium feel
// ============================================================================

export const typography = {
  // Display - Hero sections, major headings
  display: {
    // 56px / 1.2 / 700
    xl: {
      fontSize: '3.5rem',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    // 48px / 1.2 / 700
    lg: {
      fontSize: '3rem',
      lineHeight: '1.2',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    // 36px / 1.25 / 700
    md: {
      fontSize: '2.25rem',
      lineHeight: '1.25',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },

  // Heading - Page titles, section headers
  heading: {
    // 32px / 1.3 / 600
    xl: {
      fontSize: '2rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    // 28px / 1.3 / 600
    lg: {
      fontSize: '1.75rem',
      lineHeight: '1.3',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    // 24px / 1.35 / 600
    md: {
      fontSize: '1.5rem',
      lineHeight: '1.35',
      fontWeight: 600,
    },
    // 20px / 1.4 / 600
    sm: {
      fontSize: '1.25rem',
      lineHeight: '1.4',
      fontWeight: 600,
    },
    // 18px / 1.4 / 600
    xs: {
      fontSize: '1.125rem',
      lineHeight: '1.4',
      fontWeight: 600,
    },
  },

  // Body - Main content, descriptions
  body: {
    // 18px / 1.6 / 400
    lg: {
      fontSize: '1.125rem',
      lineHeight: '1.6',
      fontWeight: 400,
    },
    // 16px / 1.6 / 400
    md: {
      fontSize: '1rem',
      lineHeight: '1.6',
      fontWeight: 400,
    },
    // 14px / 1.6 / 400
    sm: {
      fontSize: '0.875rem',
      lineHeight: '1.6',
      fontWeight: 400,
    },
    // 13px / 1.5 / 400
    xs: {
      fontSize: '0.8125rem',
      lineHeight: '1.5',
      fontWeight: 400,
    },
  },

  // Label - Form labels, captions, small text
  label: {
    // 14px / 1.5 / 500
    md: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: 500,
    },
    // 13px / 1.4 / 500
    sm: {
      fontSize: '0.8125rem',
      lineHeight: '1.4',
      fontWeight: 500,
    },
    // 12px / 1.4 / 600
    xs: {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 600,
      letterSpacing: '0.005em',
    },
  },
};

// ============================================================================
// BORDER RADIUS - Modern, friendly
// ============================================================================

export const radius = {
  none: '0',
  xs: '0.25rem',  // 4px
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',  // 32px
  full: '9999px',
};

// ============================================================================
// SHADOWS - Layered depth, premium elevation
// ============================================================================

export const shadows = {
  none: 'none',

  // Subtle, elegant shadows
  xs: '0 1px 2px 0 rgba(26, 24, 21, 0.05)',
  sm: '0 1px 3px 0 rgba(26, 24, 21, 0.1), 0 1px 2px 0 rgba(26, 24, 21, 0.06)',
  md: '0 4px 6px -1px rgba(26, 24, 21, 0.1), 0 2px 4px -1px rgba(26, 24, 21, 0.06)',
  lg: '0 10px 15px -3px rgba(26, 24, 21, 0.1), 0 4px 6px -2px rgba(26, 24, 21, 0.05)',
  xl: '0 20px 25px -5px rgba(26, 24, 21, 0.1), 0 10px 10px -5px rgba(26, 24, 21, 0.04)',
  '2xl': '0 25px 50px -12px rgba(26, 24, 21, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(26, 24, 21, 0.05)',

  // Elevated cards - premium feel
  card: '0 4px 16px rgba(26, 24, 21, 0.08)',
  cardHover: '0 12px 24px rgba(26, 24, 21, 0.12)',

  // Interactive elements
  button: '0 2px 8px rgba(26, 24, 21, 0.1)',
  buttonHover: '0 6px 16px rgba(26, 24, 21, 0.12)',

  // Glass morphism effect
  glass: '0 8px 32px rgba(26, 24, 21, 0.1)',
};

// ============================================================================
// TRANSITIONS - Smooth, purposeful animations
// ============================================================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  verySlow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ============================================================================
// Z-INDEX SCALE - Layering consistency
// ============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
};

// ============================================================================
// COMPONENT SIZES - Consistent sizing
// ============================================================================

export const sizes = {
  // Button sizes
  button: {
    xs: { height: '2rem', padding: '0 0.75rem', fontSize: '0.8125rem' }, // 32px
    sm: { height: '2.5rem', padding: '0 1rem', fontSize: '0.875rem' },   // 40px
    md: { height: '2.75rem', padding: '0 1.25rem', fontSize: '0.875rem' }, // 44px
    lg: { height: '3rem', padding: '0 1.5rem', fontSize: '1rem' },       // 48px
    xl: { height: '3.5rem', padding: '0 2rem', fontSize: '1rem' },       // 56px
  },

  // Input/Select sizes
  input: {
    sm: { height: '2.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }, // 40px
    md: { height: '2.75rem', padding: '0.625rem 1rem', fontSize: '0.875rem' }, // 44px
    lg: { height: '3rem', padding: '0.75rem 1rem', fontSize: '1rem' },        // 48px
  },

  // Avatar sizes
  avatar: {
    xs: '1.75rem',  // 28px
    sm: '2rem',     // 32px
    md: '2.75rem',  // 44px
    lg: '3.5rem',   // 56px
    xl: '4.5rem',   // 72px
  },

  // Icon sizes
  icon: {
    xs: '1rem',     // 16px
    sm: '1.25rem',  // 20px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '2.5rem',   // 40px
  },
};

// ============================================================================
// GRADIENTS - Subtle, sophisticated
// ============================================================================

export const gradients = {
  // Brand gradients
  brandToAccent: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.accent[500]} 100%)`,
  brandToOpaque: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,

  // Subtle background gradients
  subtleLight: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
  subtleDark: `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[900]} 100%)`,

  // Overlay gradients
  overlayBottom: `linear-gradient(to top, rgba(0,0,0,0.3), transparent)`,
  overlayTop: `linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)`,
};
