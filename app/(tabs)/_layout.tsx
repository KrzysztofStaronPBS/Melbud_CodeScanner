import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs, usePathname, useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const pathname = usePathname();
  const isScanScreen = pathname === "/scan";


  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 80,
            paddingBottom: 4,
            paddingTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Lista urządzeń",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="clipboard-list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="manage"
          options={{
            title: "Zarządzaj",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="create" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Ustawienia",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {!isScanScreen && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/scan")}
        >
          <Ionicons name="qr-code-outline" size={42} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 100,
    right: 24,
    backgroundColor: "#00897B",
    borderRadius: 42,
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
