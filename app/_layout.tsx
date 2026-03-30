import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { DietProvider } from "@/contexts/diet-context";
import { AppThemeProvider, useAppTheme } from "@/contexts/theme-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    // Inicializa o motor de tema customizado
    <AppThemeProvider>
      <MainLayout />
    </AppThemeProvider>
  );
}

function MainLayout() {
  // Consome a variável 'theme' que foi definida no contexts/theme-context.tsx
  const { theme } = useAppTheme();

  return (
    // O ThemeProvider do sistema agora obedece ao botão
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <DietProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="result" options={{ title: "Resultado", headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        </Stack>
        {/* A barra de status muda a cor da hora/bateria para não sumir no fundo escuro */}
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </DietProvider>
    </ThemeProvider>
  );
}
