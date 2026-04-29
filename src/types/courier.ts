import { DeliveryStatus } from "./orders";

export type CourierProvider = 'STEADFAST' | 'OTHER';
export interface Courier {
  id: string;
  orderID: string;
  courierName: CourierProvider;
  trackingCode: string;
  consignmentId: string;
  status: string;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourierRequest {
  orderId: string;
}