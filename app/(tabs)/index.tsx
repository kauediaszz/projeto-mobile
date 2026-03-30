import React from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native"; 

import Particles from "@/components/particles";
import TypingText from "@/components/typing-text";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppTheme } from "@/contexts/theme-context"; 

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme(); 

  const texts = [
    "Seja bem-vindo!",
    "Faca aqui sua dieta gratis",
    "Registre seu email aqui no Dieta I.A.",
  ];
  
  const titleSize = Math.min(290, Math.max(80, width * 0.29));
  const shadowOffset = width * 0.005;

  return (
    <ScrollView
      contentContainerClassName="flex-grow pb-10"
      showsVerticalScrollIndicator={false}
      className="bg-gray-100 dark:bg-slate-900"
    >
      <View className="p-5 items-center">
        
        {/* CORREÇÃO 1: z-50 garante que o botão fica POR CIMA do texto invisível e é 100% clicável */}
        <View className="z-50 w-full items-center mb-4" style={{ zIndex: 50, elevation: 5 }}>
          <ThemeToggle />
        </View>

        <Particles count={50} />

        {/* Adicionado z-0 para garantir que o texto fica por baixo do botão */}
        <View className="items-center z-0">
          <Text
            // CORREÇÃO 2: Preto no claro, Branco no escuro
            className="font-bold text-center text-black dark:text-white"
            style={{
              fontSize: titleSize,
              lineHeight: titleSize * 0.9,
              textShadowOffset: { width: shadowOffset, height: shadowOffset },
            }}
          >
            Dieta IA
          </Text>
          <TypingText texts={texts} />
        </View>

        <View className="h-5" />
      </View>
    </ScrollView>
  );
}