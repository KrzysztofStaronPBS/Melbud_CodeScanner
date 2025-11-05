export interface StatusLabel {
  name?: string;
}

export interface StatusLabel {
  id?: number;
  name?: string;
}

export interface Company {
  id?: number;
  name?: string;
}

export interface Manufacturer {
  id?: number;
  name?: string;
}

export interface Category {
  id?: number;
  name?: string;
}

export interface Model {
  id?: number;
  name?: string;
}

export interface DateField {
  datetime?: string;
  formatted?: string;
}

export interface Asset {
  id: number;
  name?: string;
  category?: Category;
  asset_tag?: string;
  status_label?: StatusLabel;
}

export interface AssetDetails extends Asset {
  company?: Company;
  manufacturer?: Manufacturer;
  model?: Model;
  model_number?: string;
  notes?: string;
  mac_address?: string;
  created_at?: DateField;
  updated_at?: DateField;
}

export interface AssetResponse {
  total: number;
  rows: Asset[];
}

export type AssetUpdatePayload = {
  name?: string;
  asset_tag?: string;
  model_number?: string;
  notes?: string;
  mac_address?: string;
  company_id?: number | null;
  model_id?: number | null;
  status_id?: number | null;
  location_id?: number | null;
};