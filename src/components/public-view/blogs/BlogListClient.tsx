"use client";

import { useGetAllProductBlogsQuery } from "@/redux/features/productBlog/productBlog.api";
import { useBlogListFilters } from "@/hooks/useBlogListFilters";
import { BlogFilterBar } from "./BlogFilterBar";
import { BlogCard } from "./BlogCard";
import { BlogListSkeleton } from "./BlogSkeletons";
import { BlogPagination } from "./BlogPagination";
import { BlogEmptyState } from "./BlogEmptyState";

export function BlogListClient() {
  const { params, queryParams, setSearch, setCategory, setFeatured, setPage, reset } =
    useBlogListFilters();

  const { data, isLoading, isFetching, isError } = useGetAllProductBlogsQuery(queryParams);

  const blogs = data?.data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-8">
      <BlogFilterBar
        params={params}
        onSearch={setSearch}
        onCategory={setCategory}
        onFeatured={setFeatured}
        onReset={reset}
      />

      {/* Refresh indicator */}
      {!isLoading && isFetching && (
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
          Refreshing…
        </div>
      )}

      {isError ? (
        <BlogEmptyState
          title="Something went wrong"
          description="We couldn't load blog posts right now. Please try again later."
        />
      ) : isLoading ? (
        <BlogListSkeleton count={9} />
      ) : blogs.length === 0 ? (
        <BlogEmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <BlogCard key={blog._id} blog={blog} priority={i < 3} />
          ))}
        </div>
      )}

      {meta && (
        <BlogPagination
          page={meta.page}
          totalPage={meta.totalPage}
          total={meta.total}
          limit={meta.limit}
          onPage={setPage}
        />
      )}
    </div>
  );
}