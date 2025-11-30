import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { setTheme, ThemeChoice, useThemeStore } from "@/hooks/theme-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

export default function SettingsScreen() {
  const router = useRouter();
  const themePref = useThemeStore(); 
  const [userChoice, setUserChoice] = useState<ThemeChoice>("light"); 
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem("app_theme").then(saved => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setUserChoice(saved);
      }
    });
  }, []);

  const saveThemePref = async (value: ThemeChoice) => {
    try {
      setUserChoice(value);
      await setTheme(value);
      Alert.alert("Zapisano", `Motyw ustawiony na: ${value}`);
    } catch (err) {
      console.error("Błąd zapisu ustawień motywu", err);
      Alert.alert("Błąd", "Nie udało się zapisać ustawienia motywu.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("apiToken");
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się wylogować");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Ustawienia</Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Motyw aplikacji</Text>

      <View style={styles.optionsRow}>
        <ThemeOption
          label="Jasny"
          selected={userChoice === "light"}
          onPress={() => saveThemePref("light")}
          theme={theme}
        />
        <ThemeOption
          label="Ciemny"
          selected={userChoice === "dark"}
          onPress={() => saveThemePref("dark")}
          theme={theme}
        />
        <ThemeOption
          label="Systemowy"
          selected={userChoice === "system"}
          onPress={() => saveThemePref("system")}
          theme={theme}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <Pressable style={[styles.logoutBtn, { backgroundColor: theme.colors.notification }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Wyloguj</Text>
      </Pressable>
    </View>
  );
}

function ThemeOption({
  label,
  selected,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected
            ? theme.colors.card
            : theme.colors.background,
          borderWidth: 1,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.radio,
          { borderColor: selected ? theme.colors.primary : theme.colors.border },
        ]}
      >
        {selected && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
      </View>
      <Text style={[styles.optionLabel, { color: theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  logoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "stretch",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});
