import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "USERS",
    "USER",
    "CUSTOMERS",
    "CUSTOMER",
    "ME",
    "BRAND",
    "BRANDS",
    "POSSTATS",
    "CATEGORIES",
    "CATEGORY",
    "LEADS",
    "LEAD",
    "PRODUCTS",
    "PRODUCT",
    "ORDERS",
    "ORDER",
    "COURIERS",
    "COURIER",
    "MY_ORDERS",
    "DASHBOARD_OVERVIEW",
    "DASHBOARD_STATS",
    "COUPONS",
  ],
  endpoints: () => ({}),
});
