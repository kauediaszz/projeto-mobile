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

const getFirebaseErrorMessage = (error: unknown) => {
  const firebaseError = error as { code?: string; message?: string };

  switch (firebaseError.code) {
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/user-not-found":
      return "Usuário não encontrado.";
    case "auth/wrong-password":
      return "Senha incorreta.";
    case "auth/email-already-in-use":
      return "Este email já está em uso.";
    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";
    case "auth/network-request-failed":
      return "Erro de rede. Verifique sua conexão.";
    default:
      return firebaseError.message || "Erro ao autenticar. Tente novamente.";
  }
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@\$%]).{8,16}$/;
    return regex.test(value);
  };

  const handleSubmit = async () => {
    setError("");

    try {
      if (mode === "register") {
        if (!validatePassword(password)) {
          setError("Senha deve ter 8-16 caracteres, incluir ao menos um número e um caractere especial (!@$%).");
          return;
        }

        if (!username.trim()) {
          setError("Por favor, informe um nome de usuário.");
          return;
        }

        if (!email.trim()) {
          setError("Por favor, informe um email válido.");
          return;
        }

        await signUp(username.trim(), email.trim(), password);
      } else {
        const identifier = username.trim() || email.trim();
        if (!identifier) {
          setError("Por favor, informe email ou usuário.");
          return;
        }

        await signIn(identifier, password);
      }
      onSuccess();
    } catch (submitError) {
      setError(getFirebaseErrorMessage(submitError));
    }
  };

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

        {mode === "register" ? (
          <>
            <Text className="text-slate-500 dark:text-slate-400 mb-2">Usuário</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Seu nome de usuário"
              placeholderTextColor="#94a3b8"
              className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text className="text-slate-500 dark:text-slate-400 mb-2">E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#94a3b8"
              className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </>
        ) : (
          <>
            <Text className="text-slate-500 dark:text-slate-400 mb-2">E-mail ou Usuário</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu email ou usuário"
              placeholderTextColor="#94a3b8"
              className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </>
        )}

        <Text className="text-slate-500 dark:text-slate-400 mb-2">Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
        />

        {error ? (
          <Text className="text-red-500 mb-4">{error}</Text>
        ) : null}

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
