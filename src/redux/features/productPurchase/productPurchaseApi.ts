import { IProductPurchase, IPurchase } from "@/types/purchase";
import { baseApi } from "../baseApi";
import type { IResponse, GetQueryParams, IPaginationMeta } from "@/types";

interface GetAllProductPurchasesResponse {
  success: boolean;
  data: IPurchase[];
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

    getPurchaseStats: builder.query({
  query: () => ({
    url: "/product-purchase/stats/overview",
    method: "GET",
  }),

  providesTags: ["PRODUCT_PURCHASES"],
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
      IResponse<IPurchase>,
      {
        _id: string;
        purchaseStatus?: string;
        paymentStatus?: string;
      }
    >({
      query: ({ _id, ...data }) => ({
        url: `/product-purchase/status/${_id}`,
        method: "PATCH",
        data,
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
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((purchase) => ({
                type: "PRODUCT_PURCHASE" as const,
                id: purchase._id,
              })),
              "PRODUCT_PURCHASES",
            ]
          : ["PRODUCT_PURCHASES"],
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
  useGetPurchaseStatsQuery,
  useUpdatePurchaseStatusMutation,
} = productPurchaseApi;
