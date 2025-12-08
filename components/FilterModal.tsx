import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  selectedModel: string | null;
  selectedStatus: string | null;
  setSelectedCategory: (val: string | null) => void;
  setSelectedModel: (val: string | null) => void;
  setSelectedStatus: (val: string | null) => void;
  categories: any[];
  models: any[];
  statuses: any[];
}

export default function FilterModal({
  visible,
  onClose,
  selectedCategory,
  selectedModel,
  selectedStatus,
  setSelectedCategory,
  setSelectedModel,
  setSelectedStatus,
  categories,
  models,
  statuses,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Wybierz filtry</Text>

          <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
            <Picker.Item label="Kategoria" value={null} color="000" />
            {categories.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.name} />
            ))}
          </Picker>

          <Picker selectedValue={selectedModel} onValueChange={setSelectedModel}>
            <Picker.Item label="Model" value={null} color="000" />
            {models.map((m) => (
              <Picker.Item key={m.id} label={m.name} value={m.name} />
            ))}
          </Picker>

          <Picker selectedValue={selectedStatus} onValueChange={setSelectedStatus}>
            <Picker.Item label="Status" value={null} color="000" />
            {statuses.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.name} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
