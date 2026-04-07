import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

type ParticlesProps = {
  count?: number;
};

function pickRandom(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function Particles({ count = 40 }: ParticlesProps) {
  const emojis = useMemo(
    () => ['🥗', '💧', '🏃', '❤️', '🥤', '🍎', '🏋️', '📅', '✅', '⏱️'],
    []
  );

  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 26 + 16;
      const duration = Math.random() * 3500 + 4500;
      const delay = Math.random() * 1500;
      return { i, left, top, size, duration, delay, emoji: pickRandom(emojis) };
    });
  }, [count, emojis]);

  const anims = useRef(items.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    items.forEach((_, idx) => {
      const animation = anims[idx];
      const run = () => {
        animation.setValue(0);
        Animated.timing(animation, {
          toValue: 18,
          duration: items[idx].duration,
          delay: items[idx].delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }).start(() => run());
      };
      run();
    });
  }, [items, anims]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {items.map((item, idx) => {
        const translateY = anims[idx].interpolate({
          inputRange: [0, 18],
          outputRange: [0, item.size * 0.35],
        });
        return (
          <Animated.View
            key={item.i}
            style={[
              styles.particle,
              {
                left: `${item.left}%`,
                top: `${item.top}%`,
                width: item.size,
                height: item.size,
                transform: [{ translateY }],
              },
            ]}>
            <View
              style={[
                styles.emojiWrap,
                { width: item.size, height: item.size, borderRadius: item.size / 2 },
              ]}>
              <Text style={[styles.emojiText, { fontSize: item.size * 0.58 }]}>{item.emoji}</Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  emojiWrap: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    color: 'white',
    fontWeight: '700',
  },
});
