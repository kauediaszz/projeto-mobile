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
  const { setRespostas, setResultadoFinal } = useDiet();
  const [idx, setIdx] = useState(0);
  const [valorAtual, setValorAtual] = useState("");
  const [acumulador, setAcumulador] = useState<Record<string, string | number>>(
    {},
  );

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

  function avancarComValor(novoValor: string | number) {
    const qid = QUESTIONS[idx].id;
    const atualizado = { ...acumulador, [qid]: novoValor };
    setAcumulador(atualizado);

    if (idx === QUESTIONS.length - 1) {
      setResultadoFinal("Cálculo pendente");
      setRespostas(atualizado);
      router.push("/result");
      return;
    }
    setIdx((i) => i + 1);
  }

  function handleNext() {
    if (perguntaAtual.tipo === "number") {
      const num = Number(valorAtual);
      if (Number.isNaN(num) || num <= 0) return;
      avancarComValor(num);
      return;
    }

    if (perguntaAtual.tipo === "altura_mask") {
      if (!valorAtual || valorAtual.length < 3) return;
      avancarComValor(valorAtual);
      return;
    }

    if (!valorAtual.trim()) return;
    avancarComValor(valorAtual.trim());
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
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-3.5 pt-3">
        <View className="bg-white/85 rounded-2xl p-3.5 mb-3.5">
          <Text className="font-black mb-3 text-[#05121a]">
            Vamos para as perguntas
          </Text>
          <Text className="text-xl font-black mb-2 text-[#05121a]">
            Vamos criar sua Dieta
          </Text>
          <Text className="text-[#24323f] leading-5 font-semibold">
            Insira seus dados para receber recomendações personalizadas.
          </Text>
        </View>

        <View className="bg-white/95 rounded-2xl p-3.5 shadow-sm">
          <Text className="font-black text-[#ff0054] mb-2.5">
            Pergunta {idx + 1} de {totalPerguntas}
          </Text>

          <Text className="text-lg font-black mb-3 text-[#05121a]">
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
              {perguntaAtual.tipo === "text" ? (
                <TextInput
                  value={valorAtual}
                  onChangeText={setValorAtual}
                  multiline
                  className="border border-black/15 rounded-xl px-3 py-2.5 bg-white mb-3 min-h-[100px] font-bold"
                />
              ) : (
                <TextInput
                  value={valorAtual}
                  keyboardType={
                    perguntaAtual.tipo === "number" ? "numeric" : "decimal-pad"
                  }
                  onChangeText={(txt) =>
                    setValorAtual(
                      perguntaAtual.tipo === "altura_mask"
                        ? aplicarMascaraAltura(txt)
                        : txt,
                    )
                  }
                  placeholder={
                    perguntaAtual.tipo === "altura_mask" ? "1,75" : ""
                  }
                  className="border border-black/15 rounded-xl px-3 py-2.5 bg-white mb-3 font-bold"
                />
              )}

              <View className="flex-row justify-between mt-1.5 gap-2.5">
                <TouchableOpacity
                  className="flex-1 bg-black/5 py-3 rounded-xl items-center"
                  onPress={handleBack}
                  activeOpacity={0.9}
                >
                  <Text className="font-black text-[#05121a]">Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-[#ff0054] py-3 rounded-xl items-center"
                  onPress={handleNext}
                  activeOpacity={0.9}
                >
                  <Text className="font-black text-white">
                    {idx === QUESTIONS.length - 1 ? "Finalizar" : "Próxima"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {perguntaAtual.tipo === "select" && (
            <View className="flex-row justify-between mt-1.5 gap-2.5">
              <TouchableOpacity
                className="flex-1 bg-black/5 py-3 rounded-xl items-center"
                onPress={handleBack}
                activeOpacity={0.9}
              >
                <Text className="font-black text-[#05121a]">Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-black/5 py-3 rounded-xl items-center"
                disabled
                activeOpacity={1}
              >
                <Text className="font-black text-white"> </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
