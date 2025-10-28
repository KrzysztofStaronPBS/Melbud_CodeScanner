// types.ts
export interface StatusLabel {
  name?: string;
}

export interface Asset {
  id: number;
  name?: string;
  asset_tag?: string;
  status_label?: StatusLabel;
}

export interface AssetResponse {
  total: number;
  rows: Asset[];
}
