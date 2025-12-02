import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";

export default function AppHeader() {
  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: C.background }}>
      <View
        style={[
          styles.header,
          { backgroundColor: C.background, borderColor: C.icon + "40" },
        ]}
      >
        <Ionicons name="cube-outline" size={24} color={C.tint} />
        <Text style={[styles.headerText, { color: C.text }]}>
          Melbud CodeScanner
        </Text>
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
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 8,
  },
});
