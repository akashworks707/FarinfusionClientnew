export enum CourierProvider {
  STEADFAST = "STEADFAST",
  PAPERFLY = "PAPERFLY",
  PATHAO = "PATHAO",
  REDX = "REDX",
  ECOURIER = "ECOURIER",
  SUNDARBAN = "SUNDARBAN",
  CUSTOM = "CUSTOM",
}

export interface PickupInfo {
  name?: string;
  phone?: string;
  address?: string;
  area?: string;
  city?: string;
}

export interface CourierSettings {
  _id: string;
  provider: CourierProvider;
  displayName: string;
  config: Record<string, string>;
  pickupInfo?: PickupInfo;
  webhookUrl?: string;
  notes?: string;
  isActive: boolean;
  isSandbox: boolean;
  isDeleted: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourierSettingsResponse {
  success: boolean;
  message: string;
  data: CourierSettings;
}

export interface GetAllCourierSettingsResponse {
  success: boolean;
  message: string;
  data: CourierSettings[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
