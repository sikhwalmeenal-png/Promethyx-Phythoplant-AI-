import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface BreathingPlantProps {
  imageUri: string;
  health: number;
  status: 'Healthy' | 'Needs Attention' | 'Critical';
  size?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

interface ParticleConfig {
  id: number;
  delay: number;
  startX: number;
  type: 'pollen' | 'leaf';
  scale: number;
}

// Spacial Floating particles
const FloatingElement: React.FC<{
  delay: number;
  startX: number;
  type: 'pollen' | 'leaf';
  scale: number;
  color: string;
}> = ({ delay, startX, type, scale, color }) => {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(-200, { duration: 5000, easing: Easing.out(Easing.quad) })
        )
      ),
      -1,
      false
    );

    x.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(Math.random() > 0.5 ? 24 : -24, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
        )
      ),
      -1,
      true
    );

    if (type === 'leaf') {
      rotation.value = withRepeat(
        withDelay(
          delay,
          withTiming(360, { duration: 3500, easing: Easing.linear })
        ),
        -1,
        false
      );
    }

    opacity.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(0.65, { duration: 800 }),
          withTiming(0.65, { duration: 3200 }),
          withTiming(0, { duration: 1000 })
        )
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const transforms: any[] = [
      { translateY: y.value },
      { translateX: x.value },
      { scale }
    ];
    if (type === 'leaf') {
      transforms.push({ rotate: `${rotation.value}deg` });
    }
    return {
      transform: transforms,
      opacity: opacity.value,
    };
  });

  if (type === 'pollen') {
    return (
      <Animated.View
        style={[
          styles.pollenParticle,
          {
            left: `${startX}%`,
            backgroundColor: '#FCD34D',
            shadowColor: '#FCD34D',
            shadowRadius: 4,
            shadowOpacity: 0.6,
          },
          animatedStyle,
        ]}
      />
    );
  }

  return (
    <Animated.View style={[styles.leafParticle, { left: `${startX}%` }, animatedStyle]}>
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C17 7 17 17 12 22C7 17 7 7 12 2Z"
          fill={color}
          opacity={0.8}
        />
      </Svg>
    </Animated.View>
  );
};

