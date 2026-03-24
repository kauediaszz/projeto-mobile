import React from "react";
import { ScrollView, Text, View } from "react-native"; // <-- StyleSheet foi pro espaço!

import Particles from "@/components/particles";

function InfoCard({
  title,
  emoji,
  children,
  variant,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
  variant: "emerald" | "cyan" | "teal";
}) {
  // Dicionário de cores do Tailwind para deixar as bordas dinâmicas e o código limpo
  const borderColors = {
    emerald: "border-[#10b981]",
    cyan: "border-[#22d3ee]",
    teal: "border-[#2dd4bf]",
  };

  return (
    <View
      className={`border-2 rounded-2xl p-3.5 mb-3.5 bg-white/90 ${borderColors[variant]}`}
    >
      <View className="flex-row items-center mb-2">
        <Text className="text-[22px] mr-2.5">{emoji}</Text>
        <Text className="text-base font-black">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function AboutScreen() {
  return (
    <ScrollView
      contentContainerClassName="pb-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="m-2.5 rounded-[18px] px-4 pt-2 pb-4 bg-[#00ffd5]/20">
        <Particles count={45} />
        <View className="mt-1.5">
          <Text className="text-[22px] font-black text-[#06131a] mb-2">
            Como Funciona a Calculadora
          </Text>
          <Text className="text-[#24323f] leading-5">
            Entenda os cálculos e métricas utilizadas para suas recomendações
            personalizadas
          </Text>
        </View>
      </View>

      <View className="px-4 pt-2.5">
        <InfoCard
          title="Taxa Metabólica Basal (TMB)"
          emoji="❤️"
          variant="emerald"
        >
          <Text className="text-[#24323f] leading-5">
            A TMB representa a quantidade de calorias que seu corpo precisa para
            manter suas funções vitais em repouso.
          </Text>
          {/* Adicionei border-l-4 aqui para a cor da borda esquerda finalmente aparecer! */}
          <View className="rounded-xl p-3 bg-black/5 mt-2 border-l-4 border-[#10b981]">
            <Text className="font-black mb-1.5">
              Fórmula de Harris-Benedict
            </Text>
            <Text className="text-[#111827] mt-1 font-bold">Para Homens:</Text>
            <Text className="font-bold text-[#0f172a] mt-1">
              TMB = 88.362 + (13.397 x peso) + (4.799 x altura) - (5.677 x
              idade)
            </Text>
          </View>
        </InfoCard>

        <InfoCard
          title="Gasto Energético Diário Total (TDEE)"
          emoji="📈"
          variant="cyan"
        >
          <View className="rounded-xl p-3 bg-black/5 mt-2 border-l-4 border-[#22d3ee]">
            <Text className="font-bold text-[#0f172a] mt-1">
              TDEE = TMB x Fator de Atividade
            </Text>
          </View>
        </InfoCard>

        <InfoCard
          title="Índice de Massa Corporal (IMC)"
          emoji="📏"
          variant="teal"
        >
          <View className="rounded-xl p-3 bg-black/5 mt-2 border-l-4 border-[#2dd4bf]">
            <Text className="font-bold text-[#0f172a] mt-1">
              IMC = peso (kg) ÷ altura² (m)
            </Text>
          </View>
        </InfoCard>

        <View className="p-4 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/35 mt-1.5">
          <Text className="text-lg font-black mb-2">Importante Lembrar</Text>
          <Text className="text-[#0f766e] font-bold leading-relaxed">
            • Sempre consulte um nutricionista antes de iniciar qualquer dieta.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
