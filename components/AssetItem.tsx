import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Asset } from "../lib/types";

type AssetItemProps = {
  asset: Asset;
  backgroundColor?: string;
  textColor?: string;
};

export default function AssetItem({ asset, backgroundColor, textColor }: AssetItemProps) {
  const router = useRouter();
  const statusName = asset.status_label?.name || "nieznany";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "zlikwidowane":
        return "#D32F2F";
      case "wydany":
        return "#388E3C";
      case "gotowy do wydania":
        return "#F9A825";
      case "do przygotowania":
        return "#1976D2";
      case "rezerwa":
        return "#7B1FA2";
      default:
        return "#757575";
    }
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/asset/${asset.id}`)}>
      <View style={[styles.card, { backgroundColor: backgroundColor ?? "#fff" }]}>
        <Text style={[styles.name, { color: textColor ?? "#212121" }]}>
          {asset.category?.name ?? "Brak kategorii"} {asset.name || "Brak nazwy"}
        </Text>

        <Text style={[styles.status, { color: textColor ?? "#333" }]}>
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
  },
  status: {
    fontSize: 14,
  },
  statusValue: {
    fontWeight: "bold",
  },
});
