import AppHeader from "@/components/AppHeader";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs, usePathname, useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const isScanScreen = pathname === "/scan";
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          header: () => <AppHeader />,
          headerStyle: { height: 40 },
          headerTransparent: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 80 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 4,
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
          style={[styles.fab,
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

header: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 10,
  backgroundColor: "#fff",
  elevation: 2,
},

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 8,
    color: "#00897B",
  },
});
