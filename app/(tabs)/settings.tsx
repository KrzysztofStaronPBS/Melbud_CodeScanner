import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("apiToken");
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się wylogować");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ustawienia</Text>
      <Button title="Wyloguj" color="#d32f2f" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, marginBottom: 20 },
});
