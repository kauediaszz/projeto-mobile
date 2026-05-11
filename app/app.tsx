// app/app.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
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
import { useDiet } from "@/contexts/diet-context";
import AboutScreen from "./(tabs)/about";
import CalculationScreen from "./(tabs)/calculation";
import DietaScreen from "./(tabs)/dieta";

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
            <Text className="text-slate-700 dark:text-slate-200 font-semibold">Dica do dia</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Mantenha-se hidratado e siga o seu plano alimentar para melhores resultados.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function AppScreen() {
  const { user } = useAuth();
  const { hasCompletedFirstDiet } = useDiet();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [navWidth, setNavWidth] = useState(0);
  const isScrolling = useRef(false);

  // Abas dinâmicas
  const tabs = hasCompletedFirstDiet
    ? [
        { key: "home", label: "Home" },
        { key: "dieta", label: "Dieta" },
        { key: "about", label: "About" },
      ]
    : [
        { key: "home", label: "Home" },
        { key: "calculation", label: "Calculation" },
        { key: "about", label: "About" },
      ];

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (!isScrolling.current) return;
    scrollRef.current?.scrollTo({ x: width * activeIndex, animated: true });
    isScrolling.current = false;
  }, [activeIndex, width]);

  if (!user) return <View />;

  const handleTabPress = (index: number) => {
    isScrolling.current = true;
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleNavLayout = (event: LayoutChangeEvent) => {
    setNavWidth(event.nativeEvent.layout.width);
  };

  const indicatorWidth = navWidth > 0 ? navWidth / tabs.length : 0;

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="pt-12 px-4">
        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          Dieta I.A.
        </Text>

        <View
          className="mx-auto w-full rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 relative overflow-hidden"
          onLayout={handleNavLayout}
        >
          {navWidth > 0 && (
            <View
              className="absolute inset-y-0 rounded-full bg-slate-900 dark:bg-white"
              style={{
                width: indicatorWidth,
                transform: [{ translateX: activeIndex * indicatorWidth }],
              }}
            />
          )}

          <View className="flex-row">
            {tabs.map((screen, index) => {
              const active = index === activeIndex;
              return (
                <TouchableOpacity
                  key={screen.key}
                  onPress={() => handleTabPress(index)}
                  className="flex-1 px-3 py-2 items-center"
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
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        className="flex-1 mt-4"
      >
        <View style={{ width }}>
          <HomePanel user={user} />
        </View>

        <View style={{ width }}>
          {hasCompletedFirstDiet ? <DietaScreen /> : <CalculationScreen />}
        </View>

        <View style={{ width }}>
          <AboutScreen />
        </View>
      </ScrollView>
    </View>
  );
}