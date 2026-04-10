import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function hexToRgba(hex: string, alpha = 1) {
  const h = String(hex).replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type NavProps = {
  mudarTela: (screen: string) => void;
  telaAtual: string;
  bgColor?: string;
  textColor?: string;
};

export default function Nav({
  mudarTela,
  telaAtual,
  bgColor = '#ff0054',
  textColor = '#ffffff',
}: NavProps) {
  const [navWidth, setNavWidth] = useState(0);
  const navStyle = { backgroundColor: bgColor };
  const activeTextColor = { color: textColor, fontWeight: '700' as const };
  const inactiveTextColor = { color: hexToRgba(textColor, 0.85) };

  const items = [
    { key: 'home', label: 'HOME' },
    { key: 'calculation', label: 'CALCULATION' },
    { key: 'about', label: 'ABOUT' },
  ];

  const activeIndex = items.findIndex((item) => item.key === telaAtual);
  const indicatorWidth = navWidth > 0 ? navWidth / items.length : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    setNavWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.nav, navStyle]} onLayout={handleLayout}>
      {navWidth > 0 && activeIndex >= 0 && (
        <View
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              transform: [{ translateX: activeIndex * indicatorWidth }],
            },
          ]}
        />
      )}

      {items.map((item) => {
        const active = item.key === telaAtual;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => mudarTela(item.key)}
            activeOpacity={0.85}
          >
            <Text style={active ? [styles.itemText, activeTextColor] : [styles.itemText, inactiveTextColor]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  item: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  itemText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
