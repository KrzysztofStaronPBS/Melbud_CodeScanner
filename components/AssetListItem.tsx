import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Asset } from "../lib/types";
import AssetItem from "./AssetItem";
interface Props {
  asset: Asset;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AssetListItem({
  asset,
  backgroundColor,
  textColor,
  borderColor,
  onPress,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View
      style={[
        styles.itemRow,
        { backgroundColor, borderColor },
      ]}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <AssetItem asset={asset} backgroundColor={backgroundColor} textColor={textColor} />
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.edit]} onPress={onEdit}>
          <Text style={styles.btnText}>Edytuj</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.delete]} onPress={onDelete}>
          <Text style={styles.btnText}>Usuń</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
