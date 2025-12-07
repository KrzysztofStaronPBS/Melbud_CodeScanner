import { Picker } from "@react-native-picker/picker";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AssetForm({
  C,
  name, setName,
  tag, setTag,
  modelNumber, setModelNumber,
  notes, setNotes,
  mac, setMac,
  companyId, setCompanyId, companies,
  modelId, setModelId, models,
  statusId, setStatusId, statuses,
  locationId, setLocationId, locations,
  onSubmit,
  submitLabel,
  submitColor
}: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.label, { color: C.text }]}>Nazwa</Text>
        <TextInput style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]} value={name} onChangeText={setName} />

        <Text style={[styles.label, { color: C.text }]}>Tag</Text>
        <TextInput style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]} value={tag} onChangeText={setTag} />

        <Text style={[styles.label, { color: C.text }]}>Numer modelu</Text>
        <TextInput style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]} value={modelNumber} onChangeText={setModelNumber} />

        <Text style={[styles.label, { color: C.text }]}>Opis</Text>
        <TextInput style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50", height: 80 }]} value={notes} onChangeText={setNotes} multiline />

        <Text style={[styles.label, { color: C.text }]}>MAC</Text>
        <TextInput style={[styles.input, { backgroundColor: C.background, color: C.text, borderColor: C.icon + "50" }]} value={mac} onChangeText={setMac} />

        <Text style={[styles.label, { color: C.text }]}>Firma</Text>
        <Picker selectedValue={companyId} onValueChange={setCompanyId} style={{ color: C.text, backgroundColor: C.background }}>
          <Picker.Item label="-- wybierz firmę --" value={null} />
          {companies.map((c: any) => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
        </Picker>

        <Text style={[styles.label, { color: C.text }]}>Model</Text>
        <Picker selectedValue={modelId} onValueChange={setModelId} style={{ color: C.text, backgroundColor: C.background }}>
          <Picker.Item label="-- wybierz model --" value={null} />
          {models.map((m: any) => <Picker.Item key={m.id} label={m.name} value={m.id} />)}
        </Picker>

        <Text style={[styles.label, { color: C.text }]}>Status</Text>
        <Picker selectedValue={statusId} onValueChange={setStatusId} style={{ color: C.text, backgroundColor: C.background }}>
          <Picker.Item label="-- wybierz status --" value={null} />
          {statuses.map((s: any) => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
        </Picker>

        <Text style={[styles.label, { color: C.text }]}>Lokalizacja</Text>
        <Picker selectedValue={locationId} onValueChange={setLocationId} style={{ color: C.text, backgroundColor: C.background }}>
          <Picker.Item label="-- wybierz lokalizację --" value={null} />
          {locations.map((l: any) => <Picker.Item key={l.id} label={l.name} value={l.id} />)}
        </Picker>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: submitColor }]} onPress={onSubmit}>
          <Text style={styles.saveText}>{submitLabel}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "600", marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 6, padding: 10, marginTop: 4 },
  saveBtn: { marginTop: 24, padding: 12, borderRadius: 6, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
});
