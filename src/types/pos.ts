import { IProduct } from ".";

export type OrderType = 'PICKUP' | 'DELIVERY';

export interface POSCartItem {
  product: IProduct;
  quantity: number;
  selectedExtras?: string[];
}

export interface POSOrder {
  _id?: string;
  orderID: string;
  items: POSCartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerZipCode?: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePOSOrderPayload {
  items: POSCartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerZipCode?: string;
  notes?: string;
}

export interface POSStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  todayOrders: number;
}
