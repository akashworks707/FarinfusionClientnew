/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResponse } from "@/types";
import { baseApi } from "../baseApi";
import { GetAllReturnsResponse, ReturnParcel } from "@/types/return";

export const returnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReturn: builder.mutation<ReturnParcel, any>({
      query: (data) => ({
        url: "/returns/create-return",
        method: "POST",
        data,
      }),
      invalidatesTags: ["RETURNS", "PRODUCTS", "ORDERS"],
    }),

    getAllReturns: builder.query<GetAllReturnsResponse, any>({
      query: (params) => ({
        url: "/returns/all-returns",
        method: "GET",
        params,
      }),
      providesTags: ["RETURNS"],
    }),

    getSingleReturn: builder.query<IResponse<ReturnParcel>, string>({
      query: (id) => ({
        url: `/returns/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "RETURN", id }],
    }),

    updateReturnStatus: builder.mutation<
      IResponse<ReturnParcel>,
      {
        id: string;
        data: {
          returnStatus?: string;
          refundStatus?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/returns/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RETURN", id },
        "RETURNS",
        "PRODUCTS",
        "ORDERS",
      ],
    }),

    deleteReturn: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/returns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RETURNS"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateReturnMutation,
  useGetAllReturnsQuery,
  useGetSingleReturnQuery,
  useUpdateReturnStatusMutation,
  useDeleteReturnMutation,
} = returnApi;
