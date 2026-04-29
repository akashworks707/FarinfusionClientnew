import { GetQueryParams } from '@/types/orders';
import { baseApi } from '../baseApi';
import type {
  Courier,
  CreateCourierRequest,
} from '@/types/courier';

interface CourierResponse {
  success: boolean;
  data: Courier;
}

interface GetAllCouriersResponse {
  success: boolean;
  data: Courier[];
  totalCount: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const couriersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourier: builder.mutation<CourierResponse, CreateCourierRequest>({
      query: (data) => ({
        url: '/couriers/create',
        method: 'POST',
        data: {
          orderId: data.orderId,
        },
      }),
      invalidatesTags: ['COURIERS', 'ORDERS'],
    }),

    getAllCouriers: builder.query<GetAllCouriersResponse, GetQueryParams>({
      query: (params) => ({
        url: '/couriers',
        method: 'GET',
        params,
      }),
      providesTags: ['COURIERS'],
    }),

    getSingleCourier: builder.query<CourierResponse, string>({
      query: (id) => ({
        url: `/couriers/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'COURIER', id }],
    }),

    getCourierByOrderId: builder.query<CourierResponse, string>({
      query: (orderId) => ({
        url: `/couriers/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [{ type: 'COURIER', id: orderId }],
    }),

    updateCourierStatus: builder.mutation<
      CourierResponse,
      {
        _id: string;
        status?: string;
        deliveryStatus?: 'NOT_SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
      }
    >({
      query: ({ _id, status, deliveryStatus }) => ({
        url: `/couriers/${_id}`,
        method: 'PATCH',
        body: {
          ...(status && { status }),
          ...(deliveryStatus && { deliveryStatus }),
        },
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'COURIER', id: _id },
        'COURIERS',
        'ORDERS',
      ],
    }),

    deleteCourier: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/couriers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['COURIERS', 'ORDERS'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateCourierMutation,
  useGetAllCouriersQuery,
  useGetSingleCourierQuery,
  useGetCourierByOrderIdQuery,
  useUpdateCourierStatusMutation,
  useDeleteCourierMutation,
} = couriersApi;