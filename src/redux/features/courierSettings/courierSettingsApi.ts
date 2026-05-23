/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";
import {
  CourierSettings,
  CourierSettingsResponse,
  GetAllCourierSettingsResponse,
} from "@/types/courierSettings";
import { IResponse } from "@/types";

export const courierSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourierSettings: builder.mutation<CourierSettingsResponse, any>({
      query: (data) => ({
        url: "/courier-settings/create-courier-settings",
        method: "POST",
        data,
      }),
      invalidatesTags: ["COURIER_SETTINGS"],
    }),

    getAllCourierSettings: builder.query<
      GetAllCourierSettingsResponse,
      Record<string, any>
    >({
      query: (params) => ({
        url: "/courier-settings/all-courier-settings",
        method: "GET",
        params,
      }),
      providesTags: ["COURIER_SETTINGS"],
    }),

    getSingleCourierSettings: builder.query<CourierSettingsResponse, string>({
      query: (id) => ({
        url: `/courier-settings/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "COURIER_SETTING", id }],
    }),

    getCourierSettingsByProvider: builder.query<
      CourierSettingsResponse,
      string
    >({
      query: (provider) => ({
        url: `/courier-settings/provider/${provider}`,
        method: "GET",
      }),
      providesTags: ["COURIER_SETTINGS"],
    }),

    updateCourierSettings: builder.mutation<
      CourierSettingsResponse,
      {
        id: string;
        data: Partial<CourierSettings>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/courier-settings/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "COURIER_SETTINGS",
        { type: "COURIER_SETTING", id },
      ],
    }),

    toggleCourierSettingsStatus: builder.mutation<
      CourierSettingsResponse,
      string
    >({
      query: (id) => ({
        url: `/courier-settings/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "COURIER_SETTINGS",
        { type: "COURIER_SETTING", id },
      ],
    }),

    deleteCourierSettings: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/courier-settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COURIER_SETTINGS"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateCourierSettingsMutation,
  useGetAllCourierSettingsQuery,
  useGetSingleCourierSettingsQuery,
  useGetCourierSettingsByProviderQuery,
  useUpdateCourierSettingsMutation,
  useToggleCourierSettingsStatusMutation,
  useDeleteCourierSettingsMutation,
} = courierSettingsApi;
