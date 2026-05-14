// Flo Brand Colors & Design Tokens
export const Colors = {
  primary: '#FF5A76',        // Flo pink/coral
  primaryLight: '#FF8099',
  primaryDark: '#E0415F',
  primaryBg: '#FFF0F3',      // Very light pink bg for screens

  purple: '#8B5CF6',         // Accent purple
  purpleLight: '#EDE9FE',

  green: '#10B981',
  greenLight: '#D1FAE5',

  blue: '#3B82F6',
  blueLight: '#DBEAFE',

  orange: '#F59E0B',
  orangeLight: '#FEF3C7',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F9F9F9',
  lightGray: '#F3F3F3',
  border: '#E8E8E8',
  borderDark: '#D0D0D0',

  // Text
  textPrimary: '#1A1A2E',    // Near black
  textSecondary: '#6B6B7A',  // Medium gray
  textMuted: '#9999AA',      // Light gray

  // Dark mode
  darkBg: '#0F0F1A',
  darkCard: '#1A1A2E',
  darkBorder: '#2D2D3F',
  darkText: '#FFFFFF',
  darkTextSecondary: '#9999BB',
};

export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 38,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#FF5A76',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
