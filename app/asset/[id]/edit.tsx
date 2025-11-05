import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAssetById, getCompanies, getLocations, getModels, getStatuses, updateAsset } from "../../../lib/api";
import { AssetDetails } from "../../../lib/types";

export default function EditAssetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [asset, setAsset] = useState<AssetDetails | null>(null);

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [mac, setMac] = useState("");
  const [company, setCompany] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("");

  const [companies, setCompanies] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);


  useEffect(() => {
    async function load() {
      try {
        const data = await getAssetById(Number(id));
        setAsset(data);

        setName(data.name ?? "");
        setTag(data.asset_tag ?? "");
        setModelNumber(data.model_number ?? "");
        setNotes(data.notes ?? "");
        setMac(data.mac_address ?? "");

        setCompany(data.company?.name ?? "");
        setManufacturer(data.manufacturer?.name ?? "");
        setCategory(data.category?.name ?? "");
        setModel(data.model?.name ?? "");
        setStatus(data.status_label?.name ?? "");

        setCompanyId(data.company?.id ?? null);
        setModelId(data.model?.id ?? null);
        setStatusId(data.status_label?.id ?? null);

      } catch (err: any) {
        Alert.alert("Błąd", "Nie udało się pobrać danych sprzętu");
      }
    }

    async function loadOptions() {
      try {
        const [c, m, s, l] = await Promise.all([
          getCompanies(),
          getModels(),
          getStatuses(),
          getLocations(),
        ]);
        setCompanies(c);
        setModels(m);
        setStatuses(s);
        setLocations(l);
      } catch (err) {
        console.error("Błąd pobierania opcji", err);
      }
    }
    loadOptions();
    if (id) load();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateAsset(Number(id), {
        name,
        asset_tag: tag,
        model_number: modelNumber,
        notes,
        mac_address: mac,
        company_id: companyId,
        model_id: modelId,
        status_id: statusId,
      });
      Alert.alert("Sukces", "Sprzęt został zaktualizowany", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Błąd", "Nie udało się zapisać zmian");
    }
  };

  if (!asset) return <Text>Ładowanie...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>Nazwa</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Tag</Text>
        <TextInput style={styles.input} value={tag} onChangeText={setTag} />

        <Text style={styles.label}>Numer modelu</Text>
        <TextInput style={styles.input} value={modelNumber} onChangeText={setModelNumber} />

        <Text style={styles.label}>Opis</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={notes} onChangeText={setNotes} multiline />

        <Text style={styles.label}>MAC</Text>
        <TextInput style={styles.input} value={mac} onChangeText={setMac} />

        <Text style={styles.label}>Firma</Text>
        <Picker selectedValue={companyId} onValueChange={(val) => setCompanyId(val)}>
          {companies.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Producent</Text>
        <TextInput style={styles.input} value={manufacturer} onChangeText={setManufacturer} />

        <Text style={styles.label}>Kategoria</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} />

        <Text style={styles.label}>Model</Text>
        <Picker selectedValue={modelId} onValueChange={(val) => setModelId(val)}>
          {models.map((m) => (
            <Picker.Item key={m.id} label={m.name} value={m.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Status</Text>
        <Picker selectedValue={statusId} onValueChange={(val) => setStatusId(val)}>
          {statuses.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Zapisz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  label: { fontWeight: "600", marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: "#2196f3",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
