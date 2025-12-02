import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getAssetById } from "../../lib/api";
import { AssetDetails } from "../../lib/types";


export default function AssetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [assetDetails, setAsset] = useState<AssetDetails | null>(null);
  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  useEffect(() => {
    async function load() {
      try {
        const data = await getAssetById(Number(id));
        setAsset(data);
        navigation.setOptions({
          title: data.name || data.asset_tag || "Szczegóły",
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
        <Text style={{ color: C.text }}>Ładowanie danych...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.background }]}>
      {[
        ["Status", assetDetails.status_label?.name],
        ["Firma", assetDetails.company?.name],
        ["Nazwa nabytku", assetDetails.name],
        ["Producent", assetDetails.manufacturer?.name],
        ["Kategoria", assetDetails.category?.name],
        ["Model", assetDetails.model?.name],
        ["Numer modelu", assetDetails.model_number],
        ["Opis", assetDetails.notes],
        ["MAC", assetDetails.mac_address],
        ["Utworzono", assetDetails.created_at?.formatted],
        ["Zaktualizowano", assetDetails.updated_at?.formatted],
      ].map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={[styles.label, { color: C.text }]}>{label}:</Text>
          <Text style={[styles.value, { color: C.text }]}>{value ?? "-"}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row", marginBottom: 8 },
  label: { fontWeight: "600", width: 140 },
  value: { flex: 1, flexWrap: "wrap" },
});
