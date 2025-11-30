import { useThemeStore } from "./theme-store";

export function useColorScheme() {
  return useThemeStore();
}
