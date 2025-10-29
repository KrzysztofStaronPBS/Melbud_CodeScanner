import axios from "axios";
import { AssetResponse } from "./types";

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
