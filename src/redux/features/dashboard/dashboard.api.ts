/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";
// import type {
//   IDashboardOverview
// } from '@/types/dashboard-overview';

export interface DashboardParams {
  'createdAt[gte]'?: string;
  'createdAt[lte]'?: string;
  orderStatus?: string;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<any, DashboardParams | void>({
      query: (params) => {
        let url = '/dashboard/overview';
        if (params) {
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
          });
          const queryString = queryParams.toString();
          if (queryString) url += `?${queryString}`;
        }
        return { url };
      },
      providesTags: ['DASHBOARD_OVERVIEW'],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
