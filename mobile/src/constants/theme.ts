/**
 * CompanionHub design tokens.
 *
 * Design direction: warm, grounded, human — a companionship/activity app,
 * not a vanity feed. Deliberately avoids the two most common "AI app"
 * defaults (Instagram-style purple/pink gradients, Facebook blue) in favor
 * of a palette that reads as outdoorsy/trustworthy/warm. See
 * mobile/DESIGN.md for the full rationale.
 */
import { Platform } from 'react-native';

// ─── Color ──────────────────────────────────────────────────────────────────

export const Colors = {
  light: {
    // Brand
    ink: '#0F3D3E', // Deep Ink Teal — primary brand color, headers, primary buttons
    inkDeep: '#0A2B2C', // pressed/active state of ink
    coral: '#FF6B5B', // signature accent — used sparingly for key CTAs, badges
    coralDeep: '#E85444',
    sand: '#E8B94A', // secondary accent — warmth, ratings, highlights
    sage: '#6B8F71', // safety/success/verified states

    // Surfaces
    background: '#FBF7F2', // warm off-white, not stark white
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    surfaceSunken: '#F2ECE3',
    border: '#E8E0D4',
    borderStrong: '#D8CDBB',

    // Text
    text: '#1C1917', // warm near-black
    textSecondary: '#6B6560',
    textTertiary: '#9C948A',
    textOnInk: '#FBF7F2',
    textOnCoral: '#FFFFFF',

    // Semantic
    danger: '#D14343',
    dangerSurface: '#FDEBEA',
    warning: '#C7871E',
    warningSurface: '#FBF0DD',
    success: '#4C7A52',
    successSurface: '#EAF2EB',
    info: '#2C6E75',
    infoSurface: '#E7F1F2',
  },
  dark: {
    ink: '#7FD6C9',
    inkDeep: '#9FE3D8',
    coral: '#FF8778',
    coralDeep: '#FF6B5B',
    sand: '#F0C868',
    sage: '#8FB596',

    background: '#12100E',
    surface: '#1C1917',
    surfaceRaised: '#25211E',
    surfaceSunken: '#0B0A08',
    border: '#332E29',
    borderStrong: '#453F38',

    text: '#F5F0E8',
    textSecondary: '#B8AFA3',
    textTertiary: '#877D71',
    textOnInk: '#0A2B2C',
    textOnCoral: '#2A0D08',

    danger: '#FF6B5B',
    dangerSurface: '#3A1815',
    warning: '#F0C868',
    warningSurface: '#3A2E12',
    success: '#8FB596',
    successSurface: '#16261A',
    info: '#7FD6C9',
    infoSurface: '#122A2C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Typography ─────────────────────────────────────────────────────────────
// Fraunces (display serif with real character) for headlines — the single
// biggest lever for not looking like every other app's bold-sans header.
// Manrope (humanist sans) for body/UI text. JetBrains Mono for prices,
// timestamps, and booking codes — a small technical texture that reinforces
// "this is a real place, a real time, a real activity."

export const FontFamily = {
  display: 'Fraunces_600SemiBold',
  displayMedium: 'Fraunces_500Medium',
  displayItalic: 'Fraunces_500Medium_Italic',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemiBold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  mono: 'JetBrainsMono_500Medium',
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
  '4xl': 44,
} as const;

export const LineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  md: 26,
  lg: 28,
  xl: 32,
  '2xl': 38,
  '3xl': 44,
  '4xl': 52,
} as const;

// ─── Spacing / radius / shadow ──────────────────────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

/** Soft, warm shadows — never pure black, matches the warm palette. */
export const Shadow = {
  sm: {
    shadowColor: '#3A2E1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#3A2E1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#3A2E1F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
