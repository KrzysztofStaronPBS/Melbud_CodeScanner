// components/AssetItem.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Asset } from "../lib/types";

export default function AssetItem({ asset }: { asset: Asset }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{asset.name || "Brak nazwy"}</Text>
      <Text style={styles.tag}>Tag: {asset.asset_tag || "brak"}</Text>
      <Text style={styles.status}>
        Status: {asset.status_label?.name || "nieznany"}
      </Text>
    </View>
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
  tag: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 14,
    color: "#00897B",
    marginTop: 2,
  },
});
