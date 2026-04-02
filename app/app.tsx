import { Redirect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import TypingText from "@/components/typing-text";
import { useAuth } from "@/contexts/auth-context";
import AboutScreen from "./(tabs)/about";
import CalculationScreen from "./(tabs)/calculation";

const tabs = [
  { key: "home", label: "Home" },
  { key: "calculation", label: "Calculation" },
  { key: "about", label: "About" },
];

function HomePanel({ user }: { user: any | null }) {
  const displayName = user?.displayName ?? "Usuário";

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-4 pt-12 pb-6">
        <Text className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
          Olá, {displayName}
        </Text>
        <Text className="mt-2 text-lg text-slate-600 dark:text-slate-300 leading-8">
          Bem-vindo ao seu espaço de saúde personalizado.
        </Text>
        <TypingText
          texts={[
            "IMC + TDEE em um só lugar",
            "Resultados rápidos e confiáveis",
            "Acompanhe sua evolução com estilo",
          ]}
          typingSpeed={80}
          erasingSpeed={40}
          delay={1600}
        />
      </View>

      <View className="mx-4 mt-6 rounded-[32px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-400/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <Text className="text-base font-black text-slate-900 dark:text-white mb-3">
          Seu painel rápido
        </Text>
        <View className="space-y-3">
          <View className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <Text className="text-slate-700 dark:text-slate-200 font-semibold">Próxima ação</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vá para Calculation para inserir seus dados e descobrir sua taxa metabólica.
            </Text>
          </View>
          <View className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <Text className="text-slate-700 dark:text-slate-200 font-semibold">Dica rápida</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Use About para alternar o tema apenas quando quiser ver a tela escura.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function AppScreen() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView | null>(null);
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!user) {
    return <Redirect href="/" />;
  }

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: width * activeIndex, animated: true });
  }, [activeIndex, width]);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    if (page !== activeIndex) {
      setActiveIndex(page);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="pt-12 px-4">
        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          Bem-vindo, {user?.displayName ?? "Usuário"}
        </Text>

        <View className="mx-auto w-full rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 shadow-sm">
          <View className="flex-row rounded-full overflow-hidden">
            {tabs.map((screen, index) => {
              const active = index === activeIndex;
              return (
                <TouchableOpacity
                  key={screen.key}
                  onPress={() => handleTabPress(index)}
                  activeOpacity={0.85}
                  className={`flex-1 px-3 py-2 items-center justify-center ${
                    active ? "bg-slate-900 dark:bg-white" : ""
                  }`}
                >
                  <Text
                    className={`font-black ${
                      active
                        ? "text-white dark:text-slate-900"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {screen.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        className="flex-1 mt-4"
      >
        <View style={{ width }} className="flex-1">
          <HomePanel user={user} />
        </View>
        <View style={{ width }} className="flex-1">
          <CalculationScreen />
        </View>
        <View style={{ width }} className="flex-1">
          <AboutScreen />
        </View>
      </ScrollView>
    </View>
  );
}