import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface TypingTextProps {
  text: string;
  speed?: number;
  style?: any;
}

export const TypingText: React.FC<TypingTextProps> = ({ text, speed = 25, style }) => {
  const [displayedText, setDisplayedText] = useState('');
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    setDisplayedText('');
    let idx = 0;
    
    // Clear interval before creating a new one
    const timer = setInterval(() => {
      if (idx < text.length) {
        setDisplayedText(prev => prev + text.charAt(idx));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  useEffect(() => {
    // Infinite blinking cursor loop
    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      true
    );
  }, []);

  const cursorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cursorOpacity.value,
    };
  });

  return (
    <Text style={style}>
      {displayedText}
      <Animated.Text style={[styles.cursor, cursorAnimatedStyle]}>▎</Animated.Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  cursor: {
    color: '#10B981',
    fontWeight: 'bold',
  },
});