// Tap explosion burst leaf component
const TransientLeaf: React.FC<{
  angle: number;
  color: string;
  size: number;
}> = ({ angle, color, size }) => {
  const distance = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    distance.value = withTiming(size * 0.45, { duration: 750, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(0, { duration: 750, easing: Easing.out(Easing.quad) });
    rotation.value = withTiming(Math.random() > 0.5 ? 180 : -180, { duration: 750 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const xVal = Math.cos(angle) * distance.value;
    const yVal = Math.sin(angle) * distance.value;
    return {
      transform: [
        { translateX: xVal },
        { translateY: yVal },
        { rotate: `${rotation.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.transientWrap, animatedStyle]}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C17 7 17 17 12 22C7 17 7 7 12 2Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
};

export const BreathingPlant: React.FC<BreathingPlantProps> = ({
  imageUri,
  health,
  status,
  size = 200,
  style,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const sway = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);

  // Micro-interaction touch offsets
  const tapScale = useSharedValue(1);
  const tapRotate = useSharedValue(0);

  // Transient leaf state list
  const [bursts, setBursts] = useState<{ id: number; angle: number }[]>([]);

  const getBreathingDuration = () => {
    if (status === 'Critical') return 1200;
    if (status === 'Needs Attention') return 2200;
    return 3600;
  };

  const getGlowColor = () => {
    if (status === 'Critical') return 'rgba(239, 68, 68, 0.4)';
    if (status === 'Needs Attention') return 'rgba(245, 158, 11, 0.4)';
    return 'rgba(16, 185, 129, 0.35)';
  };

  useEffect(() => {
    const duration = getBreathingDuration();

    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration, easing: Easing.bezier(0.25, 0.8, 0.25, 1) }),
        withTiming(0.96, { duration, easing: Easing.bezier(0.25, 0.8, 0.25, 1) })
      ),
      -1,
      true
    );

    sway.value = withRepeat(
      withSequence(
        withTiming(2, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }),
        withTiming(-2, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: duration * 1.1, easing: Easing.linear }),
        withTiming(0.25, { duration: duration * 1.1, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, [status, health]);

  const animatedPlantStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * tapScale.value },
        { rotate: `${sway.value + tapRotate.value}deg` }
      ],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const handlePress = () => {
    // 1. Spring scaling bounce
    tapScale.value = withSequence(
      withSpring(1.12, { damping: 4, stiffness: 200 }),
      withSpring(1.0, { damping: 10, stiffness: 100 })
    );

    // 2. Shake leaf wiggle
    tapRotate.value = withSequence(
      withTiming(8, { duration: 70 }),
      withTiming(-8, { duration: 70 }),
      withTiming(6, { duration: 70 }),
      withTiming(-6, { duration: 70 }),
      withTiming(0, { duration: 80 })
    );

    // 3. Spawn 5 explosion bursts
    const numLeafs = 5;
    const newBursts = Array.from({ length: numLeafs }).map((_, i) => ({
      id: Date.now() + i,
      angle: (i * 2 * Math.PI) / numLeafs + (Math.random() - 0.5) * 0.4,
    }));
    setBursts(newBursts);

    // 4. Trigger dialogue callbacks
    if (onPress) {
      onPress();
    }
  };

  const glowColor = getGlowColor();

  const particles: ParticleConfig[] = [
    { id: 1, delay: 0, startX: 20, type: 'pollen', scale: 1 },
    { id: 2, delay: 600, startX: 35, type: 'leaf', scale: 0.9 },
    { id: 3, delay: 1200, startX: 55, type: 'pollen', scale: 0.7 },
    { id: 4, delay: 1800, startX: 70, type: 'leaf', scale: 1.1 },
    { id: 5, delay: 2500, startX: 30, type: 'pollen', scale: 1.2 },
    { id: 6, delay: 3200, startX: 60, type: 'leaf', scale: 0.8 },
    { id: 7, delay: 3900, startX: 45, type: 'pollen', scale: 0.6 },
    { id: 8, delay: 4500, startX: 80, type: 'leaf', scale: 1.0 },
  ];

  return (
    <Pressable onPress={handlePress} style={[styles.container, { width: size, height: size }, style]}>
      {/* Background Soft Sunlight Aura */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 0.95,
            height: size * 0.95,
            borderRadius: (size * 0.95) / 2,
            backgroundColor: glowColor,
            shadowColor: glowColor,
            shadowRadius: size * 0.5,
            shadowOpacity: 0.95,
            elevation: 12,
          },
          animatedGlowStyle,
        ]}
      />

      {/* Floating Particles Layer */}
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        {particles.map(p => (
          <FloatingElement
            key={p.id}
            delay={p.delay}
            startX={p.startX}
            type={p.type}
            scale={p.scale}
            color={status === 'Healthy' ? '#34D399' : status === 'Needs Attention' ? '#FBBF24' : '#F87171'}
          />
        ))}
      </View>

      {/* Interactive Tap Explosion Burst */}
      {bursts.map(b => (
        <TransientLeaf
          key={b.id}
          angle={b.angle}
          color={status === 'Healthy' ? '#10B981' : '#FBBF24'}
          size={size}
        />
      ))}

      {/* Breathing and Swaying Plant */}
      <Animated.View style={[styles.plantWrapper, animatedPlantStyle]}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.plantImage, { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.16 }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Overflow Leaves (Popping out depth) */}
      <View style={[styles.overflowLeaf, { left: -10, bottom: size * 0.1 }]}>
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <Path
            d="M2 22C7 22 17 17 22 12C17 7 7 7 2 12C2 12 2 22 2 22Z"
            fill={status === 'Healthy' ? '#10B981' : '#F59E0B'}
          />
        </Svg>
      </View>

      <View style={[styles.overflowLeaf, { right: -12, top: size * 0.08 }]}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '45deg' }] }}>
          <Path
            d="M2 22C7 22 17 17 22 12C17 7 7 7 2 12C2 12 2 22 2 22Z"
            fill={status === 'Healthy' ? '#059669' : '#D97706'}
          />
        </Svg>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
  },
  plantWrapper: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  pollenParticle: {
    position: 'absolute',
    bottom: 30,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    zIndex: 1,
  },
  leafParticle: {
    position: 'absolute',
    bottom: 30,
    zIndex: 1,
  },
  transientWrap: {
    position: 'absolute',
    zIndex: 99,
  },
  overflowLeaf: {
    position: 'absolute',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
