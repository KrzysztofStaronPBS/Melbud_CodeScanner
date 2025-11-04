import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import AssetItem from "../../components/AssetItem";
import { deleteAsset, getAssets } from "../../lib/api";
import { Asset } from "../../lib/types";

export default function HomeScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filtered, setFiltered] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadAssets();
  }, []);

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

  // 🗑️ Usuwanie wpisu
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

  // 🖊️ Edycja wpisu
  const handleEdit = (id: number) => {
    router.push({ pathname: "/asset/[id]/edit", params: { id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" backgroundColor="#f5f5f5" />
      <View style={styles.container}>
        <TextInput
          style={styles.search}
          placeholder="Szukaj po nazwie lub tagu..."
          value={query}
          onChangeText={setQuery}
        />
        {loading ? (
          <Text>Pobieram dane...</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    router.push({ pathname: "/asset/[id]", params: { id: item.id } })
                  }
                >
                  <AssetItem asset={item} />
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
                    onPress={() => handleDelete(item.id, item.name ?? "nieznany")}
                  >
                    <Text style={styles.btnText}>Usuń</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  search: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  itemRow: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
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
