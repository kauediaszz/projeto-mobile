import React from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native"; // <-- Apaguei o StyleSheet daqui!

import Particles from "@/components/particles";
import TypingText from "@/components/typing-text";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const texts = [
    "Seja bem-vindo!",
    "Faca aqui sua dieta gratis",
    "Registre seu email aqui no Dieta I.A.",
  ];
  const titleSize = Math.min(290, Math.max(80, width * 0.29));
  const shadowOffset = width * 0.005;

  return (
    <ScrollView
      // No NativeWind, usamos contentContainerClassName para estilizar o interior do ScrollView
      contentContainerClassName="flex-grow pb-10"
      showsVerticalScrollIndicator={false}
      className="bg-gray-100"
    >
      {/* styles.header virou: p-5 (padding 20) e items-center */}
      <View className="p-5 items-center">
        <Particles count={50} />

        {/* styles.main virou: items-center e z-10 */}
        <View className="items-center z-10">
          <Text
            // styles.title virou: font-bold e text-center
            className="font-bold text-center text-blue"
            style={{
              // Mantemos no style APENAS o que é matemática dinâmica
              fontSize: titleSize,
              lineHeight: titleSize * 0.9,
              textShadowOffset: { width: shadowOffset, height: shadowOffset },
            }}
          >
            Dieta IA
          </Text>
          <TypingText texts={texts} />
        </View>

        {/* styles.marquee virou: h-5 (height 20) */}
        <View className="h-5" />
      </View>
    </ScrollView>
  );
}
