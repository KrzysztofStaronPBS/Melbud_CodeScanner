import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import Toast from "react-native-toast-message";
import AssetForm from "../../../components/AssetForm";
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
  const [locationId, setLocationId] = useState<number | null>(null);

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

      Toast.show({
        type: "success",
        text1: "Sukces",
        text2: "Sprzęt został zmodyfikowany!",
        position: "top",
        visibilityTime: 3000,
        text1Style: { fontSize: 20, fontWeight: "700" },
        text2Style: { fontSize: 16 },
      });

    router.replace("/(tabs)"); 
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Błąd",
        text2: "Nie udało się zapisać zmian",
        position: "top",
        visibilityTime: 3000,
        text1Style: { fontSize: 20, fontWeight: "700" },
        text2Style: { fontSize: 16 },
      });
    }
  };

  if (!asset) return <Text style={{ color: C.text }}>Ładowanie...</Text>;

  return (
    <AssetForm
      C={C}
      name={name} setName={setName}
      tag={tag} setTag={setTag}
      modelNumber={modelNumber} setModelNumber={setModelNumber}
      notes={notes} setNotes={setNotes}
      mac={mac} setMac={setMac}
      companyId={companyId} setCompanyId={setCompanyId} companies={companies}
      modelId={modelId} setModelId={setModelId} models={models}
      statusId={statusId} setStatusId={setStatusId} statuses={statuses}
      locationId={locationId} setLocationId={setLocationId} locations={locations}
      onSubmit={handleSave}
      submitLabel="Zapisz"
      submitColor={theme === "dark" ? "#1e88e5" : "#2196f3"}
    />
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
