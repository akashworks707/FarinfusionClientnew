/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOrderStats {
  PENDING: number;
  CONFIRMED: number;
  COMPLETED: number;
  CANCELLED: number;
  COURIER_ASSIGNED: number;
  NO_RESPONSE: number;
  IN_TRANSIT: number;

}

export interface IStaffEarning {
  _id: string
  sellerId: string;
  sellerName: string;
  email: string;
  phone: number;
  totalOrders: number;
  totalOrderValue: number;
  shippingCost: number;
  totalEarnings: number;
}

export interface IDashboardOverview {
  totalOrders: number;
  totalRevenue: number;
  totalUsers?: number;
  totalProducts?: number;
  totalCost: number;
  totalSalary: number;
  netProfit: number;
  staffEarnings?: IStaffEarning[];
  orderStats: IOrderStats;
  recentOrders: any[];
  role: string;
}