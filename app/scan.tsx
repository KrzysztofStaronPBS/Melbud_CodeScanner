import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const lastScanTime = useRef(0);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      navigation.setOptions({
        title: "Zeskanuj kod QR",
      });
    } catch (_) {}
  }, [navigation]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Brak dostępu do kamery</Text>
        <Button onPress={requestPermission} title="Zezwól" />
      </View>
    );
  }

  const handleScan = async (data: string) => {
    const now = Date.now();
    if (now - lastScanTime.current < 2000) return;
    lastScanTime.current = now;

    const id = data.split("/").pop()?.trim() ?? "";
    if (!id || isNaN(Number(id))) {
      console.warn("Niepoprawny kod QR:", data);
      return;
    }

    router.push(`/asset/${id}`);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(result) => {
          if (!result?.data) return;
          handleScan(result.data);
        }}
      />

      <View style={styles.targetBox}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
