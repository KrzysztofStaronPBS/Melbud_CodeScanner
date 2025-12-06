import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { loadInitialTheme, useColorScheme } from "@/hooks/theme-store";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    loadInitialTheme();
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("apiToken");
      const serverUrl = await AsyncStorage.getItem("serverUrl");

      if (!token || !serverUrl) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${serverUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
