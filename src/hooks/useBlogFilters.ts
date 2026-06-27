"use client";

import { useMemo, useState } from "react";
import { ProductBlogQueryParams } from "@/types/productBlog";

const LIMIT = 10;

export function useBlogFilters() {
  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [contentType, setContentType] = useState("");
  const [featured, setFeaturedState] = useState<boolean | undefined>(
    undefined,
  );

  const queryParams = useMemo<ProductBlogQueryParams>(
    () => ({
      page,
      limit: LIMIT,

      ...(searchTerm && { searchTerm }),

      ...(status && { status }),

      ...(category && { category }),

      ...(contentType && { contentType }),

      ...(featured !== undefined && { featured }),
    }),
    [page, searchTerm, status, category, contentType, featured],
  );

  return {
    params: {
      page,
      limit: LIMIT,

      searchTerm,
      status,
      category,
      contentType,
      featured,
    },

    queryParams,

    setSearch: (value: string) => {
      setPage(1);
      setSearchTerm(value);
    },

    setStatus: (value: string) => {
      setPage(1);
      setStatus(value);
    },

    setCategory: (value: string) => {
      setPage(1);
      setCategory(value);
    },

    setContentType: (value: string) => {
      setPage(1);
      setContentType(value);
    },

    setFeatured: (value: boolean | undefined) => {
      setPage(1);
      setFeaturedState(value);
    },

    setPage,

    resetFilters: () => {
      setPage(1);
      setSearchTerm("");
      setStatus("");
      setCategory("");
      setContentType("");
      setFeaturedState(undefined);
    },
  };
}