import { DeliveryStatus } from "./orders";

export type CourierProvider = "STEADFAST" | "PATHAO" | "PAPERFLY";
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
  courierName: CourierProvider;
}
