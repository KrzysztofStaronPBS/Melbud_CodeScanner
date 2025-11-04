import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../lib/api"; // dostosuj do swojej struktury

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const lastScanTime = useRef(0);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Brak dostępu do kamery</Text>
        <Text style={{ marginTop: 10 }} onPress={requestPermission}>
          👉 Zezwól
        </Text>
      </View>
    );
  }

  const handleScan = async (data: string) => {
    const now = Date.now();
    if (now - lastScanTime.current < 2000) return; // debounce 2s
    lastScanTime.current = now;

    const id = data.split("/").pop()?.trim() ?? "";
    if (!id || isNaN(Number(id))) {
      console.warn("Niepoprawny kod QR:", data);
      return;
    }

    try {
      // sprawdzamy, czy istnieje taki przedmiot
      await api.get(`hardware/${id}`);
      router.push({ pathname: "/asset/[id]", params: { id } });
    } catch (err: any) {
      console.error("Błąd API:", err);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => handleScan(data)}
      />

      {/* 🎯 Celownik */}
      <View style={styles.targetBox}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>

      {/* Tekst pomocniczy */}
      <View style={styles.textOverlay}>
        <Text style={styles.text}>Zeskanuj kod QR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  targetBox: {
    position: "absolute",
    top: "35%",
    left: "50%",
    width: 250,
    height: 250,
    marginLeft: -125,
    borderColor: "#00ff99",
    borderWidth: 1,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 4,
    backgroundColor: "#00ff99",
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 4,
    backgroundColor: "#00ff99",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 30,
    height: 4,
    backgroundColor: "#00ff99",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 4,
    backgroundColor: "#00ff99",
  },
  textOverlay: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 8,
  },
  text: { color: "white", fontSize: 16, textAlign: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
