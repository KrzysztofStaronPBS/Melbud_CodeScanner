import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/theme-store";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AssetForm from "../../components/AssetForm";
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

      Toast.show({
        type: "success",
        text1: "Sukces",
        text2: "Dodano nowy sprzęt!",
        position: "top",
        visibilityTime: 3000,
        text1Style: { fontSize: 20, fontWeight: "700" },
        text2Style: { fontSize: 16 },
      });
      router.replace("/(tabs)"); 
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Błąd",
        text2: "Nie udało się dodać nowego sprzętu.",
        position: "top",
        visibilityTime: 3000,
        text1Style: { fontSize: 20, fontWeight: "700" },
        text2Style: { fontSize: 16 },
      });
      console.error(err);
    }
  };

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
      submitLabel="Dodaj sprzęt"
      submitColor="#4CAF50"
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
