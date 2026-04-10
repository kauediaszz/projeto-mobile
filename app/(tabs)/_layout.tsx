import { Redirect, Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

import { useAuth } from "@/contexts/auth-context";

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <Slot />
    </View>
  );
}
