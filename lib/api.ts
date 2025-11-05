import axios from "axios";
import { AssetDetails, AssetResponse, AssetUpdatePayload } from "./types";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`,
    Accept: "application/json",
  },
});

export async function getAssets(): Promise<AssetResponse> {
  const res = await api.get<AssetResponse>("hardware");
  return res.data;
}

export async function getAssetById(id: number): Promise<AssetDetails> {
  const res = await api.get<AssetDetails>(`/hardware/${id}`);
  return res.data;
}

export async function updateAsset(id: number, payload: AssetUpdatePayload) {
  const res = await api.put<AssetDetails>(`/hardware/${id}`, payload);
  return res.data;
}

export async function deleteAsset(id: number) {
  const res = await api.delete(`/hardware/${id}`);
  return res.data;
}

export async function getCompanies() {
  const res = await api.get("/companies");
  return res.data.rows;
}

export async function getModels() {
  const res = await api.get("/models");
  return res.data.rows;
}

export async function getStatuses() {
  const res = await api.get("/statuslabels");
  return res.data.rows;
}

export async function getLocations() {
  const res = await api.get("/locations");
  return res.data.rows;
}

