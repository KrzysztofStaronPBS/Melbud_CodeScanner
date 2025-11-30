import AppHeader from "@/components/AppHeader";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const isScanScreen = pathname === "/scan";
  const insets = useSafeAreaInsets();

  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: themeColors.tint,
          tabBarInactiveTintColor: themeColors.icon,
          header: () => <AppHeader />,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: themeColors.background,
            height: 80 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 4,
            paddingTop: 4,
            borderTopColor: themeColors.icon + "40",
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
            color: themeColors.text,
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
          style={[
            styles.fab,
            { bottom: (80 + insets.bottom) + 16 }
          ]}
          onPress={() => router.push("/scan")}
        >
          <Ionicons name="qr-code-outline" size={42} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
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
