import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/contexts/auth-context";
import { useAppTheme } from "@/contexts/theme-context";

export default function PreferencesScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/" as any);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-slate-900"
      contentContainerClassName="pb-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-12">
        {/* Botão de Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 flex-row items-center"
          activeOpacity={0.85}
        >
          <Text className="text-[#ff0054] font-bold text-base">
            ← Voltar
          </Text>
        </TouchableOpacity>

        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Preferências
        </Text>

        {/* Tema */}
        <View className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-sm mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Tema
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300">
                Modo {theme === "dark" ? "Escuro" : "Claro"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              className={`rounded-full px-5 py-2 ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-slate-200"
              }`}
              activeOpacity={0.85}
            >
              <Text className="font-bold text-slate-900 dark:text-white">
                {theme === "dark" ? "🌙" : "☀️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

       
      </View>
    </ScrollView>
  );
}