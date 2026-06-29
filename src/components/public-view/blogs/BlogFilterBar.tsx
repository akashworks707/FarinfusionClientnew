"use client";

import { useEffect, useState } from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { BLOG_CATEGORIES } from "@/types/productBlog";
import { categoryLabel } from "@/utils/blogHelpers";
import { ProductBlogQueryParams } from "@/types/productBlog";

interface Props {
  params: ProductBlogQueryParams;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onFeatured: (v: boolean | undefined) => void;
  onReset: () => void;
}

const pillCls = (active: boolean) =>
  `h-9 px-4 rounded-full text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
    active
      ? "bg-amber-500 border-amber-500 text-white shadow-sm"
      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600"
  }`;

export function BlogFilterBar({ params, onSearch, onCategory, onFeatured, onReset }: Props) {
  const [searchInput, setSearchInput] = useState(params.searchTerm || "");

  useEffect(() => {
    const t = setTimeout(() => onSearch(searchInput), 380);
    return () => clearTimeout(t);
  }, [searchInput, onSearch]);

  const hasFilter = params.category || params.featured !== undefined || params.searchTerm;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search articles…"
          className="
            w-full h-11 pl-11 pr-10 rounded-2xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200
            placeholder:text-gray-400 focus:outline-none focus:ring-2
            focus:ring-amber-400/50 focus:border-amber-400 transition-all shadow-sm
          "
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category + featured pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => onCategory("")} className={pillCls(!params.category && params.featured === undefined)}>
          All
        </button>

        <button
          onClick={() => onFeatured(params.featured === true ? undefined : true)}
          className={pillCls(params.featured === true)}
        >
          ⭐ Featured
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 shrink-0 mx-1" />

        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategory(params.category === cat ? "" : cat)}
            className={pillCls(params.category === cat)}
          >
            {categoryLabel(cat)}
          </button>
        ))}

        {hasFilter && (
          <button
            onClick={() => { onReset(); setSearchInput(""); }}
            className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-gray-200 dark:border-gray-700 text-xs text-gray-500 hover:text-red-500 hover:border-red-300 transition-all ml-1 shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}