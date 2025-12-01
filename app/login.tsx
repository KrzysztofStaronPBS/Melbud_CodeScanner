import AppHeader from "@/components/AppHeader";
import { useColorScheme } from "@/hooks/theme-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(true);
  const router = useRouter();

  const theme = useColorScheme(); 
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    const loadToken = async () => {
      const saved = await AsyncStorage.getItem("apiToken");
      if (saved) {
        setToken(saved);
        router.replace("/(tabs)");
      }
    };
    loadToken();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Nieprawidłowy token API");
      }

      const data = await res.json();

      if (remember) {
        await AsyncStorage.setItem("apiToken", token);
      }

      await AsyncStorage.setItem("user", JSON.stringify(data));
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Logowanie nieudane", err.message);
    }
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <View style={styles.container}>
        <Text style={styles.title}>Podaj klucz API</Text>
        <TextInput
          style={styles.input}
          placeholder="Wklej swój klucz API"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#777"}
          value={token}
          onChangeText={setToken}
        />
        <View style={styles.rememberRow}>
          <Switch value={remember} onValueChange={setRemember} />
          <Text style={styles.text}>Zapamiętaj token</Text>
        </View>
        <Button title="Zaloguj" onPress={handleLogin} />
      </View>
    </View>
  );
}

function createStyles(theme: "light" | "dark") {
  const isDark = theme === "dark";

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#f5f5f5",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
      color: isDark ? "#fff" : "#000",
    },
    text: {
      color: isDark ? "#fff" : "#000",
      marginLeft: 8,
    },
    input: {
      backgroundColor: isDark ? "#1e1e1e" : "#fff",
      color: isDark ? "#fff" : "#000",
      padding: 12,
      marginBottom: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#ccc",
    },
    rememberRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
  });
}
