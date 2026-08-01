import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  style?: any;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1200,
  decimals = 0,
  style,
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    let animFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeOutQuad = progress * (2 - progress);
      const current = startValue + easeOutQuad * (endValue - startValue);
      
      setDisplayValue(current);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, [value, duration]);

  return (
    <Text style={style}>
      {displayValue.toFixed(decimals)}
      {suffix}
    </Text>
  );
};
