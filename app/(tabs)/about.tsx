// app/(tabs)/about.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import Particles from "@/components/particles";
import { useAuth } from "@/contexts/auth-context";

// 1. Componente de Card Principal (Seção) agora Expansível (Accordion)
function SectionCard({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  // Estado para controlar se o card está aberto ou fechado
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="rounded-[32px] bg-white dark:bg-[#1c1f2b] border border-slate-200 dark:border-white/5 mb-5 shadow-sm dark:shadow-none overflow-hidden">
      {/* Cabeçalho Clicável */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        className="flex-row items-center p-6"
      >
        <View className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mr-3">
          <Text className="text-[20px]">{emoji}</Text>
        </View>
        <Text className="text-xl font-black text-slate-900 dark:text-white flex-1">
          {title}
        </Text>
        
        {/* Ícone de + ou - para indicar expansão */}
        <View className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 items-center justify-center border border-slate-100 dark:border-slate-700/50">
          <Text className="text-slate-500 dark:text-slate-400 text-lg font-bold mt-[-2px]">
            {isExpanded ? "−" : "+"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Conteúdo que só aparece se estiver expandido */}
      {isExpanded && (
        <View className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-white/5">
          {children}
        </View>
      )}
    </View>
  );
}

// 2. Componente para as fórmulas matemáticas dentro do Card de Cálculos
function CalcItem({
  title,
  formula,
  desc,
  colorClass,
}: {
  title: string;
  formula: string;
  desc: string;
  colorClass: string;
}) {
  return (
    <View className="mb-6">
      <Text className="text-[15px] font-black text-slate-800 dark:text-white mb-1.5">
        {title}
      </Text>
      <Text className="text-[13px] text-slate-500 dark:text-slate-400 mb-3 leading-5">
        {desc}
      </Text>
      <View className={`rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/50 border-l-4 ${colorClass}`}>
        <Text className="font-bold text-slate-700 dark:text-slate-300 text-[13px] leading-5">
          {formula}
        </Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      router.replace("/");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-[#101217]"
      contentContainerClassName="pb-10 pt-4 px-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Bloco do cabeçalho com partículas */}
      <View className="rounded-[32px] px-6 pt-4 pb-6 bg-[#00ffd5]/20 dark:bg-[#00ffd5]/10 mb-6 overflow-hidden">
        <Particles count={35} />
        <View className="mt-2">
          <Text className="text-[24px] font-black text-[#06131a] dark:text-white mb-2">
            Como Funciona?
          </Text>
          <Text className="text-[#24323f] dark:text-slate-300 leading-6 font-medium">
            Entenda a ciência e a inteligência por trás das suas recomendações personalizadas.
          </Text>
        </View>
      </View>

      {/* SEÇÃO 1: CÁLCULOS NUTRICIONAIS */}
      <SectionCard title="Cálculos Nutricionais" emoji="🧮">
        <CalcItem
          title="Taxa Metabólica Basal (TMB)"
          desc="A quantidade de calorias que seu corpo precisa para manter as funções vitais em repouso."
          formula="H: 88.36 + (13.39 × Peso) + (4.79 × Altura) - (5.67 × Idade)"
          colorClass="border-[#10b981]"
        />
        
        <CalcItem
          title="Gasto Energético (TDEE)"
          desc="Seu gasto calórico diário total baseado na sua rotina e exercícios."
          formula="TDEE = TMB × Fator de Atividade"
          colorClass="border-[#3b82f6]"
        />
        
        <CalcItem
          title="Índice de Massa Corporal (IMC)"
          desc="Uma relação matemática entre seu peso e sua altura."
          formula="IMC = Peso (kg) ÷ Altura² (m)"
          colorClass="border-[#8b5cf6]"
        />
      </SectionCard>

      {/* SEÇÃO 2: O AGENTE IA */}
      <SectionCard title="Nosso Agente de Nutrição" emoji="🤖">
        <Text className="text-slate-600 dark:text-slate-300 leading-6 font-medium">
          Nosso agente é impulsionado por inteligência artificial (Google Gemini) e altamente treinado para fornecer recomendações personalizadas, baseadas em dados científicos e nas suas preferências, garantindo um plano alimentar eficaz e sustentável.
        </Text>
      </SectionCard>

      {/* SEÇÃO 3: CRIADORES */}
      <SectionCard title="Criadores" emoji="👨‍💻">
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mr-4 border border-slate-200 dark:border-slate-700">
            <Text className="text-2xl">🚀</Text>
          </View>
          <View className="flex-1">
            <Text className="font-black text-slate-900 dark:text-white text-[16px] mb-1">
              Kauê Dias e Lucas Holanda
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">
              Desenvolvido com dedicação para transformar sua saúde através da tecnologia.
            </Text>
          </View>
        </View>
      </SectionCard>

      {/* AVISO IMPORTANTE (Deixei aberto por padrão pois é um aviso médico) */}
      <View className="p-5 rounded-[24px] bg-[#10b981]/10 border border-[#10b981]/30 mb-6">
        <View className="flex-row items-center mb-2">
          <Text className="text-lg mr-2">⚠️</Text>
          <Text className="text-[16px] font-black text-emerald-800 dark:text-emerald-400">
            Aviso Importante
          </Text>
        </View>
        <Text className="text-emerald-700 dark:text-emerald-300/80 font-medium leading-5">
          Sempre consulte um médico ou nutricionista profissional antes de iniciar qualquer dieta rigorosa ou mudança radical de hábitos.
        </Text>
      </View>

      {/* BOTÕES DE AÇÃO */}
      <View className="mb-8">
        <TouchableOpacity
          onPress={() => router.push("/preferences")}
          className="rounded-full bg-slate-200 dark:bg-slate-800 py-[18px] items-center mb-3"
          activeOpacity={0.85}
        >
          <Text className="font-black text-slate-900 dark:text-white text-[15px]">
            ⚙️ Preferências no App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-full bg-red-100 dark:bg-red-500/10 py-[18px] items-center border border-red-200 dark:border-red-500/20"
          activeOpacity={0.85}
        >
          <Text className="font-black text-red-600 dark:text-red-400 text-[15px]">
            🚪 Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}