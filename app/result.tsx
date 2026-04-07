// app/result.tsx
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useDiet } from '@/contexts/diet-context';
import { ThemeToggle } from "@/components/theme-toggle"; // Importação do botão

function SummaryCard({
  title,
  value,
  suffix = '',
}: {
  title: string;
  value: string | number | null;
  suffix?: string;
}) {
  return (
    // Card adaptado para dark mode: bg-white no claro, slate-800 no escuro
    <View className="flex-1 bg-white/95 dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-transparent dark:border-white/5">
      <Text className="font-black text-[#ff0054] mb-1.5 uppercase text-xs tracking-wider">
        {title}
      </Text>
      <Text className="font-black text-xl text-[#05121a] dark:text-white">
        {value === null || value === undefined ? '--' : value}
        {suffix}
      </Text>
    </View>
  );
}

export default function ResultScreen() {
  const { resultadoFinal } = useDiet();

  return (
    <ScrollView 
      // Fundo dinâmico para a tela de resultado
      className="bg-gray-100 dark:bg-slate-900"
      contentContainerClassName="pb-10" 
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-6">
        <Text className="text-2xl font-black mb-4 text-[#05121a] dark:text-white">
          Resultado Metabólico
        </Text>

        {!resultadoFinal ? (
          <Text className="text-base text-[#444] dark:text-slate-400">Carregando...</Text>
        ) : (
          <View className="flex-row justify-between mt-2 gap-3">
            <SummaryCard title="IMC" value={resultadoFinal.imc} />
            <SummaryCard title="Gasto Diário" value={resultadoFinal.tdee} suffix=" kcal" />
          </View>
        )}

        {/* Card de Aviso da IA com cores suaves no modo dark */}
        <View className="mt-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <Text className="text-[#24323f] dark:text-slate-300 font-bold leading-5">
            🚧 Em breve a Inteligência Artificial irá gerar sua dieta personalizada automaticamente.
          </Text>
        </View>

        {/* Botão para voltar à Home */}
        <TouchableOpacity 
          className="mt-6 bg-[#ff0054] rounded-2xl py-4 items-center shadow-md shadow-[#ff0054]/30" 
          onPress={() => router.push('/')} 
          activeOpacity={0.9}
        >
          <Text className="font-black text-white text-base">Refazer Teste</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
