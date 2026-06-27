"use client";

import { useEffect, useState } from "react";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_CONTENT_TYPES, BLOG_STATUSES } from "@/types/productBlog";
import { categoryLabel } from "@/utils/blogHelpers";
import { ProductBlogQueryParams } from "@/types/productBlog";

interface Props {
  params: ProductBlogQueryParams;
  onSearch: (v: string) => void;
  onStatus: (v: string) => void;
  onCategory: (v: string) => void;
  onContentType: (v: string) => void;
  onFeatured: (v: boolean | undefined) => void;
  onReset: () => void;
}

export function BlogFilterToolbar({
  params,
  onSearch,
  onStatus,
  onCategory,
  onContentType,
  onFeatured,
  onReset,
}: Props) {
  const [searchInput, setSearchInput] = useState(params.searchTerm || "");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => onSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput, onSearch]);

  const hasActiveFilters =
    params.status ||
    params.category ||
    params.contentType ||
    params.featured !== undefined ||
    params.searchTerm;

  const selectCls =
    "h-9 pl-3 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all appearance-none cursor-pointer";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 mb-4 space-y-3">
      {/* Row 1: Search + toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs by title, category, tags…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="
              w-full h-9 pl-9 pr-9 rounded-lg border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200
              placeholder:text-gray-400 focus:outline-none focus:ring-2
              focus:ring-amber-500/40 focus:border-amber-500 transition-all
            "
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`
            flex items-center gap-2 h-9 px-3 rounded-lg border text-sm font-medium transition-all
            ${showFilters
              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300"
            }
          `}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={() => { onReset(); setSearchInput(""); }}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Row 2: Filter dropdowns */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Status */}
          <div className="relative">
            <select
              value={params.status || ""}
              onChange={(e) => onStatus(e.target.value)}
              className={selectCls}
            >
              <option value="">All Status</option>
              {BLOG_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={params.category || ""}
              onChange={(e) => onCategory(e.target.value)}
              className={selectCls}
            >
              <option value="">All Categories</option>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>{categoryLabel(c)}</option>
              ))}
            </select>
          </div>

          {/* Content Type */}
          <div className="relative">
            <select
              value={params.contentType || ""}
              onChange={(e) => onContentType(e.target.value)}
              className={selectCls}
            >
              <option value="">All Types</option>
              {BLOG_CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div className="relative">
            <select
              value={params.featured === undefined ? "" : String(params.featured)}
              onChange={(e) => {
                const v = e.target.value;
                onFeatured(v === "" ? undefined : v === "true");
              }}
              className={selectCls}
            >
              <option value="">All Blogs</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}