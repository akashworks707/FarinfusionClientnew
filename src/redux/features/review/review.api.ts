import { IReview } from "@/types/types.review";
import { baseApi } from "../baseApi";
import { IResponse, GetQueryParams } from "@/types";

interface IReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
}

interface GetReviewsResponse {
  success: boolean;
  data: IReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<IResponse<IReview>, Partial<IReview>>({
      query: (data) => ({
        url: "/review",
        method: "POST",
        data,
      }),
      invalidatesTags: ["REVIEWS"],
    }),

    getAllReviews: builder.query<GetReviewsResponse, GetQueryParams>({
      query: (params) => ({
        url: "/review",
        method: "GET",
        params,
      }),
      providesTags: ["REVIEWS"],
    }),

    getSingleReview: builder.query<IResponse<IReview>, string>({
      query: (id) => ({
        url: `/review/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "REVIEW", id }],
    }),

    getProductReviews: builder.query<IResponse<IReview[]>, string>({
      query: (productId) => ({
        url: `/review/product/${productId}`,
        method: "GET",
      }),
      providesTags: ["REVIEWS"],
    }),

    getReviewStats: builder.query<IResponse<IReviewStats>, void>({
      query: () => ({
        url: "/review/stats",
        method: "GET",
      }),
      providesTags: ["REVIEWS"],
    }),
    updateReview: builder.mutation<
      IResponse<IReview>,
      {
        id: string;
        data: Partial<IReview>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/review/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "REVIEWS",
        { type: "REVIEW", id },
      ],
    }),

    approveReview: builder.mutation<IResponse<IReview>, string>({
      query: (id) => ({
        url: `/review/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "REVIEWS",
        { type: "REVIEW", id },
      ],
    }),

    rejectReview: builder.mutation<IResponse<IReview>, string>({
      query: (id) => ({
        url: `/review/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "REVIEWS",
        { type: "REVIEW", id },
      ],
    }),

    deleteReview: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "REVIEWS",
        { type: "REVIEW", id },
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useGetSingleReviewQuery,
  useGetProductReviewsQuery,
  useGetReviewStatsQuery,
  useUpdateReviewMutation,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
