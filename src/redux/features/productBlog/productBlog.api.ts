import { IProductBlog } from "@/types/productBlog";
import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface IProductBlogFormData {
  title: string;
  shortDescription: string;
  content: string;
  thumbnail?: string;
  banner?: string;
  category: string;
  contentType: string;
  tags?: string[];
  featured?: boolean;
  status?: "PUBLISHED" | "DRAFT";
}

export interface ProductBlogQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
  contentType?: string;
  featured?: boolean;
  sort?: string;
}

interface ProductBlogListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: { data: IProductBlog[] };
}

interface ProductBlogResponse {
  success: boolean;
  message: string;
  data: IProductBlog;
}

export const productBlogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    createProductBlog: builder.mutation<
      ProductBlogResponse,
      IProductBlogFormData
    >({
      query: (data) => ({
        url: "/product-blog",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PRODUCT_BLOG"],
    }),

    // All
    getAllProductBlogs: builder.query<
      ProductBlogListResponse,
      ProductBlogQueryParams
    >({
      query: (params) => ({
        url: "/product-blog",
        method: "GET",
        params,
      }),
      providesTags: ["PRODUCT_BLOG"],
    }),

    // Single
    getSingleProductBlog: builder.query<ProductBlogResponse, string>({
      query: (idOrSlug) => ({
        url: `/product-blog/${idOrSlug}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PRODUCT_BLOG", id }],
    }),

    // Update
    updateProductBlog: builder.mutation<
      ProductBlogResponse,
      {
        id: string;
        data: Partial<IProductBlogFormData>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/product-blog/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PRODUCT_BLOG"],
    }),

    // Delete
    deleteProductBlog: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/product-blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT_BLOG"],
    }),

    // Increase View
    increaseProductBlogView: builder.mutation<ProductBlogResponse, string>({
      query: (id) => ({
        url: `/product-blog/${id}/view`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "PRODUCT_BLOG", id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateProductBlogMutation,
  useGetAllProductBlogsQuery,
  useGetSingleProductBlogQuery,
  useUpdateProductBlogMutation,
  useDeleteProductBlogMutation,
  useIncreaseProductBlogViewMutation,
} = productBlogApi;
