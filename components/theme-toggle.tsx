import { useAppTheme } from '@/contexts/theme-context';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      activeOpacity={0.8}
      className="bg-[#ff0054] p-3 rounded-xl items-center my-2 shadow-sm"
    >
      <Text className="text-white font-black text-xs">
        {theme === 'light' ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  );
}