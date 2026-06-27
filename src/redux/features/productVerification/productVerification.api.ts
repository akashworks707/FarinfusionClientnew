import { IResponse } from "@/types";
import { baseApi } from "../baseApi";

export const productVerificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    createProductVerification: builder.mutation({
      query: (data) => ({
        url: "/product-verifications",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ProductVerification"],
    }),

    // Get All
    getAllProductVerifications: builder.query({
      query: (params) => ({
        url: "/product-verifications",
        method: "GET",
        params,
      }),
      providesTags: ["ProductVerification"],
    }),

    // Get Single (id or slug)
    getSingleProductVerification: builder.query({
      query: (idOrSlug: string) => ({
        url: `/product-verifications/${idOrSlug}`,
        method: "GET",
      }),
      providesTags: ["ProductVerification"],
    }),

    // Update
    updateProductVerification: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-verifications/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["ProductVerification"],
    }),

    increaseVerificationView: builder.mutation<
      IResponse<{ views: number }>,
      string
    >({
      query: (id) => ({
        url: `/product-verifications/${id}/view`,
        method: "PATCH",
      }),

      invalidatesTags: ["ProductVerification"],
    }),

    // Delete
    deleteProductVerification: builder.mutation({
      query: (id: string) => ({
        url: `/product-verifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductVerification"],
    }),
  }),
});

export const {
  useCreateProductVerificationMutation,
  useGetAllProductVerificationsQuery,
  useGetSingleProductVerificationQuery,
  useUpdateProductVerificationMutation,
  useDeleteProductVerificationMutation,
  useIncreaseVerificationViewMutation,
} = productVerificationApi;
