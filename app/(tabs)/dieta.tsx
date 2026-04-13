import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// IMPORTANTE: Usando setDoc e deleteField
import { useAuth } from '@/contexts/auth-context';
import { useDiet } from '@/contexts/diet-context';
import { db } from '@/firebaseConfig';
import { deleteField, doc, setDoc } from 'firebase/firestore';

export default function DietaScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { savedDiet, setSavedDiet } = useDiet();

  const handleExcluir = async () => {
    if(!user || !user.email) return;
    
    try {
      // CORREÇÃO: Usando setDoc com merge: true
      await setDoc(doc(db, "users", user.email as string), { 
        currentDiet: deleteField() 
      }, { merge: true });
      
      setSavedDiet(null);
    } catch(err) {
      console.error("Erro ao excluir dieta", err);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-900 p-4">
      {savedDiet ? (
        <View className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 mb-6">
          <Text className="text-3xl font-black text-[#ff0054] mb-4">{savedDiet.nome}</Text>
          <Text className="text-slate-700 dark:text-slate-300 leading-6">{savedDiet.texto}</Text>
          
          <TouchableOpacity onPress={handleExcluir} className="mt-8 bg-red-100 dark:bg-red-500/20 p-4 rounded-2xl items-center">
            <Text className="text-red-600 dark:text-red-400 font-bold text-lg">Excluir esta Dieta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="py-12 items-center">
           <Text className="text-slate-500 dark:text-slate-400 text-lg text-center mb-2 font-semibold">
             Você não possui nenhuma dieta ativa no momento.
           </Text>
        </View>
      )}

      <TouchableOpacity 
        onPress={() => router.push('/isolated-calculation')} 
        className="bg-[#00ffd5]/20 border border-[#00ffd5] p-5 rounded-3xl items-center mt-2 mb-10"
      >
        <Text className="text-slate-900 dark:text-white font-black text-lg">+ Fazer Nova Dieta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}