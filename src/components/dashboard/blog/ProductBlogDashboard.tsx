/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { IProductBlog } from "@/types/productBlog";
import { useBlogFilters } from "@/hooks/useBlogFilters";
import {
  useGetAllProductBlogsQuery,
  useDeleteProductBlogMutation,
} from "@/redux/features/productBlog/productBlog.api";

import { BlogStatsCards, BlogStatsCardsSkeleton } from "./BlogStatCards";
import { BlogFilterToolbar } from "./BlogFilterToolbar";
import { BlogTable } from "./BlogTable";
import { BlogMobileCards } from "./BlogMobileCards";
import { BlogPagination } from "./BlogPagination";
import { BlogFormModal } from "./BlogFormModal";
import { BlogDetailModal } from "./BlogDetailModal";
import { BlogDeleteDialog } from "./BlogDeleteDialog";
import { BlogTableSkeleton, BlogEmptyState } from "./BlogSkeletons";

export function ProductBlogDashboard() {
  const {
    params,
    queryParams,
    setSearch,
    setStatus,
    setCategory,
    setContentType,
    setFeatured,
    setPage,
    resetFilters,
  } = useBlogFilters();

  const [formOpen, setFormOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<IProductBlog | null>(null);
  const [viewBlog, setViewBlog] = useState<IProductBlog | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<IProductBlog | null>(null);

  const { data, isLoading, isFetching } =
    useGetAllProductBlogsQuery(queryParams);
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteProductBlogMutation();

  const blogs = data?.data?.data ?? [];
  const meta = data?.meta;

  const openCreate = () => {
    setEditBlog(null);
    setFormOpen(true);
  };

  const openEdit = (blog: IProductBlog) => {
    setEditBlog(blog);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteBlog) return;
    try {
      await deleteMutation(deleteBlog._id).unwrap();
      toast.success("Blog deleted successfully");
      setDeleteBlog(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete blog");
    }
  };

  const showSkeleton = isLoading;
  const showRefetch = !isLoading && isFetching;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Product Blogs
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Manage, publish and track all blog content
            </p>
          </div>
          <button
            onClick={openCreate}
            className="
              inline-flex items-center gap-2 h-10 px-4 rounded-xl
              bg-amber-500 hover:bg-amber-600 active:bg-amber-700
              text-white text-sm font-semibold shadow-sm
              transition-all duration-150 self-start sm:self-auto
            "
          >
            <Plus className="h-4 w-4" />
            New Blog
          </button>
        </div>

        {/* ── Stats ── */}
        {showSkeleton ? (
          <BlogStatsCardsSkeleton />
        ) : (
          <BlogStatsCards blogs={blogs} total={meta?.total ?? 0} />
        )}

        {/* ── Filters ── */}
        <BlogFilterToolbar
          params={params}
          onSearch={setSearch}
          onStatus={setStatus}
          onCategory={setCategory}
          onContentType={setContentType}
          onFeatured={setFeatured}
          onReset={resetFilters}
        />

        {/* ── Refetch indicator ── */}
        {showRefetch && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-3 animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Refreshing…
          </div>
        )}

        {/* ── Content ── */}
        {showSkeleton ? (
          <BlogTableSkeleton />
        ) : blogs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <BlogEmptyState onAdd={openCreate} />
          </div>
        ) : (
          <>
            <BlogTable
              blogs={blogs}
              onView={(b) => setViewBlog(b)}
              onEdit={openEdit}
              onDelete={(b) => setDeleteBlog(b)}
            />
            <BlogMobileCards
              blogs={blogs}
              onView={(b) => setViewBlog(b)}
              onEdit={openEdit}
              onDelete={(b) => setDeleteBlog(b)}
            />
          </>
        )}

        {/* ── Pagination ── */}
        {meta && meta.totalPage > 1 && (
          <BlogPagination
            page={meta.page}
            totalPage={meta.totalPage}
            total={meta.total}
            limit={meta.limit}
            onPage={setPage}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <BlogFormModal
        isOpen={formOpen}
        editBlog={editBlog}
        onClose={() => {
          setFormOpen(false);
          setEditBlog(null);
        }}
      />

      <BlogDetailModal
        blog={viewBlog}
        isOpen={!!viewBlog}
        onClose={() => setViewBlog(null)}
        onEdit={(b) => {
          setViewBlog(null);
          openEdit(b);
        }}
      />

      <BlogDeleteDialog
        isOpen={!!deleteBlog}
        blogTitle={deleteBlog?.title ?? ""}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteBlog(null)}
      />
    </div>
  );
}
