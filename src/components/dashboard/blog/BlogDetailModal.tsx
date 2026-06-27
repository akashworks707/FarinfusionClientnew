"use client";

import { X, Star, Tag, Calendar, User,Video } from "lucide-react";
import Image from "next/image";
import { IProductBlog } from "@/types/productBlog";
import {
  categoryLabel,
  formatDate,
  statusColor,
  contentTypeColor,
} from "@/utils/blogHelpers";

interface Props {
  blog: IProductBlog | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (blog: IProductBlog) => void;
}

export function BlogDetailModal({ blog, isOpen, onClose, onEdit }: Props) {
  if (!isOpen || !blog) return null;

  const sc = statusColor(blog.status);
  const ctc = contentTypeColor(blog.contentType as "ARTICLE" | "VIDEO");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl mt-8 mb-8 overflow-hidden">

        {/* Banner */}
        <div className="relative h-40 sm:h-52 bg-linear-to-br from-amber-100 to-amber-50 dark:from-gray-800 dark:to-gray-900">
          {blog.banner ? (
            <Image src={blog.banner} alt="banner" fill className="object-cover" />
          ) : blog.thumbnail ? (
            <Image src={blog.thumbnail} alt="thumbnail" fill className="object-cover opacity-40" />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Featured badge */}
          {blog.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </div>
          )}

          {/* Thumbnail overlay */}
          {blog.thumbnail && (
            <div className="absolute bottom-3 left-4">
              <div className="h-12 w-16 rounded-lg overflow-hidden border-2 border-white/60 shadow-lg">
                <Image src={blog.thumbnail} alt="thumb" width={64} height={48} className="object-cover w-full h-full" />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
              {blog.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ctc.bg} ${ctc.text}`}>
              {blog.contentType === "VIDEO" ? <Video className="h-3 w-3 mr-1" /> : null}
              {blog.contentType}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {categoryLabel(blog.category)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
            {blog.title}
          </h2>

          {/* Short desc */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {blog.shortDescription}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            
            <MetaItem icon={Calendar} label="Created" value={formatDate(blog.createdAt)} />
            {blog.createdBy && (
              <MetaItem icon={User} label="Author" value={blog.createdBy.name} />
            )}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          

          {/* Slug */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-5">
            <span className="font-mono">/{blog.slug}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => { onClose(); onEdit(blog); }}
              className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-all"
            >
              Edit Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{value}</p>
    </div>
  );
}