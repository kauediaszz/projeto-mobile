// app/result.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemeToggle } from "@/components/theme-toggle";
import { useDiet } from '@/contexts/diet-context';
import { generateDietFromGemini } from '@/services/gemini';

type SummaryCardProps = {
  title: string;
  value: string | number | null;
  suffix?: string;
};

function SummaryCard({ title, value, suffix = '' }: SummaryCardProps) {
  return (
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
  const { respostas, resultadoFinal, setResultadoFinal, salvarDieta } = useDiet();
  const [loadingIA, setLoadingIA] = useState(true);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [dietaNome, setDietaNome] = useState('');

  useEffect(() => {
    async function fetchDietaIA() {
      if (resultadoFinal?.dietaIA) {
        setLoadingIA(false);
        return;
      }

      setLoadingIA(true);

      try {
        const outputText = await generateDietFromGemini(respostas);
        console.log('[Gemini] Resposta bruta da dieta IA:', outputText);

        setResultadoFinal((current) => ({
          ...(current ?? { imc: null, tdee: null, dietaIA: null }),
          dietaIA: outputText || 'A IA retornou uma resposta vazia.',
        }));
      } catch (error) {
        console.error('[Gemini] Erro ao gerar dietaIA:', error);
        setResultadoFinal((current) => ({
          ...(current ?? { imc: null, tdee: null, dietaIA: null }),
          dietaIA: 'Erro ao gerar a dieta pela IA. Verifique o console.',
        }));
      } finally {
        setLoadingIA(false);
      }
    }

    fetchDietaIA();
  }, [respostas, resultadoFinal?.dietaIA, setResultadoFinal]);

  useEffect(() => {
    if (!loadingIA && resultadoFinal?.dietaIA) {
      const timer = setTimeout(() => {
        setShowSavePrompt(true);
      }, 15000); // 15 segundos

      return () => clearTimeout(timer);
    }
  }, [loadingIA, resultadoFinal?.dietaIA]);

  return (
    <ScrollView
      className="bg-gray-100 dark:bg-slate-900"
      contentContainerClassName="pb-10"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-black text-[#05121a] dark:text-white">
            Resultado Metab�lico
          </Text>
          <ThemeToggle />
        </View>

        <View className="flex-row justify-between mt-2 gap-3">
          <SummaryCard title="IMC" value={resultadoFinal?.imc ?? null} />
          <SummaryCard title="Gasto Di�rio" value={resultadoFinal?.tdee ?? null} suffix=" kcal" />
        </View>

        <View className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-black/10 dark:border-white/10">
          {loadingIA ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#ff0054" />
              <Text className="mt-3 text-center text-[#24323f] dark:text-slate-300 font-semibold">
                A IA est� calculando sua dieta personalizada. Aguarde um instante...
              </Text>
            </View>
          ) : (
            <Text className="text-[#05121a] dark:text-white leading-6 whitespace-pre-line">
              {resultadoFinal?.dietaIA ?? 'Nenhuma sugest�o gerada pela IA ainda.'}
            </Text>
          )}
        </View>

        {showSavePrompt && (
          <View className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-black/10 dark:border-white/10">
            <Text className="text-lg font-black text-[#05121a] dark:text-white mb-4">
              Definir nome da dieta
            </Text>
            <TextInput
              className="border border-slate-300 dark:border-slate-600 rounded-lg p-3 mb-4 text-[#05121a] dark:text-white bg-slate-50 dark:bg-slate-700"
              placeholder="Digite o nome da sua dieta"
              placeholderTextColor="#6b7280"
              value={dietaNome}
              onChangeText={setDietaNome}
            />
            <TouchableOpacity
              className="bg-[#ff0054] rounded-2xl py-4 items-center shadow-md shadow-[#ff0054]/30"
              onPress={async () => {
                const nome = dietaNome.trim();
                if (!nome) {
                  return;
                }

                try {
                  await salvarDieta(nome);
                  router.replace('/app');
                } catch (error) {
                  console.error('Erro ao salvar dieta:', error);
                }
              }}
              activeOpacity={0.9}
            >
              <Text className="font-black text-white text-base">Concluir</Text>
            </TouchableOpacity>
          </View>
        )}

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
