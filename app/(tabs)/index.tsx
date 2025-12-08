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
  View
} from "react-native";

import AssetListItem from "../../components/AssetListItem";
import FilterControls from "../../components/FilterControls";
import FilterModal from "../../components/FilterModal";

import { useRouter } from "expo-router";
import { deleteAsset, getAssets, getCategories, getModels, getStatuses } from "../../lib/api";
import { Asset } from "../../lib/types";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filtered, setFiltered] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  const [categories, setCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const checkAndLoad = async () => {
        const token = await AsyncStorage.getItem("apiToken");
        const serverUrl = await AsyncStorage.getItem("serverUrl");

        if (token && serverUrl) {
          await loadAssets();
          await loadFilters();
        }
      };
      checkAndLoad();
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

  async function loadFilters() {
    try {
      setCategories(await getCategories());
      setModels(await getModels());
      setStatuses(await getStatuses());
    } catch (err) {
      console.error("Błąd pobierania filtrów:", err);
    }
  }

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      assets.filter((a) => {
        if (
          !(
            a.name?.toLowerCase().includes(q) ||
            a.asset_tag?.toLowerCase().includes(q)
          )
        )
          return false;
        if (selectedCategory && a.category?.name !== selectedCategory) return false;
        if (selectedModel && a.model?.name !== selectedModel) return false;
        if (selectedStatus && a.status_label?.name !== selectedStatus) return false;
        return true;
      })
    );
  }, [query, assets, selectedCategory, selectedModel, selectedStatus]);

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
              Toast.show({
                type: "success",
                text1: "Sukces",
                text2: "Sprzęt został poprawnie usunięty!",
                position: "top",
                visibilityTime: 3000,
                text1Style: { fontSize: 20, fontWeight: "700" },
                text2Style: { fontSize: 16 },
              });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Błąd",
                text2: "Nie udało się usunąć sprzętu.",
                position: "top",
                visibilityTime: 3000,
                text1Style: { fontSize: 20, fontWeight: "700" },
                text2Style: { fontSize: 16 },
              });
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

        <FilterControls
          selectedCategory={selectedCategory}
          selectedModel={selectedModel}
          selectedStatus={selectedStatus}
          onClearCategory={() => setSelectedCategory(null)}
          onClearModel={() => setSelectedModel(null)}
          onClearStatus={() => setSelectedStatus(null)}
          onOpenModal={() => setFilterModalVisible(true)}
        />

        {loading ? (
          <Text style={{ color: C.text }}>Pobieram dane...</Text>
        ) : assets.length === 0 ? (
          <Text style={{ color: C.text }}>Brak danych lub brak konfiguracji</Text>
        ) : (
          <FlatList
            data={filtered}
            refreshing={loading}
            onRefresh={loadAssets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AssetListItem
                asset={item}
                backgroundColor={C.background}
                textColor={C.text}
                borderColor={C.icon + "40"}
                onPress={() =>
                  router.push({ pathname: "/asset/[id]", params: { id: item.id } })
                }
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id, item.name ?? "nieznany")}
              />
            )}
          />
        )}
      </View>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategory={selectedCategory}
        selectedModel={selectedModel}
        selectedStatus={selectedStatus}
        setSelectedCategory={setSelectedCategory}
        setSelectedModel={setSelectedModel}
        setSelectedStatus={setSelectedStatus}
        categories={categories}
        models={models}
        statuses={statuses}
      />
      
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
});
