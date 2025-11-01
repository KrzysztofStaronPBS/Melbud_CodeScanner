import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import AssetItem from "../components/AssetItem";
import { getAssets } from "../lib/api";
import { Asset } from "../lib/types";

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
