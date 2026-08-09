import { createLightTheme, type BrandVariants, type Theme } from '@fluentui/react-components';

/*
 * Fluent brand ramp derived from the Gold accent (#CCA471) — gold drives
 * primary buttons, focus rings, and links, matching its role as "primary
 * brand/accent color, used for buttons, highlights, active states."
 */
const gold: BrandVariants = {
  10: '#241A0E',
  20: '#3A2A17',
  30: '#4F3A21',
  40: '#644A2B',
  50: '#7A5C36',
  60: '#8F6D41',
  70: '#A47F4C',
  80: '#B78E58',
  90: '#CCA471',
  100: '#D5B383',
  110: '#DDC296',
  120: '#E4D0AA',
  130: '#EBDDBE',
  140: '#F1E7D0',
  150: '#F7F0E2',
  160: '#FBF7F0',
};

export const legalTheme: Theme = {
  ...createLightTheme(gold),
};

/** Full brand palette — use these instead of ad-hoc hex values in components. */
export const palette = {
  // Structural brand color — navigation, sidebar, headers.
  green: {
    900: '#1F2A20',
    700: '#384A3B',
    600: '#3E5241',
    500: '#49604C', // base
    400: '#7C8F7E',
    300: '#AEBBAF',
    200: '#D7DED8',
    100: '#EEF1EE',
    50: '#F6F8F6',
  },
  // Primary accent — buttons, highlights, active states.
  gold: {
    700: '#A9814C',
    600: '#B48A53',
    500: '#CCA471', // base
    400: '#DBBA8E',
    300: '#E3CBA9',
    200: '#EFE1CC',
    100: '#F8F1E6',
    50: '#FBF7F0',
  },
  black: {
    600: '#211C1E',
    500: '#707070',
    400: '#D9D9D9',
    300: '#EDEDED',
    200: '#F7F7F7',
    100: '#FFFFFF',
  },
  error: { 500: '#FB3748', 100: '#F8E4E7' },
  success: { 500: '#1FC16B', 100: '#E6F8E4' },
  warning: { 500: '#FB9237', 100: '#F8EFE4' },

  gradientGreen: 'linear-gradient(160deg, #384A3B 0%, #49604C 100%)',
  gradientGold: 'linear-gradient(135deg, #CCA471 0%, #E3CBA9 100%)',

  // Semantic aliases used throughout the app.
  textPrimary: '#211C1E',
  textSecondary: '#707070',
  border: '#D9D9D9',
  borderSubtle: '#EDEDED',
  pageBg: '#F7F7F7',
  cardBg: '#FFFFFF',
  lockedBg: '#F7F7F7',
};
