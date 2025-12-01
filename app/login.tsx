import AppHeader from "@/components/AppHeader";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(true);
  const router = useRouter();

  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  const styles = useMemo(() => createStyles(C), [C]);

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
          placeholderTextColor={C.icon}
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

function createStyles(C: any) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: C.background,
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
      color: C.text,
    },
    text: {
      color: C.text,
      marginLeft: 8,
    },
    input: {
      backgroundColor: C.background,
      color: C.text,
      padding: 12,
      marginBottom: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: C.icon + "50",
    },
    rememberRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
  });
}
