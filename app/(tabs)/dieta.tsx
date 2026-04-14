import { useAuth } from '@/contexts/auth-context';
import { useDiet } from '@/contexts/diet-context';
import { db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// --- COMPONENTES AUXILIARES ---

// Gráfico Circular (Gauge) para IMC e KCAL
const CircularProgress = ({ value, max, color, label }: { value: number, max: number, color: string, label: string }) => {
  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View className="items-center">
      <View className="relative items-center justify-center">
        <Svg width={70} height={70} className="transform -rotate-90">
          <Circle stroke="#f1f5f9" fill="none" cx={35} cy={35} r={radius} strokeWidth={strokeWidth} />
          <Circle 
            stroke={color} 
            fill="none" 
            cx={35} cy={35} r={radius} 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
          />
        </Svg>
        <View className="absolute items-center justify-center">
          <Text className="font-black text-lg text-slate-800 dark:text-white">{value}</Text>
        </View>
      </View>
      <Text className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{label}</Text>
    </View>
  );
};

// Item com Checkbox Interativo
const CheckboxItem = ({ item }: { item: any }) => {
  const [checked, setChecked] = useState(false);
  return (
    <TouchableOpacity 
      onPress={() => setChecked(!checked)}
      activeOpacity={0.7}
      className="flex-row items-center bg-white dark:bg-slate-800/50 p-3.5 rounded-2xl mb-2.5 border border-slate-100 dark:border-slate-700/50 shadow-sm"
    >
      <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${checked ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'}`}>
        {checked && <Text className="text-white text-xs font-black">✓</Text>}
      </View>
      <View className="flex-1">
        <Text className={`font-bold text-[15px] ${checked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
          {item.nome}
        </Text>
        <Text className="text-slate-400 text-xs mt-0.5">{item.detalhe}</Text>
      </View>
      <View className="bg-slate-50 dark:bg-slate-700 w-8 h-8 rounded-full items-center justify-center">
        <Text className="text-sm">{item.icone}</Text>
      </View>
    </TouchableOpacity>
  );
};


// --- TELA PRINCIPAL ---

export default function DietaScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { savedDiet, setSavedDiet } = useDiet();
  const [modalVisible, setModalVisible] = useState(false);

  // Faz o parse do JSON salvo no Firebase (que era string)
  const dietData = useMemo(() => {
    if (!savedDiet?.texto) return null;
    try {
      // Limpa possíveis formatações do markdown que o Gemini possa ter deixado escapar
      const cleanJson = savedDiet.texto.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.log("Erro ao fazer parse do JSON da dieta", e);
      return null;
    }
  }, [savedDiet]);

  const handleExcluir = async () => {
    if(!user || !user.email) return;
    try {
      await setDoc(doc(db, "users", user.email as string), { 
        currentDiet: deleteField() 
      }, { merge: true });
      setSavedDiet(null);
      setModalVisible(false);
    } catch(err) {
      console.error("Erro ao excluir dieta", err);
    }
  };

  return (
    <View className="flex-1 bg-[#0a0f14] p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10 pt-4">
        
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-black text-2xl">Sua dieta aqui 🎯</Text>
          <View className="w-8 h-8 bg-blue-500 rounded-full" />
        </View>
        <Text className="text-slate-400 font-semibold mb-8">Preparamos um plano nutricional otimizado para sua saúde.</Text>

        {savedDiet && dietData ? (
          <View className="relative overflow-hidden bg-[#151a21] rounded-[32px] border border-white/5">
            
            <View className="p-6 pb-24">
              <Text className="text-3xl font-black text-[#8b5cf6] mb-6">
                {savedDiet.nome}
              </Text>
              
              <Text className="text-xs font-black text-white/80 uppercase tracking-widest mb-3">
                Avaliação Nutricional
              </Text>
              
              <Text className="text-slate-300 leading-7 text-base font-semibold" numberOfLines={4}>
                {dietData.avaliacao?.texto || "Seu plano personalizado foi gerado com base no seu metabolismo basal."}
              </Text>
            </View>

            {/* Efeito Blur/Gradient */}
            <View className="absolute bottom-0 left-0 right-0 h-56 justify-end p-6 bg-gradient-to-t from-[#151a21] via-[#151a21]/95 to-transparent">
              <TouchableOpacity 
                onPress={() => setModalVisible(true)} 
                className="bg-[#8b5cf6] py-4 rounded-2xl items-center shadow-lg shadow-[#8b5cf6]/30 mb-3"
                activeOpacity={0.9}
              >
                <Text className="text-white font-bold text-base">Visualizar Dieta Completa</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/isolated-calculation')} 
                className="bg-[#8b5cf6]/20 py-4 rounded-2xl items-center"
                activeOpacity={0.9}
              >
                <Text className="text-[#a78bfa] font-bold text-base">Criar uma nova dieta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="py-24 items-center bg-[#151a21] rounded-[32px] border border-white/5 p-6">
             <Text className="text-slate-400 text-lg text-center mb-6 font-semibold">
               Nenhuma dieta ativa encontrada.
             </Text>
             <TouchableOpacity 
                onPress={() => router.push('/isolated-calculation')} 
                className="bg-[#8b5cf6] px-8 py-4 rounded-2xl items-center w-full"
              >
                <Text className="text-white font-black text-base">Criar Dieta Agora</Text>
              </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* --- ESTÁGIO 2: MODAL COMPLETO E INTERATIVO --- */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 pt-6 px-4">
          
          {/* Header Modal */}
          <View className="flex-row justify-between items-center mb-6 px-2">
            <Text className="text-xl font-black text-slate-800 dark:text-white flex-1" numberOfLines={1}>
              {savedDiet?.nome}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-slate-200 dark:bg-slate-800 w-8 h-8 items-center justify-center rounded-full">
              <Text className="font-bold text-slate-600 dark:text-slate-300">✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
            
            {/* Bloco: Avaliação Nutricional */}
            <View className="bg-white dark:bg-slate-800 p-5 rounded-3xl mb-4 border border-green-500/20">
              <View className="flex-row items-center mb-4">
                <Text className="text-green-500 mr-2">📈</Text>
                <Text className="font-black text-slate-800 dark:text-white">Avaliação Nutricional</Text>
              </View>
              
              <View className="flex-row justify-around mb-5 px-4">
                <CircularProgress value={Number(dietData?.avaliacao?.imc) || 0} max={40} color="#10b981" label="IMC" />
                <View className="w-[1px] bg-slate-100 dark:bg-slate-700 h-12 self-center" />
                <CircularProgress value={Number(dietData?.avaliacao?.tdee) || 0} max={3500} color="#3b82f6" label="KCAL / TDEE" />
              </View>

              <View className="bg-green-50 dark:bg-green-500/10 p-3.5 rounded-xl">
                <Text className="text-green-700 dark:text-green-400 text-sm leading-5 font-semibold text-center">
                  {dietData?.avaliacao?.texto}
                </Text>
              </View>
            </View>

            {/* Blocos de Refeições */}
            {dietData?.refeicoes?.map((refeicao: any, idx: number) => (
              <View key={idx} className="mb-6 px-1">
                <View className="flex-row items-center mb-3">
                  <Text className="text-lg mr-2">{refeicao.icone}</Text>
                  <Text className="font-black text-slate-800 dark:text-white text-lg">{refeicao.nome}</Text>
                </View>
                {refeicao.itens.map((item: any, i: number) => (
                  <CheckboxItem key={i} item={item} />
                ))}
              </View>
            ))}

            {/* Bloco de Notas */}
            <View className="bg-white dark:bg-slate-800 p-5 rounded-3xl mb-6 border border-slate-200 dark:border-slate-700">
              <View className="flex-row items-center mb-4">
                <Text className="text-lg mr-2">📝</Text>
                <Text className="font-black text-slate-800 dark:text-white">Notas e Observações</Text>
              </View>
              {dietData?.notas?.map((nota: string, idx: number) => (
                <Text key={idx} className="text-slate-500 dark:text-slate-400 text-sm mb-2 leading-5">
                  • {nota}
                </Text>
              ))}
            </View>

            {/* Botão de Ação (Excluir) */}
            <TouchableOpacity 
              onPress={handleExcluir} 
              className="mt-2 bg-red-500 py-4 rounded-2xl items-center shadow-lg shadow-red-500/30"
              activeOpacity={0.9}
            >
              <Text className="text-white font-black text-base">🗑️ Excluir Dieta</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}