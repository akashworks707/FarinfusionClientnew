import { CourierProvider } from "./courier";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "DAMAGE";
export type DeliveryStatus =
  | "NOT_SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export type CreateOrderPayload = {
  orderType: "POS" | "ONLINE" | "DELIVERY";
  paymentMethod?: "COD" | "ONLINE";
  note: string;
  total: number;
  couponCode: string;
  discount: number;
  scheduleType?: "INSTANT" | "SCHEDULED";
  scheduledAt?: Date;
  products: {
    product: string;
    quantity: number;
    title: string;
  }[];

  shippingCost?: number;

  billingDetails: {
    fullName?: string;
    email: string;
    phone?: string;
    address?: string;
  };

  seller?: string;
};

export interface Order {
  _id: string;
  customOrderId?: string;
  seller: {
    name?: string;
    role?: string;
    email?: string;
  };
  shippingCost?: number;
  note: string;
  couponCode?: string;
  orderType: "POS" | "ONLINE" | "DELIVERY";
  transactionId?: string;
  scheduleType?: "INSTANT" | "SCHEDULED";
  scheduledAt?: Date;
  paymentMethod?:
    | "COD"
    | "ONLINE"
    | "POS"
    | "BKASH"
    | "ROCKET"
    | "NAGAD"
    | "BANK";
  orderId?: string;
  customerName: string;
  totalAmount?: number;
  subTotal?: number;
  discount?: number;
  customerEmail: string;
  isPublished?: boolean;
  damageNotes?: string;
  billingDetails?: {
    fullName: string;
    email: string;
    address: string;
    phone: string;
  };
  customerPhone: string;
  totalPrice: number;
  products: {
    length: number;
    map: any;
    productId: string;
    product: {
      title: string;
    };
    quantity: number;
    price: number;
  };
  total: number;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  courierName?: CourierProvider;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderRequest {
  orderStatus?: OrderStatus;
  deliveryStatus?: DeliveryStatus;
  seller?: any;
  discount?: number;
  billingDetails?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod?: string;
  shippingCost?: number;
  note?: string;
  courierName?: CourierProvider;
  trackingNumber?: string;
  products?: any[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  totalCount: number;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}
