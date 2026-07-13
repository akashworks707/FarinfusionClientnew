export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_brand?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
}

export interface EcommercePayload {
  currency: string;
  value: number;
  items: AnalyticsItem[];
}