import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppHeader() {
  return (
    <SafeAreaView edges={["top"]}>
      <View style={styles.header}>
        <Ionicons name="cube-outline" size={24} color="#00897B" />
        <Text style={styles.headerText}>Melbud CodeScanner</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    elevation: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 8,
    color: "#00897B",
  },
});
