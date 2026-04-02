// app/(tabs)/about.tsx
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import Particles from "@/components/particles";
import { useAuth } from "@/contexts/auth-context";

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
  // Dicionário de cores para as bordas
  const borderColors = {
    emerald: "border-[#10b981]",
    cyan: "border-[#22d3ee]",
    teal: "border-[#2dd4bf]",
  };

  return (
    <View
      className={`border-2 rounded-2xl p-3.5 mb-3.5 bg-white dark:bg-slate-800 ${borderColors[variant]} shadow-sm`}
    >
      <View className="flex-row items-center mb-2">
        {/* Restaurei o Emoji e o Título que haviam sumido! */}
        <Text className="text-[22px] mr-2.5">{emoji}</Text>
        <Text className="text-base font-black dark:text-white">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function AboutScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/" as any);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <ScrollView
      className="bg-white dark:bg-slate-900"
      contentContainerClassName="pb-5"
      showsVerticalScrollIndicator={false}
    >
      {/* Bloco do cabeçalho com partículas */}
      <View className="m-2.5 rounded-[18px] px-4 pt-2 pb-4 bg-[#00ffd5]/20 dark:bg-[#00ffd5]/10">
        <Particles count={45} />
        <View className="mt-1.5">
          <Text className="text-[22px] font-black text-[#06131a] dark:text-white mb-2">
            Como Funciona a Calculadora
          </Text>
          <Text className="text-[#24323f] dark:text-slate-300 leading-5">
            Entenda os cálculos e métricas utilizadas para suas recomendações personalizadas
          </Text>
        </View>
      </View>

      <View className="px-4 pt-2.5">
        
        {/* O ThemeToggle foi totalmente removido daqui! */}

        <InfoCard
          title="Taxa Metabólica Basal (TMB)"
          emoji="❤️"
          variant="emerald"
        >
          <Text className="text-[#24323f] dark:text-slate-300 leading-5">
            A TMB representa a quantidade de calorias que seu corpo precisa para
            manter suas funções vitais em repouso.
          </Text>
          <View className="rounded-xl p-3 bg-black/5 dark:bg-white/5 mt-2 border-l-4 border-[#10b981]">
            <Text className="font-black mb-1.5 dark:text-white">Fórmula de Harris-Benedict</Text>
            <Text className="text-[#111827] dark:text-slate-200 mt-1 font-bold">Para Homens:</Text>
            <Text className="font-bold text-[#0f172a] dark:text-slate-400 mt-1">
              TMB = 88.362 + (13.397 x peso) + (4.799 x altura) - (5.677 x idade)
            </Text>
          </View>
        </InfoCard>

        <InfoCard
          title="Gasto Energético (TDEE)"
          emoji="📈"
          variant="cyan"
        >
          <View className="rounded-xl p-3 bg-black/5 dark:bg-white/5 mt-2 border-l-4 border-[#22d3ee]">
            <Text className="font-bold text-[#0f172a] dark:text-slate-400 mt-1">
              TDEE = TMB x Fator de Atividade
            </Text>
          </View>
        </InfoCard>

        <InfoCard
          title="Índice de Massa Corporal (IMC)"
          emoji="📏"
          variant="teal"
        >
          <View className="rounded-xl p-3 bg-black/5 dark:bg-white/5 mt-2 border-l-4 border-[#2dd4bf]">
            <Text className="font-bold text-[#0f172a] dark:text-slate-400 mt-1">
              IMC = peso (kg) ÷ altura² (m)
            </Text>
          </View>
        </InfoCard>

        <View className="p-4 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/35 mt-1.5">
          <Text className="text-lg font-black mb-2 dark:text-white">Importante Lembrar</Text>
          <Text className="text-[#0f766e] dark:text-emerald-400 font-bold leading-relaxed">
            • Sempre consulte um nutricionista antes de iniciar qualquer dieta.
          </Text>
        </View>

        {/* Botão Preferências */}
        <TouchableOpacity
          onPress={() => router.push("/preferences")}
          className="rounded-2xl bg-slate-900 dark:bg-slate-100 px-4 py-3 items-center mt-8 mb-3"
          activeOpacity={0.85}
        >
          <Text className="font-bold text-white dark:text-slate-900">
            ⚙️ Preferências
          </Text>
        </TouchableOpacity>

        {/* Botão Sair da Conta */}
        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-2xl bg-red-500 px-4 py-3 items-center mb-4"
          activeOpacity={0.85}
        >
          <Text className="font-bold text-white">
            🚪 Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}