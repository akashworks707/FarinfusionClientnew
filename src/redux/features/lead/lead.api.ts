import { baseApi } from "../baseApi";
import type { IResponse, GetQueryParams, IPaginationMeta } from "@/types";
import {
  ILead,
  ILeadApiResponse,
  ILeadResponse,
  LeadInput,
} from "@/types/lead.types";

interface GetAllLeadResponse {
  success: boolean;
  data: ILead[];
  meta: IPaginationMeta;
}

export const leadApi = baseApi.injectEndpoints({
  // CREATE USER For Admin
  endpoints: (builder) => ({
    createLead: builder.mutation<IResponse<ILeadResponse>, LeadInput>({
      query: (formData) => ({
        url: "/lead/create-lead",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["LEADS"],
    }),

    // UPDATE USER
    updateLead: builder.mutation<
      IResponse<ILead>,
      { id: string; data: LeadInput }
    >({
      query: ({ id, data }) => ({
        url: `/lead/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "LEADS",
        { type: "LEAD", id },
      ],
    }),

    // DELETE USER
    deleteLead: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["LEADS", { type: "LEAD", id }],
    }),

    // GET SINGLE USER
    getSingleLead: builder.query<ILeadApiResponse, string>({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "LEAD", id: slug }],
    }),

    checkFraud: builder.query({
      query: (phone: string) => ({
        url: `/lead/fraud-check?phone=${phone}`,
        method: "GET",
      }),
    }),

    getAllLead: builder.query<GetAllLeadResponse, GetQueryParams>({
      query: (params) => ({
        url: "/lead/all-leads",
        method: "GET",
        params: params,
      }),
      providesTags: ["LEADS"],
    }),

    // ⭐ GET ALL TRASH
    getAllTrashLeads: builder.query<GetAllLeadResponse, GetQueryParams>({
      query: (params) => ({
        url: "/lead/all-trash-leads",
        method: "GET",
        params,
      }),
      providesTags: ["LEADS"],
    }),

    // ⭐ TRASH UPDATE  and Restore both work
    trashUpdateLead: builder.mutation<IResponse<ILead>, { _id: string }>({
      query: ({ _id }) => ({
        url: `/lead/lead-trash/${_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { _id }) => [
        "LEADS",
        { type: "LEAD", _id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetSingleLeadQuery,
  useLazyCheckFraudQuery,
  useGetAllLeadQuery,
  useGetAllTrashLeadsQuery,
  useTrashUpdateLeadMutation,
} = leadApi;
