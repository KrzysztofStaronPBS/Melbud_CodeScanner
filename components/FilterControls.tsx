import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  selectedCategory: string | null;
  selectedModel: string | null;
  selectedStatus: string | null;
  onClearCategory: () => void;
  onClearModel: () => void;
  onClearStatus: () => void;
  onOpenModal: () => void;
}

export default function FilterControls({
  selectedCategory,
  selectedModel,
  selectedStatus,
  onClearCategory,
  onClearModel,
  onClearStatus,
  onOpenModal,
}: Props) {
  return (
    <>
      <TouchableOpacity style={styles.filterButton} onPress={onOpenModal}>
        <Text style={styles.filterButtonText}>Filtruj</Text>
      </TouchableOpacity>

      <View style={styles.activeFilters}>
        {selectedCategory && (
          <TouchableOpacity style={[styles.chip, styles.categoryChip]} onPress={onClearCategory}>
            <Text style={styles.chipText}>Kategoria: {selectedCategory} ✕</Text>
          </TouchableOpacity>
        )}
        {selectedModel && (
          <TouchableOpacity style={[styles.chip, styles.modelChip]} onPress={onClearModel}>
            <Text style={styles.chipText}>Model: {selectedModel} ✕</Text>
          </TouchableOpacity>
        )}
        {selectedStatus && (
          <TouchableOpacity style={[styles.chip, styles.statusChip]} onPress={onClearStatus}>
            <Text style={styles.chipText}>Status: {selectedStatus} ✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    marginHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2196f3",
    borderRadius: 6,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
  },
    chipText: {
    color: "#fff",
    fontWeight: "600",
  },
  categoryChip: {
    backgroundColor: "#4CAF50",
  },
  modelChip: {
    backgroundColor: "#FF9800",
  },
  statusChip: {
    backgroundColor: "#9C27B0",
  },
});
