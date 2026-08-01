import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface ShimmerLoaderProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
  colors: any;
}

export const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({
  width,
  height,
  borderRadius = 12,
  style,
  colors,
}) => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    // Pulse animation: 35% opacity to 70% opacity and back, repeating infinitely
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.linear }),
        withTiming(0.35, { duration: 800, easing: Easing.linear })
      ),
      -1, // Loop infinitely
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const getShimmerColor = () => {
    return colors.background === '#0D0E0C' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.06)';
  };

  return (
    <Animated.View
      style={[
        styles.shimmer,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: getShimmerColor(),
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  shimmer: {
    overflow: 'hidden',
  },
});
