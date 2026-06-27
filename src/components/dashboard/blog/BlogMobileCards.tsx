"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, Star } from "lucide-react";
import { IProductBlog } from "@/types/productBlog";
import {
  categoryLabel,
  formatDate,
  formatViews,
  statusColor,
  contentTypeColor,
} from "@/utils/blogHelpers";

interface Props {
  blogs: IProductBlog[];
  onView: (blog: IProductBlog) => void;
  onEdit: (blog: IProductBlog) => void;
  onDelete: (blog: IProductBlog) => void;
}

export function BlogMobileCards({ blogs, onView, onEdit, onDelete }: Props) {
  return (
    <div className="md:hidden space-y-3">
      {blogs.map((blog) => {
        const sc = statusColor(blog.status);
        const ctc = contentTypeColor(blog.contentType as "ARTICLE" | "VIDEO");
        return (
          <div
            key={blog._id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            {/* Top: thumbnail + header */}
            <div className="flex gap-3 p-4">
              <div className="relative h-16 w-22 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                {blog.thumbnail ? (
                  <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">📝</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                  {blog.featured && (
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                    {blog.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ctc.bg} ${ctc.text}`}>
                    {blog.contentType}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 px-4 pb-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{categoryLabel(blog.category)}</span>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViews(blog.views)}
              </div>
             
              <span className="ml-auto">{formatDate(blog.createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex border-t border-gray-100 dark:border-gray-800 divide-x divide-gray-100 dark:divide-gray-800">
              <button
                onClick={() => onView(blog)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                onClick={() => onEdit(blog)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(blog)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}