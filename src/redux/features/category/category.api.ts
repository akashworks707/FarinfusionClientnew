import { baseApi } from "../baseApi";
import type { GetQueryParams, ICategory, IPaginationMeta, IResponse } from "@/types";

interface GetAllCategoriesResponse {
    success: boolean;
    data: ICategory[];
    meta: IPaginationMeta;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ⭐ CREATE CATEGORY
    createCategory: builder.mutation<IResponse<ICategory>, FormData>({
      query: (formData) => ({
        url: "/category/create-category",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["CATEGORIES"],
    }),

    // ⭐ UPDATE CATEGORY
    updateCategory: builder.mutation<
      IResponse<ICategory>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "CATEGORIES",
        { type: "CATEGORY", id },
      ],
    }),

    // ⭐ DELETE CATEGORY
    deleteCategory: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "CATEGORIES",
        { type: "CATEGORY", id },
      ],
    }),

    // ⭐ GET SINGLE CATEGORY (by slug)
    getSingleCategory: builder.query<IResponse<ICategory>, string>({
      query: (slug) => ({
        url: `/category/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "CATEGORY", id: slug },
      ],
    }),

    // ⭐ GET ALL CATEGORIES
    getAllCategories: builder.query<GetAllCategoriesResponse | undefined, GetQueryParams>({
      query: (params) => ({
        url: "/category/all-categories",
        method: "GET",
        params
      }),
      providesTags: ["CATEGORIES"],
    }),

    // ⭐ GET ALL TRASH
    getAllTrashCategories: builder.query<GetAllCategoriesResponse, GetQueryParams>({
      query: (params) => ({
        url: "/category/all-trash-categories",
        method: "GET",
        params,
      }),
      providesTags: ["CATEGORIES"],
    }),

    // ⭐ TRASH UPDATE and Restore both work
    trashUpdateCategory: builder.mutation<IResponse<ICategory>, { _id: string;}>({
      query: ({ _id }) => ({
        url: `/category/category-trash/${_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { _id }) => ["CATEGORIES", { type: "CATEGORY", _id }],
    }),


    // ⭐ GET category by product
    getAllCategoryByProduct: builder.query<GetAllCategoriesResponse, string>({
      query: (slug) => ({
        url: `/category/category-by-product/${slug}`,
        method: "GET",
      }),
      providesTags: ["CATEGORIES"],
    }),


  }),

  overrideExisting: true,
});


export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSingleCategoryQuery,
  useGetAllCategoriesQuery,
    useGetAllTrashCategoriesQuery,
    useTrashUpdateCategoryMutation,
    useGetAllCategoryByProductQuery
} = categoryApi;
