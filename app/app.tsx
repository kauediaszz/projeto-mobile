import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
import { Collapsible } from "@/components/ui/collapsible";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AboutScreen from "./(tabs)/about";
import CalculationScreen from "./(tabs)/calculation";

function HomePanel({ user, dietasSalvas, dietTabVisible, handleTabPress }: { user: any | null; dietasSalvas: any[]; dietTabVisible: boolean; handleTabPress: (index: number) => void }) {
  const displayName = user?.displayName ?? "Usuário";

  const hasDietAccess = dietasSalvas.length > 0 || dietTabVisible;

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
          {dietasSalvas.length > 0 ? "Parabéns por criar sua dieta conosco!" : "Seu painel rápido"}
        </Text>
        <View className="space-y-3">
          <TouchableOpacity
            className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            onPress={() => handleTabPress(1)}
            activeOpacity={0.8}
          >
            <Text className="text-slate-700 dark:text-slate-200 font-semibold">
              {hasDietAccess ? "Ver minhas dietas" : "Próxima ação"}
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {hasDietAccess ? `Você tem ${dietasSalvas.length} dieta(s) salva(s)` : "Vá para Calculation para inserir seus dados."}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function DietScreen({ dietasSalvas, excluirDieta, limparDadosTemporarios }: { dietasSalvas: any[]; excluirDieta: (id: string) => void; limparDadosTemporarios: () => void }) {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setActiveSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDelete = (id: string, nome: string) => {
    Alert.alert(
      "Excluir Dieta",
      `Tem certeza que deseja excluir a dieta "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => excluirDieta(id) },
      ]
    );
  };

  if (dietasSalvas.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-slate-900 px-4 pt-12">
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-black text-slate-900 dark:text-white mb-4 text-center">
            Nenhuma dieta salva ainda
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-300 mb-8 text-center leading-6">
            Crie sua primeira dieta personalizada e acompanhe sua evolução.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-full"
            onPress={() => {
              limparDadosTemporarios();
              // Navigate to Calculation tab
              // This will be handled by the parent component
            }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">Fazer nova dieta</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-4 pt-12 pb-6">
        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-2">
          Suas Dietas
        </Text>
        <Text className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          {dietasSalvas.length} dieta{dietasSalvas.length > 1 ? 's' : ''} salva{dietasSalvas.length > 1 ? 's' : ''}
        </Text>

        {dietasSalvas.map((dieta, index) => (
          <Collapsible
            key={dieta.id}
            title={dieta.nome}
            isOpen={activeSections.includes(index)}
            onToggle={() => toggleSection(index)}
            className="mb-4"
          >
            <View className="px-4 pb-4">
              <Text className="text-slate-700 dark:text-slate-200 leading-6 mb-4">
                {dieta.conteudo}
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Criada em {new Date(dieta.createdAt).toLocaleDateString('pt-BR')}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(dieta.id, dieta.nome)}
                  className="bg-red-500 px-3 py-2 rounded-lg"
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="delete" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Collapsible>
        ))}

        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-full mt-6 self-center"
          onPress={() => {
            limparDadosTemporarios();
            // Navigate to Calculation tab
            // This will be handled by the parent component
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-lg">Fazer nova dieta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function AppScreen() {
  const { user } = useAuth();
  const { dietasSalvas, dietTabVisible, isDietLoading, excluirDieta, limparDadosTemporarios } = useDiet();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [navWidth, setNavWidth] = useState(0);

  const isScrolling = useRef(false);

  const tabs = dietasSalvas.length > 0
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

  // 👉 SYNC FINAL
  useEffect(() => {
    if (!isScrolling.current) return;

    scrollRef.current?.scrollTo({ x: width * activeIndex, animated: true });
    isScrolling.current = false;
  }, [activeIndex, width]);

  if (!user) {
    return <View />;
  }

  if (isDietLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color="#ff0054" />
      </View>
    );
  }

  // 👉 NAV CLICK
  const handleTabPress = (index: number) => {
    isScrolling.current = true;
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const handleStartNewDiet = () => {
    limparDadosTemporarios();
    isScrolling.current = true;
    setActiveIndex(1);
    scrollRef.current?.scrollTo({ x: width * 1, animated: true });
  };

  // 👉 SWIPE
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
          Bem-vindo, {user?.displayName ?? "Usuário"}
        </Text>

        {/* NAVBAR */}
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

      {/* SWIPE CONTAINER */}
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
          <HomePanel user={user} dietasSalvas={dietasSalvas} dietTabVisible={dietTabVisible} handleTabPress={handleTabPress} />
        </View>

        <View style={{ width }}>
          {dietasSalvas.length > 0 ? (
            <DietScreen
              dietasSalvas={dietasSalvas}
              excluirDieta={excluirDieta}
              limparDadosTemporarios={limparDadosTemporarios}
            />
          ) : (
            <CalculationScreen />
          )}
        </View>

        <View style={{ width }}>
          <AboutScreen />
        </View>
      </ScrollView>
    </View>
  );
}