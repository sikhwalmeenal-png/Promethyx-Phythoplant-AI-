import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { typography } from '../theme/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 to 100
  colors: any;
  duration?: number;
  fontSize?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  colors,
  duration = 1600,
  fontSize,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const animatedProgress = useSharedValue(0);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    // 1. Slide progress from 0 to target
    animatedProgress.value = 0;
    animatedProgress.value = withTiming(progress, {
      duration: duration,
      easing: Easing.out(Easing.quad),
    });

    // 2. Pulse gently if health exceeds 90%
    if (progress >= 90) {
      containerScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      containerScale.value = 1;
    }
  }, [progress, duration]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
    return {
      strokeDashoffset,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: containerScale.value }],
      shadowOpacity: progress >= 90 ? withRepeat(
        withSequence(
          withTiming(0.15, { duration: 1600 }),
          withTiming(0.08, { duration: 1600 })
        ),
        -1,
        true
      ) : 0.05,
    };
  });

  // Calculate the color of health dynamically
  const getHealthColor = (val: number) => {
    if (val >= 80) return colors.success;
    if (val >= 50) return colors.warning;
    return colors.error;
  };

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedContainerStyle]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="100%" stopColor={getHealthColor(progress)} />
          </LinearGradient>
        </Defs>
        {/* Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.background === '#0D0E0C' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#healthGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Label Overlay */}
      <View style={styles.labelContainer}>
        <Text style={[styles.valueText, { color: colors.text }, fontSize ? { fontSize } : {}]}>
          {Math.round(progress)}
        </Text>
        <Text style={[styles.labelText, { color: colors.textMuted }]}>
          HEALTH
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  svg: {
    position: 'absolute',
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: -2,
  },
});
