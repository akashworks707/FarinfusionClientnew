"use client";

import { useCallback, useState, useTransition } from "react";
import { ProductBlogQueryParams } from "@/types/productBlog";

const DEFAULTS: ProductBlogQueryParams = {
  page: 1,
  limit: 9,
  searchTerm: "",
  status: "PUBLISHED",
  category: "",
  featured: undefined,
  sort: "-createdAt",
};

export function useBlogListFilters() {
  const [params, setParams] = useState<ProductBlogQueryParams>(DEFAULTS);
  const [, startTransition] = useTransition();

  const setSearch = useCallback((searchTerm: string) => {
    startTransition(() => setParams((p) => ({ ...p, searchTerm, page: 1 })));
  }, []);

  const setCategory = useCallback((category: string) => {
    setParams((p) => ({ ...p, category, page: 1 }));
  }, []);

  const setFeatured = useCallback((featured: boolean | undefined) => {
    setParams((p) => ({ ...p, featured, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((p) => ({ ...p, page }));
  }, []);

  const reset = useCallback(() => setParams(DEFAULTS), []);

  // Clean params — strip empty strings / undefined
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined)
  ) as ProductBlogQueryParams;

  return { params, queryParams, setSearch, setCategory, setFeatured, setPage, reset };
}