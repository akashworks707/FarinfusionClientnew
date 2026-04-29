import { baseApi } from "../baseApi";

export type DiscountType = "PERCENT" | "FIXED";

export interface ICoupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
}

export interface UpdateCouponPayload extends CreateCouponPayload {
  isActive?: boolean;
}

export interface ApplyCouponPayload {
  code: string;
  total: number;
}

export interface ApplyCouponResponse {
  discount: number;
  finalTotal: number;
  couponId: string;
}

export interface GetCouponsResponse {
  success: boolean;
  message: string;
  data: ICoupon[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface GetCouponsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  isActive?: boolean;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCoupon: builder.mutation<
      { success: boolean; data: ICoupon },
      CreateCouponPayload
    >({
      query: (body) => ({
        url: "/coupon/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["COUPONS"],
    }),

    updateCoupon: builder.mutation<
      { success: boolean; data: ICoupon },
      { id: string } & UpdateCouponPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/coupon/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["COUPONS"],
    }),

    deleteCoupon: builder.mutation<
      { success: boolean; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COUPONS"],
    }),

    applyCoupon: builder.mutation<
      { success: boolean; data: ApplyCouponResponse },
      ApplyCouponPayload
    >({
      query: (body) => ({
        url: "/coupon/apply",
        method: "POST",
        data: body,
      }),
    }),

    getAllCoupons: builder.query<GetCouponsResponse, GetCouponsQueryParams>({
      query: (params) => ({
        url: "/coupon",
        method: "GET",
        params,
      }),
      providesTags: ["COUPONS"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
  useGetAllCouponsQuery,
} = couponApi;