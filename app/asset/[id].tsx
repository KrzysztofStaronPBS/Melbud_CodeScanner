import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../lib/api";
import { AssetDetails } from "../../lib/types";

export default function AssetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [assetDetails, setAsset] = useState<AssetDetails | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<AssetDetails>(`hardware/${id}`);
        setAsset(res.data);
        navigation.setOptions({
          title: res.data.name || res.data.asset_tag || "Szczegóły",
        });
      } catch (err) {
        console.error("Błąd API:", err);
      }
    }
    if (id) load();
  }, [id, navigation]);

  if (!assetDetails) {
    return (
      <View style={styles.center}>
        <Text>Ładowanie danych...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{assetDetails.status_label?.name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Firma:</Text>
        <Text style={styles.value}>{assetDetails.company?.name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Nazwa nabytku:</Text>
        <Text style={styles.value}>{assetDetails.name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Producent:</Text>
        <Text style={styles.value}>{assetDetails.manufacturer?.name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Kategoria:</Text>
        <Text style={styles.value}>{assetDetails.category?.name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Model:</Text>
        <Text style={styles.value}>{assetDetails.model?.name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Numer modelu:</Text>
        <Text style={styles.value}>{assetDetails.model_number ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Opis:</Text>
        <Text style={styles.value}>{assetDetails.notes ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>MAC:</Text>
        <Text style={styles.value}>{assetDetails.mac_address ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Utworzono:</Text>
        <Text style={styles.value}>{assetDetails.created_at?.formatted ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Zaktualizowano:</Text>
        <Text style={styles.value}>{assetDetails.updated_at?.formatted ?? "-"}</Text>
      </View>

      <View style={{ marginTop: 32}}>
        <Text style={styles.sectionTitle}>Zdjęcie aktywa</Text>
      </View>

      <View style={{ alignItems: "center", marginTop: 24 }}>
        {assetDetails.image ? (
          <Image
            source={{ uri: assetDetails.image }}
            style={styles.assetImage}
          />
        ) : (
          <Text style={{ color: "#888" }}>Brak zdjęcia</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row", marginBottom: 8 },
  label: { fontWeight: "600", width: 140 },
  value: { flex: 1, flexWrap: "wrap" },
  assetImage: {
    width: 360,
    height: 720,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
    sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});
