import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { Appearance, ColorSchemeName } from "react-native";

const STORAGE_KEY = "app_theme";

export type ThemeChoice = "light" | "dark" | "system";

let currentTheme: ThemeChoice = "light";

let listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function getSystemTheme(): "light" | "dark" {
  const scheme: ColorSchemeName = Appearance.getColorScheme();
  return scheme === "dark" ? "dark" : "light";
}

export function useThemeStore() {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      const subscription = Appearance.addChangeListener(() => {
        if (currentTheme === "system") emit();
      });
      return () => {
        listeners.delete(callback);
        subscription.remove();
      };
    },
    () => {
      if (currentTheme === "system") {
        return getSystemTheme();
      }
      return currentTheme;
    }
  );
}

export async function loadInitialTheme() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") {
    currentTheme = saved;
  }
  emit();
}

export async function setTheme(value: ThemeChoice) {
  currentTheme = value;
  await AsyncStorage.setItem(STORAGE_KEY, value);
  emit();
}

export function useColorScheme() {
  return useThemeStore();
}
