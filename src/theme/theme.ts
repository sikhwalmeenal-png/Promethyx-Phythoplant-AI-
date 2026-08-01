export interface ThemeColors {
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  shadow: string;
  glassBackground: string;
  glassBorder: string;
}

export const lightTheme: ThemeColors = {
  background: '#F9F9F6', // Premium soft beige
  card: '#FFFFFF',       // Pure white
  cardBorder: 'rgba(0, 0, 0, 0.04)',
  text: '#111827',       // Dark slate grey
  textMuted: '#6B7280',  // Warm grey
  primary: '#10B981',    // Vibrant emerald green
  primaryLight: '#D1FAE5',
  primaryDark: '#065F46', // Deep forest green
  accent: '#10B981',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.03)',
  glassBackground: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
};

export const darkTheme: ThemeColors = {
  background: '#0D0E0C', // Very dark slate/black (Nothing OS style)
  card: '#161815',       // Dark grey card
  cardBorder: 'rgba(255, 255, 255, 0.04)',
  text: '#F3F4F6',       // Off-white
  textMuted: '#9CA3AF',  // Muted grey
  primary: '#10B981',    // Emerald green
  primaryLight: '#064E3B',
  primaryDark: '#D1FAE5',
  accent: '#10B981',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#2A2C27',
  shadow: 'rgba(0, 0, 0, 0.3)',
  glassBackground: 'rgba(22, 24, 21, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
    giant: 36,
  },
  fontWeights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  premium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};
