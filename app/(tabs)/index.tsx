// app/(tabs)/index.tsx
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AssetItem from "../../components/AssetItem";
import { getAssets } from "../../lib/api";
import { Asset } from "../../lib/types";

export default function HomeScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filtered, setFiltered] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

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
            renderItem={({ item }) => <AssetItem asset={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  search: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
