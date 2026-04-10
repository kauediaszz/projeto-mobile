import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

import { useAuth } from "@/contexts/auth-context";

export default function TabLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return <View />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <Slot />
    </View>
  );
}
