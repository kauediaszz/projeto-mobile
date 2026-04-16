<<<<<<< HEAD
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
                onChangeText={(text) => {
                  // Se a pergunta for do tipo altura_mask, aplica a função de máscara
                  if (perguntaAtual.tipo === "altura_mask") {
                    setValorAtual(aplicarMascaraAltura(text));
                  } else {
                    setValorAtual(text);
                  }
                }}
                multiline={perguntaAtual.tipo === "text"}
                maxLength={
                  perguntaAtual.id === "idade" ? 3 : 
                  perguntaAtual.id === "peso" ? 3 : 
                  perguntaAtual.id === "altura" ? 3 : 200
                }
                keyboardType={
                  perguntaAtual.tipo === "number" ? "numeric" : 
                  perguntaAtual.tipo === "altura_mask" ? "decimal-pad" : "default"
                }
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
=======
﻿import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
// IMPORTANTE: Importando setDoc ao invés de updateDoc
import { useAuth } from '@/contexts/auth-context';
import { useDiet } from "@/contexts/diet-context";
import { useAppTheme } from "@/contexts/theme-context";
import { db } from '@/firebaseConfig';
import { generateDietFromGemini } from "@/services/gemini";
import { doc, setDoc } from 'firebase/firestore';

const QUESTIONS = [
  { id: "sexo", pergunta: "Qual é o seu sexo?", tipo: "select", opcoes: ["Masculino", "Feminino"] },
  { id: "idade", pergunta: "Qual é a sua idade?", tipo: "number" },
  { id: "peso", pergunta: "Qual é o seu peso em kg?", tipo: "number" },
  { id: "altura", pergunta: "Qual é a sua altura?", tipo: "altura_mask" },
  { id: "atividade", pergunta: "Nível de atividade física", tipo: "select", opcoes: ["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo"] },
  { id: "objetivo", pergunta: "Qual é o seu objetivo com a dieta?", tipo: "select", opcoes: ["Emagrecer", "Ganhar massa muscular", "Manutenção do peso", "Dieta proteica", "Low carb"] },
  { id: "preferencias", pergunta: "Quais são suas preferências alimentares?", tipo: "text" },
] as const;

