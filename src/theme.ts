import { createLightTheme, type BrandVariants, type Theme } from '@fluentui/react-components';

/*
 * "Diwan" design system — a legal/enterprise identity built around a deep
 * ink-navy structural color and a burnished brass accent, instead of stock
 * Fluent blue. Named for the Arabic ديوان (archive / council register).
 *
 * Brand ramp derived from the brass accent (#A9812E) — drives primary
 * buttons, focus rings, links and active states.
 */
const brass: BrandVariants = {
  10: '#1C1503',
  20: '#2E2306',
  30: '#40300A',
  40: '#523D0E',
  50: '#644A12',
  60: '#765717',
  70: '#88651D',
  80: '#9A7324',
  90: '#A9812E',
  100: '#B98F3C',
  110: '#C79D4E',
  120: '#D3AC63',
  130: '#DEBC7B',
  140: '#E8CC95',
  150: '#F1DFB2',
  160: '#F9F1D9',
};

export const legalTheme: Theme = {
  ...createLightTheme(brass),
};

/** Full brand palette — use these instead of ad-hoc hex values in components. */
export const palette = {
  // Structural brand color — sidebar, headers, dark surfaces.
  ink: {
    900: '#0B111C',
    800: '#121B2C',
    700: '#1A2740',
    600: '#243456',
    500: '#2F4270', // base
    400: '#5B6E93',
    300: '#8C9BB8',
    200: '#C3CCDD',
    100: '#E7EBF2',
    50: '#F4F6FA',
  },
  // Primary accent — buttons, highlights, active states, key numerals.
  brass: {
    700: '#7C5E1F',
    600: '#8F6D26',
    500: '#A9812E', // base
    400: '#C1A25A',
    300: '#D3BC82',
    200: '#E6D9B3',
    100: '#F3ECD9',
    50: '#FAF6EC',
  },
  // Reserved for critical/urgent status — a seal-wax burgundy, calmer than pure red.
  burgundy: {
    600: '#5C1A26',
    500: '#7A2331',
    100: '#F5E3E6',
  },
  sage: { 600: '#2C5B41', 500: '#3F7A56', 100: '#E3F0E7' },
  amber: { 600: '#8F5C1B', 500: '#B8792B', 100: '#FBEEDD' },
  slate: { 600: '#3C4552', 500: '#8A93A3', 100: '#EEF1F5' },

  neutral: {
    900: '#1B1F27',
    700: '#3A4150',
    500: '#6B7280',
    400: '#98A1AF',
    300: '#C7CDD6',
    200: '#E2E6EC',
    150: '#EBEEF2',
    100: '#F4F6F9',
    50: '#FAFBFD',
  },

  error: { 500: '#B3261E', 100: '#FBE7E5' },
  success: { 500: '#2C5B41', 100: '#E3F0E7' },
  warning: { 500: '#B8792B', 100: '#FBEEDD' },

  gradientInk: 'linear-gradient(165deg, #121B2C 0%, #243456 100%)',
  gradientBrass: 'linear-gradient(135deg, #A9812E 0%, #D3BC82 100%)',

  // Semantic aliases used throughout the app.
  textPrimary: '#1B1F27',
  textSecondary: '#6B7280',
  textOnDark: '#F4F6FA',
  border: '#E2E6EC',
  borderStrong: '#C7CDD6',
  borderSubtle: '#EBEEF2',
  pageBg: '#F7F8FA',
  cardBg: '#FFFFFF',
  lockedBg: '#F4F6F9',
};

/** Spacing scale (px) — use multiples for consistent rhythm. */
export const space = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
};

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  pill: '999px',
};

export const shadow = {
  xs: '0 1px 2px rgba(11, 17, 28, 0.06)',
  sm: '0 2px 8px rgba(11, 17, 28, 0.08)',
  md: '0 8px 24px rgba(11, 17, 28, 0.10)',
  lg: '0 16px 40px rgba(11, 17, 28, 0.16)',
  brassGlow: '0 6px 16px rgba(169, 129, 46, 0.28)',
};

/** Motion durations/easings — kept short and purposeful for a Power Apps runtime. */
export const motion = {
  fast: '120ms',
  base: '180ms',
  slow: '280ms',
  easing: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
};

/** Status → color mapping shared by badges, timeline dots, and stat cards. */
export type StatusTone = 'brass' | 'ink' | 'sage' | 'burgundy' | 'amber' | 'slate';

export const toneColor: Record<StatusTone, { fg: string; bg: string; solid: string }> = {
  brass: { fg: palette.brass[600], bg: palette.brass[100], solid: palette.brass[500] },
  ink: { fg: palette.ink[600], bg: palette.ink[100], solid: palette.ink[500] },
  sage: { fg: palette.sage[600], bg: palette.sage[100], solid: palette.sage[500] },
  burgundy: { fg: palette.burgundy[600], bg: palette.burgundy[100], solid: palette.burgundy[500] },
  amber: { fg: palette.amber[600], bg: palette.amber[100], solid: palette.amber[500] },
  slate: { fg: palette.slate[600], bg: palette.slate[100], solid: palette.slate[500] },
};
