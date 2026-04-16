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
      <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">{label}</Text>
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
      className="flex-row items-center bg-white dark:bg-slate-800/50 p-3.5 rounded-2xl mb-2.5 border border-slate-200 dark:border-slate-700/50 shadow-sm"
    >
      <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${checked ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'}`}>
        {checked && <Text className="text-white text-xs font-black">✓</Text>}
      </View>
      <View className="flex-1">
        <Text className={`font-bold text-[15px] ${checked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
          {item.nome}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{item.detalhe}</Text>
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

  // Faz o parse do JSON salvo no Firebase
  const dietData = useMemo(() => {
    if (!savedDiet?.texto) return null;
    try {
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
    <>
      <ScrollView 
        className="flex-1 bg-slate-50 dark:bg-[#101217]" 
        showsVerticalScrollIndicator={false} 
        contentContainerClassName="pb-12 pt-10 px-5"
      >
        
        {/* Top Header Placeholder */}
        <View className="flex-row justify-between items-center mb-8">
          /// aqui podemos fazer algo legal para tirar a navbar
        </View>

        {/* Títulos Principais */}
        <View className="items-center mb-10">
          <Text className="text-slate-900 dark:text-white font-black text-[28px] mb-3">Sua dieta aqui 🎯</Text>
          <Text className="text-slate-600 dark:text-slate-300 text-center text-[15px] leading-6 px-4">
            Preparamos um plano nutricional otimizado para sua recuperação muscular.
          </Text>
        </View>

        {savedDiet && dietData ? (
          <>
            {/* Main Card */}
            <View className="relative bg-white dark:bg-[#1c1f2b] rounded-[32px] overflow-hidden min-h-[440px] mb-8 shadow-xl shadow-slate-200 dark:shadow-2xl dark:shadow-black/50 border border-slate-200 dark:border-white/5">
              <View className="p-7 pb-32">
                <Text className="text-[32px] leading-[40px] font-black text-purple-600 dark:text-[#9b7bf7] mb-6">
                  {savedDiet.nome}
                </Text>
                
                <Text className="text-[12px] font-black text-slate-500 dark:text-white uppercase tracking-widest mb-4">
                  Avaliação Nutricional
                </Text>
                
                <Text className="text-slate-600 dark:text-[#94a3b8] leading-[26px] text-[16px]" numberOfLines={7}>
                  {dietData.avaliacao?.texto || "Com base no seu perfil metabólico e objetivos de hipertrofia, esta dieta prioriza o aporte proteico de alto valor biológico e carboidratos de absorção lenta. O equilíbrio entre macronutrientes foi ajustado para maximizar a síntese proteica durante o repouso."}
                </Text>
              </View>

              {/* Blur Gradient & Button Overlay */}
              <View 
                pointerEvents="box-none"
                className="absolute bottom-0 left-0 right-0 h-48 justify-end px-7 pb-7 bg-gradient-to-t from-white via-white/95 dark:from-[#1c1f2b] dark:via-[#1c1f2b]/95 to-transparent"
              >
                <TouchableOpacity 
                  onPress={() => setModalVisible(true)} 
                  className="bg-purple-600 dark:bg-[#9b7bf7] py-[18px] rounded-full items-center w-full shadow-lg shadow-purple-600/20 dark:shadow-none"
                  activeOpacity={0.9}
                >
                  <Text className="text-white dark:text-[#1e1b4b] font-black text-[16px]">Visualizar Dieta Completa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Secondary Button */}
            <View className="items-center mb-8">
              <TouchableOpacity 
                onPress={() => router.push('/isolated-calculation')} 
                className="bg-purple-600 dark:bg-[#9b7bf7] py-[18px] rounded-full w-[80%] items-center shadow-lg shadow-purple-600/20 dark:shadow-none"
                activeOpacity={0.9}
              >
                <Text className="text-white dark:text-[#1e1b4b] font-black text-[16px]">Criar uma nova dieta</Text>
              </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View className="mb-4">
              <Text className="text-[12px] font-black text-slate-500 dark:text-white uppercase tracking-widest mb-3 ml-2">
                Dica de Nutrição
              </Text>
              <View className="flex-row bg-white dark:bg-[#1c1f2b] p-5 rounded-3xl items-center border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <View className="w-8 h-8 rounded-full border border-purple-500 dark:border-[#9b7bf7] items-center justify-center mr-4">
                  <Text className="text-purple-500 dark:text-[#9b7bf7] text-sm font-bold italic">i</Text>
                </View>
                <Text className="text-slate-600 dark:text-[#94a3b8] text-[13px] flex-1 leading-5 font-medium">
                  Beber 500ml de água 30 minutos antes desta refeição auxilia na digestão e controle de saciedade.
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View className="py-24 items-center bg-white dark:bg-[#1c1f2b] rounded-[32px] border border-slate-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
             <Text className="text-slate-600 dark:text-[#94a3b8] text-lg text-center mb-8 font-semibold">
               Nenhuma dieta ativa encontrada.
             </Text>
             <TouchableOpacity 
                onPress={() => router.push('/isolated-calculation')} 
                className="bg-purple-600 dark:bg-[#9b7bf7] py-[18px] rounded-full items-center w-[80%] shadow-lg shadow-purple-600/20 dark:shadow-none"
              >
                <Text className="text-white dark:text-[#1e1b4b] font-black text-[16px]">Criar Dieta Agora</Text>
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
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
            
            {/* Bloco: Avaliação Nutricional */}
            <View className="bg-white dark:bg-slate-800 p-5 rounded-3xl mb-4 border border-green-500/20 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Text className="text-green-500 mr-2 text-lg">📈</Text>
                <Text className="font-black text-slate-800 dark:text-white">Avaliação Nutricional</Text>
              </View>
              
              <View className="flex-row justify-around mb-5 px-4">
                <CircularProgress value={Number(dietData?.avaliacao?.imc) || 0} max={40} color="#10b981" label="IMC" />
                <View className="w-[1px] bg-slate-200 dark:bg-slate-700 h-12 self-center" />
                <CircularProgress value={Number(dietData?.avaliacao?.tdee) || 0} max={3500} color="#3b82f6" label="KCAL / TDEE" />
              </View>

              <View className="bg-green-50 dark:bg-green-500/10 p-4 rounded-2xl">
                <Text className="text-green-700 dark:text-green-400 text-[13px] leading-5 font-semibold text-center">
                  {dietData?.avaliacao?.texto}
                </Text>
              </View>
            </View>

            {/* Blocos de Refeições */}
            {dietData?.refeicoes?.map((refeicao: any, idx: number) => (
              <View key={idx} className="mb-6 px-1 mt-2">
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
            <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl mb-6 border border-slate-200 dark:border-slate-700 shadow-sm mt-2">
              <View className="flex-row items-center mb-4">
                <Text className="text-lg mr-2">📝</Text>
                <Text className="font-black text-slate-800 dark:text-white">Notas e Observações</Text>
              </View>
              {dietData?.notas?.map((nota: string, idx: number) => (
                <Text key={idx} className="text-slate-600 dark:text-slate-400 text-[14px] mb-2.5 leading-6 font-medium">
                  • {nota}
                </Text>
              ))}
            </View>

            {/* Botão de Ação (Excluir) */}
            <TouchableOpacity 
              onPress={handleExcluir} 
              className="mt-2 bg-red-500 py-[18px] rounded-full items-center shadow-lg shadow-red-500/30"
              activeOpacity={0.9}
            >
              <Text className="text-white font-black text-[16px]">🗑️ Excluir Dieta</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </Modal>

    </>
  );
}