function OptionButton({ label, onPress }: { label: string; onPress: () => void }) {
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

export default function CalculationScreen({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const { setRespostas, setHasCompletedFirstDiet, setSavedDiet } = useDiet();
  
  const [idx, setIdx] = useState(0);
  const [valorAtual, setValorAtual] = useState("");
  const [acumulador, setAcumulador] = useState<Record<string, string | number>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [dietName, setDietName] = useState('');
  const [generatedDietText, setGeneratedDietText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const perguntaAtual = QUESTIONS[idx];
  const totalPerguntas = QUESTIONS.length;

  // FUNÇÃO DE MÁSCARA ADICIONADA AQUI
  const aplicarMascaraAltura = (texto: string) => {
    let valor = texto.replace(/\D/g, ""); 
    if (valor.length > 1) {
      valor = valor.replace(/^(\d)(\d)/, "$1,$2");
    }
    return valor;
  };

  useEffect(() => {
    const qid = QUESTIONS[idx].id;
    setValorAtual(String(acumulador[qid] ?? ""));
  }, [idx, acumulador]);

  async function handleFinish(atualizado: Record<string, string | number>) {
    if (isProcessing) return;
    setIsProcessing(true);
    setRespostas(atualizado);

    try {
      const dietaGerada = await generateDietFromGemini(atualizado);
      setGeneratedDietText(dietaGerada);

      setTimeout(() => {
        setShowModal(true);
      }, 2000);

    } catch (error) {
      console.error("Erro ao gerar dieta:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  const saveDietToFirebase = async () => {
    if (!dietName.trim() || !user || !user.email) return;
    setIsSaving(true);
    
    const newDiet = {
      nome: dietName,
      texto: generatedDietText,
      data: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", user.email as string), {
        hasCompletedFirstDiet: true,
        currentDiet: newDiet
      }, { merge: true });

      setSavedDiet(newDiet);
      setHasCompletedFirstDiet(true);
      
      setShowModal(false);

      if (onComplete) {
        onComplete();
      } else {
        router.replace('/app');
      }
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
    } finally {
      setIsSaving(false);
    }
  };

  async function avancarComValor(novoValor: string | number) {
    const qid = QUESTIONS[idx].id;
    const atualizado = { ...acumulador, [qid]: novoValor };
    setAcumulador(atualizado);

    if (idx === QUESTIONS.length - 1) {
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
    if (idx === 0 && !onComplete) {
      router.push("/");
      return;
    }
    setIdx((i) => Math.max(0, i - 1));
  }

  return (
    <>
      <ScrollView
        className="bg-white dark:bg-slate-900 flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-3.5 pt-3">
          <View className="bg-white/85 dark:bg-slate-800 rounded-2xl p-3.5 mb-3.5 border border-transparent dark:border-white/5">
            <Text className="font-black mb-3 text-[#05121a] dark:text-white">Vamos criar sua Dieta</Text>
            <Text className="text-[#24323f] dark:text-slate-300 leading-5 font-semibold">
              Insira seus dados para receber recomendações personalizadas.
            </Text>
          </View>

          <View className="bg-white/95 dark:bg-slate-800 rounded-2xl p-3.5 shadow-sm border border-transparent dark:border-white/5">
            <Text className="font-black text-[#ff0054] mb-2.5">Pergunta {idx + 1} de {totalPerguntas}</Text>
            <Text className="text-lg font-black mb-3 text-[#05121a] dark:text-white">{perguntaAtual.pergunta}</Text>

            {perguntaAtual.tipo === "select" && (
              <View>
                {perguntaAtual.opcoes.map((opt) => (
                  <OptionButton key={opt} label={opt} onPress={() => avancarComValor(opt)} />
                ))}
              </View>
            )}

            {(perguntaAtual.tipo === "number" || perguntaAtual.tipo === "altura_mask" || perguntaAtual.tipo === "text") && (
              <View>
                {/* TEXTINPUT ATUALIZADO (onChangeText e maxLength) */}
                <TextInput
                  value={valorAtual}
                  onChangeText={(texto) => {
                    if (perguntaAtual.tipo === "altura_mask") {
                      setValorAtual(aplicarMascaraAltura(texto));
                    } else {
                      setValorAtual(texto);
                    }
                  }}
                  multiline={perguntaAtual.tipo === "text"}
                  maxLength={
                    perguntaAtual.id === "idade" ? 3 : 
                    perguntaAtual.id === "peso" ? 3 : 
                    perguntaAtual.id === "altura" ? 4 : 200
                  }
                  keyboardType={
                    perguntaAtual.tipo === "number" ? "numeric" : 
                    perguntaAtual.tipo === "altura_mask" ? "decimal-pad" : "default"
                  }
                  className="border border-black/15 dark:border-white/15 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-700 text-[#05121a] dark:text-white mb-3 font-bold"
                  placeholder={perguntaAtual.tipo === "altura_mask" ? "1,75" : ""}
                  placeholderTextColor={theme === 'dark' ? '#94a3b8' : '#64748b'}
                />

                <View className="flex-row justify-between mt-1.5 gap-2.5">
                  <TouchableOpacity className="flex-1 bg-black/5 dark:bg-white/10 py-3 rounded-xl items-center" onPress={handleBack} activeOpacity={0.9}>
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
          </View>
        </View>
      </ScrollView>

      {/* Modal de Nome da Dieta */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white dark:bg-slate-800 p-6 rounded-[32px] w-full border border-slate-200 dark:border-slate-700">
            <Text className="text-2xl font-black mb-4 text-slate-900 dark:text-white">Qual será o nome da sua dieta?</Text>
            <TextInput 
              className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl mb-6 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-700"
              placeholder="Ex: Projeto Verão"
              placeholderTextColor="#94a3b8"
              value={dietName}
              onChangeText={setDietName}
            />
            <TouchableOpacity 
              onPress={saveDietToFirebase}
              className="bg-[#ff0054] p-4 rounded-2xl items-center"
              disabled={isSaving}
            >
              {isSaving ? <ActivityIndicator color="#fff"/> : <Text className="text-white font-black text-lg">Salvar Dieta</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
>>>>>>> 5a700c5b8d182ad44346bbc93c3848423579a673
