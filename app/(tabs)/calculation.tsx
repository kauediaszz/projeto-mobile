// app/(tabs)/calculation.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useDiet } from "@/contexts/diet-context";
import { useAppTheme } from "@/contexts/theme-context"; // Adicionado para controlo fino de cores
import { calculateImcFromGemini } from "@/services/gemini";

const QUESTIONS = [
  {
    id: "sexo",
    pergunta: "Qual é o seu sexo?",
    tipo: "select",
    opcoes: ["Masculino", "Feminino"],
  },
  { id: "idade", pergunta: "Qual é a sua idade?", tipo: "number" },
  { id: "peso", pergunta: "Qual é o seu peso em kg?", tipo: "number" },
  { id: "altura", pergunta: "Qual é a sua altura?", tipo: "altura_mask" },
  {
    id: "atividade",
    pergunta: "Nível de atividade física",
    tipo: "select",
    opcoes: [
      "Sedentário",
      "Levemente ativo",
      "Moderadamente ativo",
      "Muito ativo",
    ],
  },
  {
    id: "objetivo",
    pergunta: "Qual é o seu objetivo com a dieta?",
    tipo: "select",
    opcoes: [
      "Emagrecer",
      "Ganhar massa muscular",
      "Manutenção do peso",
      "Dieta proteica",
      "Low carb",
    ],
  },
  {
    id: "preferencias",
    pergunta: "Quais são suas preferências alimentares?",
    tipo: "text",
  },
] as const;

function OptionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-[#ff0054]/10 border border-[#ff0054]/25 py-3 px-3 rounded-xl mb-3"
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text className="font-black text-[#ff0054] text-center">{label}</Text>
    </TouchableOpacity>
  );
}

export default function CalculationScreen() {
  const { theme } = useAppTheme(); // Pegamos o tema para ajustar o placeholder
  const { setRespostas, setResultadoFinal } = useDiet();
  const [idx, setIdx] = useState(0);
  const [valorAtual, setValorAtual] = useState("");
  const [acumulador, setAcumulador] = useState<Record<string, string | number>>(
    {},
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const perguntaAtual = QUESTIONS[idx];
  const totalPerguntas = QUESTIONS.length;

  useEffect(() => {
    const qid = QUESTIONS[idx].id;
    setValorAtual(String(acumulador[qid] ?? ""));
  }, [idx, acumulador]);

  function aplicarMascaraAltura(valor: string) {
    let cleanValue = String(valor).replace(/\D/g, "");
    if (cleanValue.length > 2) {
      cleanValue =
        cleanValue.substring(0, 1) + "," + cleanValue.substring(1, 3);
    }
    return cleanValue;
  }

  async function handleFinish(atualizado: Record<string, string | number>) {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setRespostas(atualizado);
    console.log("[Gemini] Enviando dados para API:", atualizado);

    try {
      const resultado = await calculateImcFromGemini(atualizado);
      console.log("[Gemini] Resposta recebida:", resultado);
      setResultadoFinal({ imc: resultado, tdee: null, dietaIA: null });
      router.push("/result");
    } catch (error) {
      console.error("[Gemini] Erro ao calcular IMC com Gemini:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }

  async function avancarComValor(novoValor: string | number) {
    const qid = QUESTIONS[idx].id;
    const atualizado = { ...acumulador, [qid]: novoValor };
    setAcumulador(atualizado);

    if (idx === QUESTIONS.length - 1) {
      setResultadoFinal({ imc: null, tdee: null, dietaIA: null });
      await handleFinish(atualizado);
      return;
    }

    setIdx((i) => i + 1);
  }

  async function handleNext() {
    if (perguntaAtual.tipo === "number") {
      const num = Number(valorAtual);
      if (Number.isNaN(num) || num <= 0) return;
      await avancarComValor(num);
      return;
    }

    if (perguntaAtual.tipo === "altura_mask") {
      if (!valorAtual || valorAtual.length < 3) return;
      await avancarComValor(valorAtual);
      return;
    }

    if (!valorAtual.trim()) return;
    await avancarComValor(valorAtual.trim());
  }

  function handleBack() {
    if (idx === 0) {
      router.push("/");
      return;
    }
    setIdx((i) => i - 1);
  }

  return (
    <ScrollView
      className="bg-white dark:bg-slate-900" // Fundo dinâmico
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-3.5 pt-3">

        {/* Card de instruções */}
        <View className="bg-white/85 dark:bg-slate-800 rounded-2xl p-3.5 mb-3.5 border border-transparent dark:border-white/5">
          <Text className="font-black mb-3 text-[#05121a] dark:text-white">
            Vamos para as perguntas
          </Text>
          <Text className="text-xl font-black mb-2 text-[#05121a] dark:text-white">
            Vamos criar sua Dieta
          </Text>
          <Text className="text-[#24323f] dark:text-slate-300 leading-5 font-semibold">
            Insira seus dados para receber recomendações personalizadas.
          </Text>
        </View>

        {/* Card de perguntas */}
        <View className="bg-white/95 dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-transparent dark:border-white/5">
          <Text className="font-black text-[#ff0054] mb-2.5">
            Pergunta {idx + 1} de {totalPerguntas}
          </Text>

          <Text className="text-lg font-black mb-3 text-[#05121a] dark:text-white">
            {perguntaAtual.pergunta}
          </Text>

          {perguntaAtual.tipo === "select" && (
            <View>
              {perguntaAtual.opcoes.map((opt) => (
                <OptionButton
                  key={opt}
                  label={opt}
                  onPress={() => avancarComValor(opt)}
                />
              ))}
            </View>
          )}

          {(perguntaAtual.tipo === "number" ||
            perguntaAtual.tipo === "altura_mask" ||
            perguntaAtual.tipo === "text") && (
            <View>
              <TextInput
                value={valorAtual}
                onChangeText={setValorAtual}
                multiline={perguntaAtual.tipo === "text"}
                keyboardType={
                  perguntaAtual.tipo === "number" ? "numeric" : 
                  perguntaAtual.tipo === "altura_mask" ? "decimal-pad" : "default"
                }
                // Ajusta a cor do texto digitado e do fundo do input
                className="border border-black/15 dark:border-white/15 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-700 text-[#05121a] dark:text-white mb-3 font-bold"
                placeholder={perguntaAtual.tipo === "altura_mask" ? "1,75" : ""}
                placeholderTextColor={theme === 'dark' ? '#94a3b8' : '#64748b'}
              />

              <View className="flex-row justify-between mt-1.5 gap-2.5">
                <TouchableOpacity
                  className="flex-1 bg-black/5 dark:bg-white/10 py-3 rounded-xl items-center"
                  onPress={handleBack}
                  activeOpacity={0.9}
                >
                  <Text className="font-black text-[#05121a] dark:text-white">Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 bg-[#ff0054] py-3 rounded-xl items-center ${isProcessing ? 'opacity-50' : ''}`}
                  onPress={handleNext}
                  disabled={isProcessing}
                  activeOpacity={0.9}
                >
                  <Text className="font-black text-white">
                    {isProcessing ? "Calculando..." : idx === QUESTIONS.length - 1 ? "Finalizar" : "Próxima"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {perguntaAtual.tipo === "select" && (
            <View className="flex-row justify-between mt-1.5 gap-2.5">
              <TouchableOpacity
                className="flex-1 bg-black/5 dark:bg-white/10 py-3 rounded-xl items-center"
                onPress={handleBack}
                activeOpacity={0.9}
              >
                <Text className="font-black text-[#05121a] dark:text-white">Voltar</Text>
              </TouchableOpacity>
              <View className="flex-1" />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
