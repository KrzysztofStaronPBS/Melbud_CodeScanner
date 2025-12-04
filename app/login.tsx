import AppHeader from "@/components/AppHeader";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [remember, setRemember] = useState(true);
  const router = useRouter();

  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  const styles = useMemo(() => createStyles(C), [C]);

  const [ip1, setIp1] = useState("");
  const [ip2, setIp2] = useState("");
  const [ip3, setIp3] = useState("");
  const [ip4, setIp4] = useState("");

  const ip1Ref = useRef<TextInput>(null);
  const ip2Ref = useRef<TextInput>(null);
  const ip3Ref = useRef<TextInput>(null);
  const ip4Ref = useRef<TextInput>(null);

  const [port, setPort] = useState("8080");
  const [useDefaultPort, setUseDefaultPort] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      const savedToken = await AsyncStorage.getItem("apiToken");
      const savedUrl = await AsyncStorage.getItem("serverUrl");
      if (savedToken && savedUrl) {
        setToken(savedToken);
        setServerUrl(savedUrl);
      }
    };
    loadConfig();
  }, []);

    const buildServerUrl = () => {
      const ip = `${ip1}.${ip2}.${ip3}.${ip4}`;
      const finalPort = useDefaultPort ? "8080" : port;
      return ip && finalPort ? `${ip}:${finalPort}` : "";
    };

    const tryFetch = async (url: string) => {
      try {
        const res = await fetch(`${url}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) return res;
      } catch {}
      return null;
    }

  const handleLogin = async () => {
    try {
      const base = buildServerUrl();

      let res = await tryFetch(`http://${base}`);
      let finalUrl = `http://${base}`;
      if (!res) {
        res = await tryFetch(`https://${base}`);
        finalUrl = `https://${base}`;
      }

      if (!res) {
        throw new Error("Nie udało się połączyć z serwerem (sprawdź IP/port).");
      }

      if (res.status === 401) {
        throw new Error("Nieprawidłowy klucz API.");
      }

      if (!res.ok) {
        throw new Error(`Błąd serwera: ${res.status}`);
      }

      const data = await res.json();

      if (remember) {
        await AsyncStorage.setItem("apiToken", token);
        await AsyncStorage.setItem("serverUrl", `${finalUrl}/api/v1`);
      }

      await AsyncStorage.setItem("user", JSON.stringify(data));
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Logowanie nieudane", err.message);
    }
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <View style={styles.container}>
       <Text style={styles.title}>Wprowadź adres IP serwera Snipe-IT</Text>
        <View style={styles.ipRow}>
          <TextInput
            ref={ip1Ref}
            style={styles.ipInput}
            keyboardType="numeric"
            maxLength={3}
            value={ip1}
            onChangeText={(val) => {
              setIp1(val);
              if (val.length === 3) ip2Ref.current?.focus();
            }}
          />
          <Text style={styles.dot}>.</Text>
          <TextInput
            ref={ip2Ref}
            style={styles.ipInput}
            keyboardType="numeric"
            maxLength={3}
            value={ip2}
            onChangeText={(val) => {
              setIp2(val);
              if (val.length === 3) ip3Ref.current?.focus();
            }}
          />
          <Text style={styles.dot}>.</Text>
          <TextInput
            ref={ip3Ref}
            style={styles.ipInput}
            keyboardType="numeric"
            maxLength={3}
            value={ip3}
            onChangeText={(val) => {
              setIp3(val);
              if (val.length === 3) ip4Ref.current?.focus();
            }}
          />
          <Text style={styles.dot}>.</Text>
          <TextInput
            ref={ip4Ref}
            style={styles.ipInput}
            keyboardType="numeric"
            maxLength={3}
            value={ip4}
            onChangeText={setIp4}
          />
        </View>

       <Text style={styles.title}>Wpisz port serwera</Text>

      <View style={styles.portSection}>
        <TextInput
          style={[
            styles.portInput,
            useDefaultPort && styles.portInputDisabled,
          ]}
          keyboardType="numeric"
          placeholder="Port serwera"
          placeholderTextColor={C.icon}
          value={port}
          onChangeText={setPort}
          editable={!useDefaultPort}
        />
        <View style={styles.portToggle}>
          <Switch value={useDefaultPort} onValueChange={setUseDefaultPort} />
          <Text style={styles.text}>Port domyślny</Text>
        </View>
      </View>
        
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
          <Text style={styles.text}>Zapamiętaj dane logowania</Text>
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
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 24,
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
      marginBottom: 96,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: C.icon + "50",
    },
    rememberRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    ipRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 60,
    },
    ipInput: {
      width: 60,
      height: 48,
      textAlign: "center",
      fontSize: 18,
      backgroundColor: C.background,
      color: C.text,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: C.icon + "50",
    },
    dot: {
      fontSize: 18,
      color: C.text,
      marginHorizontal: 4,
    },
    portSection: {
    alignItems: "center",
    marginBottom: 60,
    },
    portInput: {
      width: 100,
      height: 48,
      textAlign: "center",
      fontSize: 18,
      backgroundColor: C.background,
      color: C.text,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: C.icon + "50",
      marginBottom: 12,
    },
    portToggle: {
      flexDirection: "row",
      alignItems: "center",
    },
    portInputDisabled: {
      backgroundColor: C.icon + "20",
      color: C.icon + "80",
},
  });
}
