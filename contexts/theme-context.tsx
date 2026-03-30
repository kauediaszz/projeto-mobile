// contexts/theme-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useColorScheme as useNativeWindTheme } from "nativewind"; // Importante para o Tailwind

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const { setColorScheme } = useNativeWindTheme(); // Hook do NativeWind
  
  // Começamos com o tema do sistema, mas o estado 'theme' controlará o app
  const [theme, setTheme] = useState<ThemeMode>(deviceColorScheme ?? 'light');

  // Este useEffect garante que o NativeWind mude as cores (dark:bg-...) sempre que o tema mudar
  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme deve ser usado dentro de AppThemeProvider');
  return context;
}
