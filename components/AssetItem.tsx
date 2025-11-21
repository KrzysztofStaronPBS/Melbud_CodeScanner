import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Asset } from "../lib/types";

export default function AssetItem({ asset }: { asset: Asset }) {
  const router = useRouter();
  const statusName = asset.status_label?.name || "nieznany";

  // 🎨 Funkcja dobierająca kolor tekstu w zależności od statusu
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "zlikwidowane":
        return "#D32F2F"; // czerwony
      case "wydany":
        return "#388E3C"; // zielony
      case "gotowy do wydania":
        return "#F9A825"; // żółto-pomarańczowy
      case "do przygotowania":
        return "#1976D2"; // niebieski
      case "rezerwa":
        return "#7B1FA2"; // fioletowy
      default:
        return "#757575"; // szary (domyślny)
    }
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/asset/${asset.id}`)}>
      <View style={styles.card}>
        <Text style={styles.name}>
          {asset.category?.name ?? "Brak kategorii"} {asset.name || "Brak nazwy"}
        </Text>

        <Text style={styles.status}>
          Status:{" "}
          <Text style={[styles.statusValue, { color: getStatusColor(statusName) }]}>
            {statusName}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 6,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#212121",
  },
  status: {
    fontSize: 14,
    color: "#333",
  },
  statusValue: {
    fontWeight: "bold",
  },
});
