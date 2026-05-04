/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResponse } from "@/types";
import { baseApi } from "../baseApi";
import type {
  Order,
  OrderResponse,
  UpdateOrderRequest,
  GetQueryParams,
} from "@/types/orders";

interface GetAllOrdersResponse {
  success: boolean;
  data: Order[];
  totalCount: number;
  stats: {
    total: number;
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, any>({
      query: (data) => ({
        url: "/order",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ORDERS", "POSSTATS"],
    }),

    getAllOrders: builder.query<GetAllOrdersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/order",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),

    getAllScheduledOrders: builder.query<GetAllOrdersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/order/scheduled-orders",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),

    getAllholdOrders: builder.query<GetAllOrdersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/order/hold-orders",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),

    getSingleOrder: builder.query<OrderResponse, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ORDER", id }],
    }),

    updateOrder: builder.mutation<
      OrderResponse,
      { _id: string; data: UpdateOrderRequest }
    >({
      query: ({ _id, data }) => ({
        url: `/order/${_id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "ORDER", id: _id },
        "ORDERS",
      ],
    }),

    updateSeller: builder.mutation<
      OrderResponse,
      { _id: string; data: UpdateOrderRequest }
    >({
      query: ({ _id, data }) => ({
        url: `/order/${_id}/assign-seller`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "ORDER", id: _id },
        "ORDERS",
      ],
    }),

    confirmOrder: builder.mutation<
      OrderResponse,
      { _id: string; orderStatus: string }
    >({
      query: ({ _id }) => ({
        url: `/order/${_id}/confirm-status`,
        method: "PATCH",
        data: {
          orderStatus: "CONFIRMED",
        },
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "ORDER", id: _id },
        "ORDERS",
      ],
    }),

    completeOrder: builder.mutation<
      OrderResponse,
      { _id: string; orderStatus: string }
    >({
      query: ({ _id }) => ({
        url: `/order/${_id}/status`,
        method: "PATCH",
        data: {
          orderStatus: "COMPLETED",
        },
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "ORDER", id: _id },
        "ORDERS",
        "COURIERS",
      ],
    }),

    deleteOrder: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    updateDeliveryStatus: builder.mutation<
      OrderResponse,
      {
        _id: string;
        deliveryStatus: "NOT_SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";
      }
    >({
      query: ({ _id, deliveryStatus }) => ({
        url: `/order/${_id}`,
        method: "PATCH",
        body: { deliveryStatus },
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "ORDER", id: _id },
        "ORDERS",
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useConfirmOrderMutation,
  useGetAllScheduledOrdersQuery,
  useUpdateDeliveryStatusMutation,
  useUpdateSellerMutation,
  useCompleteOrderMutation,

  useGetAllholdOrdersQuery,
} = ordersApi;
