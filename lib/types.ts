export interface StatusLabel {
  name?: string;
}

export interface StatusLabel {
  name?: string;
}

export interface Company {
  name?: string;
}

export interface Manufacturer {
  name?: string;
}

export interface Category {
  name?: string;
}

export interface Model {
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
