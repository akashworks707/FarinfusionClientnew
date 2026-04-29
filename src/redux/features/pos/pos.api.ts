import { GetQueryParams } from "@/types";
import { baseApi } from "../baseApi";
import type { POSOrder, CreatePOSOrderPayload, POSStats } from '@/types/pos';

export const posApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPOSOrder: build.mutation<POSOrder, CreatePOSOrderPayload>({
      query: (data) => ({
        url: '/pos/orders',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['ORDERS', 'POSSTATS'],
    }),

    getAllPOSOrders: build.query<
      { data: POSOrder[]; meta: { total: number; page: number; limit: number } },
      GetQueryParams
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        return {
          url: `/pos/orders?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['ORDERS'],
    }),

    getSinglePOSOrder: build.query<POSOrder, string>({
      query: (orderId) => ({
        url: `/pos/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['ORDERS'],
    }),

    updatePOSOrderStatus: build.mutation<
      POSOrder,
      { orderId: string; status: POSOrder['status'] }
    >({
      query: ({ orderId, status }) => ({
        url: `/pos/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['ORDERS', 'POSSTATS'],
    }),

    cancelPOSOrder: build.mutation<POSOrder, string>({
      query: (orderId) => ({
        url: `/pos/orders/${orderId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['ORDERS', 'POSSTATS'],
    }),

    getPOSStats: build.query<POSStats, void>({
      query: () => ({
        url: '/pos/stats',
        method: 'GET',
      }),
      providesTags: ['POSSTATS'],
    }),

    getTodayPOSOrders: build.query<
      { data: POSOrder[]; meta: { total: number } },
      void
    >({
      query: () => ({
        url: '/pos/orders/today',
        method: 'GET',
      }),
      providesTags: ['ORDERS'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePOSOrderMutation,
  useGetAllPOSOrdersQuery,
  useGetSinglePOSOrderQuery,
  useUpdatePOSOrderStatusMutation,
  useCancelPOSOrderMutation,
  useGetPOSStatsQuery,
  useGetTodayPOSOrdersQuery,
} = posApi;
