import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteAssetImage, getAssetById, getCompanies, getLocations, getModels, getStatuses, updateAsset, uploadAssetImage } from "../../../lib/api";
import { AssetDetails } from "../../../lib/types";

import * as ImagePicker from "expo-image-picker";

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

  const navigation = useNavigation();

  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Brak uprawnień", "Aplikacja potrzebuje dostępu do galerii.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    try {
      setUploading(true);
      if (!asset) return;
      await uploadAssetImage(Number(asset.id), uri);
      const updated = await getAssetById(Number(asset.id));
      setAsset(updated);
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się wgrać zdjęcia.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    Alert.alert("Usuń zdjęcie", "Czy na pewno chcesz usunąć zdjęcie?", [
      { text: "Anuluj" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          try {
            setUploading(true);
            if (!asset) return;
            await deleteAssetImage(Number(asset.id));
            const updated = await getAssetById(Number(asset.id));
            setAsset(updated);
          } catch (err) {
            Alert.alert("Błąd", "Nie udało się usunąć zdjęcia.");
          } finally {
            setUploading(false);
          }
        },
      },
    ]);
  };

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

        navigation.setOptions({
          title: `Edytuj ${data.name ?? data.asset_tag ?? "sprzęt"}`,
        });
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

        <Text style={[styles.label, { marginTop: 16 }]}>Zdjęcie assetu</Text> 
        <View style={{ marginVertical: 16, alignItems: "center" }}>
          {asset?.image ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: asset.image }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
              />
              <TouchableOpacity style={styles.deleteBtn} onPress={removeImage}>
                <Text style={{ color: "#fff" }}>Usuń zdjęcie</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ marginBottom: 8 }}>Brak zdjęcia</Text>
          )}

          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Text style={{ color: "#fff" }}>
              {uploading ? "Wgrywanie..." : "Wgraj zdjęcie"}
            </Text>
          </TouchableOpacity>

          {uploading && <ActivityIndicator style={{ marginTop: 8 }} size="large" color="#007bff" />}
        </View>

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
  deleteBtn: {
  backgroundColor: "#dc3545",
  padding: 8,
  borderRadius: 6,
  marginTop: 6,
  alignItems: "center",
  },
  uploadBtn: {
  backgroundColor: "#007bff",
  padding: 12,
  borderRadius: 6,
  alignItems: "center",
  marginTop: 8,
  },
});
