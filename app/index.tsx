import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { useAuth } from "@/contexts/auth-context";
import { LoginForm } from "./login";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (user) {
      router.replace("/app" as any);
    }
  }, [user, router]);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    if (page !== activeIndex) {
      setActiveIndex(page);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-slate-950"
    >
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        className="flex-1"
      >
        <View
          style={{ width }}
          className="flex-1 px-6 justify-center bg-gradient-to-b from-cyan-400/20 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        >
          <View className="rounded-[36px] bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-8 shadow-2xl shadow-slate-400/20">
            <Text className="text-5xl font-black text-slate-900 dark:text-white mb-4">
              Bem-vindo
            </Text>
            <Text className="text-lg text-slate-600 dark:text-slate-300 leading-8">
              Comece sua jornada de saúde com uma experiência mais inteligente, prática e personalizada.
            </Text>
            <View className="mt-8 rounded-3xl bg-slate-100 dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700">
              <Text className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Arraste para a esquerda para entrar
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 leading-6">
                Use o gesto de swipe para avançar para a tela de login e começar o acesso.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width }} className="flex-1 px-6 justify-center bg-white dark:bg-slate-950">
          <LoginForm onSuccess={() => router.replace("/app" as any)} />
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-center gap-2 py-4">
        <View className={`h-2 w-6 rounded-full ${activeIndex === 0 ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-600"}`} />
        <View className={`h-2 w-6 rounded-full ${activeIndex === 1 ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-600"}`} />
      </View>
    </KeyboardAvoidingView>
  );
}
