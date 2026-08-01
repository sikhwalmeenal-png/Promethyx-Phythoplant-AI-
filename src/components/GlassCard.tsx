import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, StyleProp } from 'react-native';
import { shadows } from '../theme/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  colors: any; // Passed from current active theme
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  colors,
  intensity = 'medium',
}) => {
  const getGlassStyles = () => {
    const isDark = colors.background === '#0D0E0C';
    
    // Customize transparency level based on intensity
    let bgOpacity = 0.8;
    if (intensity === 'low') bgOpacity = 0.95;
    if (intensity === 'high') bgOpacity = 0.5;

    const bg = isDark 
      ? `rgba(22, 24, 21, ${bgOpacity})` 
      : `rgba(255, 255, 255, ${bgOpacity})`;
      
    const border = isDark
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.05)';

    return {
      backgroundColor: bg,
      borderColor: border,
    };
  };

  const glassStyles = getGlassStyles();

  return (
    <View style={[
      styles.card, 
      glassStyles, 
      shadows.light, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        // iOS supports shadow natively
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
