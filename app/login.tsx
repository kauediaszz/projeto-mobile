import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/contexts/auth-context";

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  function handleSubmit() {
    setError("");

    const success = signIn(username.trim(), password);
    if (success) {
      onSuccess();
      return;
    }

    setError("Usuário ou senha inválidos. Use admin / 123456.");
  }

  return (
    <>
      <Text className="text-4xl font-black text-slate-900 dark:text-white mb-2">
        Dieta I.A.
      </Text>
      <Text className="text-base text-slate-600 dark:text-slate-300 mb-8">
        Entre com sua conta ou registre-se para começar.
      </Text>

      <View className="flex-row rounded-full bg-slate-100 dark:bg-slate-800 p-1 mb-7 border border-slate-200 dark:border-slate-700">
        <TouchableOpacity
          onPress={() => setMode("login")}
          className={`flex-1 rounded-full px-4 py-3 items-center ${
            mode === "login" ? "bg-white dark:bg-slate-900" : ""
          }`}
          activeOpacity={0.85}
        >
          <Text
            className={`font-bold ${
              mode === "login"
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("register")}
          className={`flex-1 rounded-full px-4 py-3 items-center ${
            mode === "register" ? "bg-white dark:bg-slate-900" : ""
          }`}
          activeOpacity={0.85}
        >
          <Text
            className={`font-bold ${
              mode === "register"
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>

      <View className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <Text className="text-slate-900 dark:text-white font-bold text-lg mb-4">
          {mode === "login" ? "Acessar" : "Registrar"}
        </Text>

        <Text className="text-slate-500 dark:text-slate-400 mb-2">Usuário</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="admin"
          placeholderTextColor="#94a3b8"
          className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text className="text-slate-500 dark:text-slate-400 mb-2">Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="123456"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
        />

        {error ? (
          <Text className="text-red-500 mb-4">{error}</Text>
        ) : (
          <Text className="text-slate-500 dark:text-slate-400 mb-4">
            Dados de teste: admin / 123456
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-2xl bg-slate-900 px-4 py-3 items-center"
          activeOpacity={0.85}
        >
          <Text className="font-bold text-white">
            {mode === "login" ? "Entrar" : "Registrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/app" as any);
    }
  }, [user, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-slate-900"
    >
      <View className="flex-1 justify-center px-6">
        <LoginForm onSuccess={() => router.replace("/app" as any)} />
      </View>
    </KeyboardAvoidingView>
  );
}
