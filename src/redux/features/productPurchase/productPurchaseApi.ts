import { IProductPurchase, Purchase } from "@/types/purchase";
import { baseApi } from "../baseApi";
import type { IResponse, GetQueryParams, IPaginationMeta } from "@/types";

interface GetAllProductPurchasesResponse {
  success: boolean;
  data: Purchase[];
  meta: IPaginationMeta;
}

export const productPurchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductPurchase: builder.mutation<
      IResponse<IProductPurchase>,
      Partial<IProductPurchase>
    >({
      query: (data) => ({
        url: "/product-purchase/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PRODUCT_PURCHASES", "PRODUCTS"],
    }),

    updateProductPurchase: builder.mutation<
      IResponse<IProductPurchase>,
      {
        _id: string;
        data: Partial<IProductPurchase>;
      }
    >({
      query: ({ _id, data }) => ({
        url: `/product-purchase/${_id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { _id }) => [
        "PRODUCT_PURCHASES",
        "PRODUCTS",
        { type: "PRODUCT_PURCHASE", id: _id },
      ],
    }),

    deleteProductPurchase: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/product-purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "PRODUCT_PURCHASES",
        "PRODUCTS",
        { type: "PRODUCT_PURCHASE", id },
      ],
    }),

    getSingleProductPurchase: builder.query<
      IResponse<IProductPurchase>,
      string
    >({
      query: (id) => ({
        url: `/product-purchase/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PRODUCT_PURCHASE", id }],
    }),

    updatePurchaseStatus: builder.mutation<
      IResponse<IProductPurchase>,
      {
        _id: string;
        purchaseStatus: string;
      }
    >({
      query: ({ _id, purchaseStatus }) => ({
        url: `/product-purchase/status/${_id}`,
        method: "PATCH",
        data: {
          purchaseStatus,
        },
      }),

      invalidatesTags: (result, error, { _id }) => [
        "PRODUCT_PURCHASES",
        "PRODUCTS",
        { type: "PRODUCT_PURCHASE", id: _id },
      ],
    }),

    getAllProductPurchases: builder.query<
      GetAllProductPurchasesResponse,
      GetQueryParams
    >({
      query: (params) => ({
        url: "/product-purchase",
        method: "GET",
        params,
      }),
      providesTags: ["PRODUCT_PURCHASES"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateProductPurchaseMutation,
  useUpdateProductPurchaseMutation,
  useDeleteProductPurchaseMutation,
  useGetSingleProductPurchaseQuery,
  useGetAllProductPurchasesQuery,
  useUpdatePurchaseStatusMutation,
} = productPurchaseApi;
