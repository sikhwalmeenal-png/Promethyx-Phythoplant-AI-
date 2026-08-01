import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const seedScale = useSharedValue(0);
  const sproutScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Drop and scale the seed
    seedScale.value = withSpring(1, { damping: 10, stiffness: 100 });

    // 2. Germinate sprout leaf structure after 1.2s
    sproutScale.value = withDelay(
      1200,
      withSpring(1, { damping: 12, stiffness: 80 })
    );

    // 3. Fade in text and branding
    textOpacity.value = withDelay(
      2000,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) })
    );
    logoTranslateY.value = withDelay(
      2000,
      withTiming(0, { duration: 1000, easing: Easing.out(Easing.quad) })
    );

    // 4. Trigger exit fadeout after 3.8s
    const fadeTimer = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 800, easing: Easing.inOut(Easing.quad) }, (isFinished) => {
        if (isFinished) {
          onAnimationEnd();
        }
      });
    }, 3800);

    return () => clearTimeout(fadeTimer);
  }, []);

  const seedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: seedScale.value }],
    };
  });

  const sproutStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: sproutScale.value },
        { translateY: -15 } // grows upward
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: logoTranslateY.value }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: screenOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background radial spotlight visual */}
      <View style={styles.radialGlow} />

      {/* SVG Growth Center */}
      <View style={styles.germinationFrame}>
        {/* The Sprouting leaves */}
        <Animated.View style={[styles.sproutWrapper, sproutStyle]}>
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            {/* Stem */}
            <Path
              d="M12 22C12 22 12 12 12 8"
              stroke="#10B981"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <Path
              d="M12 11C12 11 6 10 4 7C4 7 10 4 12 11Z"
              fill="#34D399"
            />
            {/* Right Leaf */}
            <Path
              d="M12 11C12 11 18 10 20 7C20 7 14 4 12 11Z"
              fill="#059669"
            />
          </Svg>
        </Animated.View>

        {/* The Seed */}
        <Animated.View style={[styles.seedWrapper, seedStyle]}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={8} fill="#78350F" />
          </Svg>
        </Animated.View>
      </View>

      {/* Branding Info */}
      <Animated.View style={[styles.brandContainer, textStyle]}>
        <Text style={styles.logoText}>PROMETHYX</Text>
        <Text style={styles.taglineText}>Listening to Nature Before It Speaks</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0D0E0C', // Premium dark mode background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  radialGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    borderRadius: (SCREEN_WIDTH * 1.5) / 2,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  germinationFrame: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  sproutWrapper: {
    position: 'absolute',
    bottom: 40,
    zIndex: 2,
  },
  seedWrapper: {
    position: 'absolute',
    bottom: 24,
    zIndex: 1,
  },
  brandContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 8,
  },
  taglineText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#10B981',
    letterSpacing: 0.5,
    marginTop: 12,
  },
});
