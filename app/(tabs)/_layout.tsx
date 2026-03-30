import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import "@/global.css";
import { useAppTheme } from "@/contexts/theme-context"; 

export default function TabLayout() {
  // Pega o tema (light ou dark) que vem do botão
  const { theme } = useAppTheme(); 

  return (
    <Tabs
      screenOptions={{
        // Usa as cores do ficheiro de constantes baseadas no tema atual
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Garante que a cor de fundo da barra mude para escuro ou claro
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
          borderTopWidth: 0, // Remove a linha no topo da barra no modo dark
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculation"
        options={{
          title: "Calculation",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="function" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="info.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
