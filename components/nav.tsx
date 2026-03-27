import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const navStyle = { backgroundColor: bgColor };
  const activeTextColor = { color: textColor, fontWeight: '700' as const };
  const inactiveTextColor = { color: hexToRgba(textColor, 0.85) };

  const btn = (key: string, label: string) => {
    const active = telaAtual === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.item, active ? styles.itemActive : styles.itemInactive]}
        onPress={() => mudarTela(key)}
        activeOpacity={0.85}>
        <Text style={active ? [styles.itemText, activeTextColor] : [styles.itemText, inactiveTextColor]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.nav, navStyle]}>
      {btn('home', 'HOME')}
      {btn('calculation', 'CALCULATION')}
      {btn('about', 'ABOUT')}
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
  },
  item: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  itemActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  itemInactive: {},
  itemText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
