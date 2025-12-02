import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AssetDetails, AssetResponse, AssetUpdatePayload } from "./types";

export const api = axios.create({
  headers: {
    Accept: "application/json",
  },
});

async function authorizedRequest<T>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: any
): Promise<T> {
  const token = await AsyncStorage.getItem("apiToken");
  const serverUrl = await AsyncStorage.getItem("serverUrl");

  if (!token || !serverUrl) {
    throw new Error("Brak konfiguracji API");
  }

  const res = await axios.request<T>({
    method,
    url: `${serverUrl}${endpoint}`,
    data,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getAssets(): Promise<AssetResponse> {
  return authorizedRequest<AssetResponse>("get", "/hardware");
}

export async function getAssetById(id: number): Promise<AssetDetails> {
  return authorizedRequest<AssetDetails>("get", `/hardware/${id}`);
}

export async function updateAsset(id: number, payload: AssetUpdatePayload) {
  return authorizedRequest<AssetDetails>("put", `/hardware/${id}`, payload);
}

export async function deleteAsset(id: number) {
  return authorizedRequest("delete", `/hardware/${id}`);
}

export async function getCompanies() {
  return authorizedRequest<{ rows: any[] }>("get", "/companies").then(r => r.rows);
}

export async function getModels() {
  return authorizedRequest<{ rows: any[] }>("get", "/models").then(r => r.rows);
}

export async function getStatuses() {
  return authorizedRequest<{ rows: any[] }>("get", "/statuslabels").then(r => r.rows);
}

export async function getLocations() {
  return authorizedRequest<{ rows: any[] }>("get", "/locations").then(r => r.rows);
}

export async function createAsset(payload: any) {
  return authorizedRequest("post", "/hardware", payload);
}