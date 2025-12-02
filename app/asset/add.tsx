import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createAsset, getCompanies, getLocations, getModels, getStatuses } from "../../lib/api";

export default function AddAssetScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useColorScheme() ?? "light";
  const C = Colors[theme];

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [mac, setMac] = useState("");

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);

  const [companies, setCompanies] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: "Dodaj sprzęt" });

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
        console.error("Błąd pobierania danych", err);
      }
    }

    loadOptions();
  }, [navigation]);

  const handleSave = async () => {
    try {
      await createAsset({
        name,
        asset_tag: tag,
        model_number: modelNumber,
        notes,
        mac_address: mac,
        company_id: companyId,
        model_id: modelId,
        status_id: statusId,
        location_id: locationId,
      });
      Alert.alert("Sukces", "Sprzęt został dodany!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Błąd", "Nie udało się dodać sprzętu.");
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Nazwa */}
        <Text style={[styles.label, { color: C.text }]}>Nazwa</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={name}
          onChangeText={setName}
        />

        {/* Tag */}
        <Text style={[styles.label, { color: C.text }]}>Tag</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={tag}
          onChangeText={setTag}
        />

        {/* Numer modelu */}
        <Text style={[styles.label, { color: C.text }]}>Numer modelu</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={modelNumber}
          onChangeText={setModelNumber}
        />

        {/* Opis */}
        <Text style={[styles.label, { color: C.text }]}>Opis</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50", height: 80 }]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* MAC */}
        <Text style={[styles.label, { color: C.text }]}>MAC</Text>
        <TextInput
          style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]}
          value={mac}
          onChangeText={setMac}
        />

        {/* Firma */}
        <Text style={[styles.label, { color: C.text }]}>Firma</Text>
        <Picker
          selectedValue={companyId}
          onValueChange={(value) => setCompanyId(value)}
          style={{ color: C.text, backgroundColor: C.background }}
        >
          <Picker.Item label="-- wybierz firmę --" value={null} />
          {companies.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>

        {/* Model */}
        <Text style={[styles.label, { color: C.text }]}>Model</Text>
        <Picker
          selectedValue={modelId}
          onValueChange={(value) => setModelId(value)}
          style={{ color: C.text, backgroundColor: C.background }}
        >
          <Picker.Item label="-- wybierz model --" value={null} />
          {models.map((m) => (
            <Picker.Item key={m.id} label={m.name} value={m.id} />
          ))}
        </Picker>

        {/* Status */}
        <Text style={[styles.label, { color: C.text }]}>Status</Text>
        <Picker
          selectedValue={statusId}
          onValueChange={(value) => setStatusId(value)}
          style={{ color: C.text, backgroundColor: C.background }}
        >
          <Picker.Item label="-- wybierz status --" value={null} />
          {statuses.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>

        {/* Lokalizacja */}
        <Text style={[styles.label, { color: C.text }]}>Lokalizacja</Text>
        <Picker
          selectedValue={locationId}
          onValueChange={(value) => setLocationId(value)}
          style={{ color: C.text, backgroundColor: C.background }}
        >
          <Picker.Item label="-- wybierz lokalizację --" value={null} />
          {locations.map((l) => (
            <Picker.Item key={l.id} label={l.name} value={l.id} />
          ))}
        </Picker>

        {/* Zapisz */}
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: "#4CAF50" }]} onPress={handleSave}>
          <Text style={styles.saveText}>Dodaj sprzęt</Text>
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
