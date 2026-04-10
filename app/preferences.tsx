import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { updateProfile } from "firebase/auth";

import { useAuth } from "@/contexts/auth-context";
import { useAppTheme } from "@/contexts/theme-context";

export default function PreferencesScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppTheme();
  const { logout, user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setFeedback(null);

    try {
      await updateProfile(user, { displayName });
      setFeedback({ text: "Tudo certo! Dados atualizados.", type: "success" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      setFeedback({ text: "Deu ruim! Tente novamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-slate-900"
      contentContainerClassName="pb-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 flex-row items-center"
          activeOpacity={0.85}
        >
          <Text className="text-[#ff0054] font-bold text-base">
            &larr; Voltar
          </Text>
        </TouchableOpacity>

        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Preferências
        </Text>

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

        <View className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-sm mb-6">
          <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Meus Dados
          </Text>

          <Text className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
            Nome de Usuário
          </Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={30}
            placeholder="Seu nome"
            placeholderTextColor="#94a3b8"
            className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl px-4 py-3 mb-4 border border-slate-200 dark:border-slate-700"
          />

          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={loading}
            className={`rounded-xl py-3 items-center flex-row justify-center ${loading ? 'bg-slate-600' : 'bg-slate-900 dark:bg-white'}`}
            activeOpacity={0.85}
          >
            {loading ? (
               <ActivityIndicator color={theme === "dark" ? "#0f172a" : "#ffffff"} size="small" />
            ) : (
              <Text className="text-white dark:text-slate-900 font-bold text-base">
                Salvar Alterações
              </Text>
            )}
          </TouchableOpacity>

          {feedback && (
            <Text className={`text-center mt-4 font-bold ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {feedback.text}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}