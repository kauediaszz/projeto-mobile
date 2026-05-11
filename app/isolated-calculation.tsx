// app/isolated-calculation.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import CalculationScreen from './(tabs)/calculation';

export default function IsolatedCalculationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      {/* Header Sem Navbar */}
      <View className="flex-row items-center p-4 border-b border-slate-100 dark:border-slate-800 mt-10">
         <TouchableOpacity 
           onPress={() => router.replace('/app')}
           className="bg-red-100 dark:bg-red-500/20 px-4 py-2 rounded-xl"
         >
            <Text className="text-red-600 dark:text-red-400 font-black">✕ Cancelar</Text>
         </TouchableOpacity>
         <Text className="text-xl font-black ml-4 dark:text-white">Criar Nova Dieta</Text>
      </View>

      {/* Reutiliza a Tela de Calculo, passando onComplete para redirecionar para Home */}
      <CalculationScreen onComplete={() => router.replace('/app')} />
    </SafeAreaView>
  );
}