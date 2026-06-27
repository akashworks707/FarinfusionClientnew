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

const TH = ({ children, cls = "" }: { children: React.ReactNode; cls?: string }) => (
  <th
    className={`px-4 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${cls}`}
  >
    {children}
  </th>
);

export function BlogTable({ blogs, onView, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
            <TH cls="w-[40%]">Blog</TH>
            <TH>Category</TH>
            <TH>Type</TH>
            <TH>Status</TH>
            <TH>Views</TH>
            <TH>Date</TH>
            <TH cls="text-right">Actions</TH>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {blogs.map((blog) => {
            const sc = statusColor(blog.status);
            const ctc = contentTypeColor(blog.contentType as "ARTICLE" | "VIDEO");
            return (
              <tr
                key={blog._id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                {/* Blog cell */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-600 text-lg">
                          📝
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-50">
                          {blog.title}
                        </p>
                        {blog.featured && (
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-55 mt-0.5">
                        {blog.shortDescription}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {categoryLabel(blog.category)}
                  </span>
                </td>

                {/* Content Type */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ctc.bg} ${ctc.text}`}>
                    {blog.contentType}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                    {blog.status}
                  </span>
                </td>

                {/* Views */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="h-3.5 w-3.5" />
                    {formatViews(blog.views)}
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(blog.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn
                      icon={Eye}
                      label="View"
                      cls="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      onClick={() => onView(blog)}
                    />
                    <ActionBtn
                      icon={Pencil}
                      label="Edit"
                      cls="text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                      onClick={() => onEdit(blog)}
                    />
                    <ActionBtn
                      icon={Trash2}
                      label="Delete"
                      cls="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={() => onDelete(blog)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  cls,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  cls: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}