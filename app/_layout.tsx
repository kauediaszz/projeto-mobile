import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { AuthProvider } from "@/contexts/auth-context";
import { DietProvider } from "@/contexts/diet-context";
import { AppThemeProvider, useAppTheme } from "@/contexts/theme-context";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </AppThemeProvider>
  );
}

function MainLayout() {
  const { theme } = useAppTheme();

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <DietProvider>
        <Slot />
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </DietProvider>
    </ThemeProvider>
  );
}
