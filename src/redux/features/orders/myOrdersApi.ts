import { baseApi } from "../baseApi";
import type { Order } from "@/types/orders";

export interface MyOrdersResponse {
  success: boolean;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface MyOrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  sort?: string;
}

export const myOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<MyOrdersResponse, MyOrdersQueryParams>({
      query: (params) => ({
        url: "/order/my-orders",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),
    getMyScheduledOrders: builder.query<MyOrdersResponse, MyOrdersQueryParams>({
      query: (params) => ({
        url: "/order/my-scheduled-orders",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMyOrdersQuery, useGetMyScheduledOrdersQuery } =
  myOrdersApi;
