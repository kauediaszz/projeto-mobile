import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TypingTextProps = {
  texts?: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  delay?: number;
};

export default function TypingText({
  texts = [],
  typingSpeed = 100,
  erasingSpeed = 50,
  delay = 1500,
}: TypingTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!texts.length) return;

    const current = texts[textIndex] || '';
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + current[charIndex]);
        setCharIndex((i) => i + 1);
      }, typingSpeed);
    } else if (charIndex === current.length) {
      timeout = setTimeout(() => setCharIndex((i) => i + 1), delay);
    } else {
      timeout = setTimeout(() => {
        if (displayedText.length > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
        } else {
          setCharIndex(0);
          setTextIndex((ti) => (ti + 1) % texts.length);
        }
      }, erasingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, displayedText, textIndex, texts, typingSpeed, erasingSpeed, delay]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{displayedText}</Text>
      <Text style={styles.cursor}>|</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
  cursor: {
    marginLeft: 2,
    fontSize: 20,
    fontWeight: '700',
  },
});
