import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import AssetItem from "../../components/AssetItem";
import { deleteAsset, getAssets } from "../../lib/api";
import { Asset } from "../../lib/types";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";

export default function HomeScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filtered, setFiltered] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  useFocusEffect(
    useCallback(() => {
      loadAssets();
    }, [])
  );

  async function loadAssets() {
    setLoading(true);
    try {
      const data = await getAssets();
      setAssets(data.rows);
      setFiltered(data.rows);
    } catch (err: any) {
      console.error("Błąd API:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      assets.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.asset_tag?.toLowerCase().includes(q)
      )
    );
  }, [query, assets]);

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      "Potwierdzenie",
      `Czy na pewno chcesz usunąć "${name}"?`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAsset(id);
              setAssets((prev) => prev.filter((a) => a.id !== id));
            } catch (err: any) {
              Alert.alert("Błąd", "Nie udało się usunąć przedmiotu.");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id: number) => {
    router.push({ pathname: "/asset/[id]/edit", params: { id } });
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: C.background }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.container, { backgroundColor: C.background }]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.search,
              {
                backgroundColor: C.background,
                color: C.text,
                borderColor: C.icon + "50",
              },
            ]}
            placeholder="Szukaj po nazwie lub tagu..."
            placeholderTextColor={C.icon}
            value={query}
            onChangeText={setQuery}
          />

          <TouchableOpacity
            style={[styles.addButton]}
            onPress={() => router.push("/asset/add")}
          >
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={{ color: C.text }}>Pobieram dane...</Text>
        ) : (
          <FlatList
            data={filtered}
            refreshing={loading}
            onRefresh={loadAssets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.itemRow,
                  {
                    backgroundColor: C.background,
                    borderColor: C.icon + "40",
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    router.push({
                      pathname: "/asset/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <AssetItem asset={item} backgroundColor={C.background} textColor={C.text} />
                </TouchableOpacity>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.edit]}
                    onPress={() => handleEdit(item.id)}
                  >
                    <Text style={styles.btnText}>Edytuj</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.delete]}
                    onPress={() =>
                      handleDelete(item.id, item.name ?? "nieznany")
                    }
                  >
                    <Text style={styles.btnText}>Usuń</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
  },
  search: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  addButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
  },
  itemRow: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  actions: { flexDirection: "row", gap: 6 },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  edit: { backgroundColor: "#2196f3" },
  delete: { backgroundColor: "#f44336" },
  btnText: { color: "#fff", fontWeight: "600" },
});
