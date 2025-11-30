import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAssetById, getCompanies, getLocations, getModels, getStatuses, updateAsset } from "../../../lib/api";
import { AssetDetails } from "../../../lib/types";

export default function EditAssetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [mac, setMac] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

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
  }, [id, navigation]);

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

  if (!asset) return <Text style={{ color: C.text }}>Ładowanie...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.label, { color: C.text }]}>Nazwa</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: C.text }]}>Tag</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={tag}
          onChangeText={setTag}
        />

        <Text style={[styles.label, { color: C.text }]}>Numer modelu</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={modelNumber}
          onChangeText={setModelNumber}
        />

        <Text style={[styles.label, { color: C.text }]}>Opis</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50", height: 80 }]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Text style={[styles.label, { color: C.text }]}>MAC</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={mac}
          onChangeText={setMac}
        />

        <Text style={[styles.label, { color: C.text }]}>Firma</Text>
        <Picker
          selectedValue={companyId}
          onValueChange={(val) => setCompanyId(val)}
          style={{ color: C.text }}
        >
          {companies.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>

        <Text style={[styles.label, { color: C.text }]}>Model</Text>
        <Picker
          selectedValue={modelId}
          onValueChange={(val) => setModelId(val)}
          style={{ color: C.text }}
        >
          {models.map((m) => (
            <Picker.Item key={m.id} label={m.name} value={m.id} />
          ))}
        </Picker>

        <Text style={[styles.label, { color: C.text }]}>Status</Text>
        <Picker
          selectedValue={statusId}
          onValueChange={(val) => setStatusId(val)}
          style={{ color: C.text }}
        >
          {statuses.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme === "dark" ? "#1e88e5" : "#2196f3" }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Zapisz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "600", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  saveBtn: {
    marginTop: 24,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
