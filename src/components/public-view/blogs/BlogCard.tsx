/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Eye, Clock, Star, ArrowRight } from "lucide-react";
import { IProductBlog } from "@/types/productBlog";
import { formatDateShort, formatViews } from "@/utils/blogHelpers";
import { BlogCategoryBadge } from "./BlogCategoryBadge";

interface Props {
  blog: IProductBlog;
  priority?: boolean;
}

export function BlogCard({ blog, priority = false }: Props) {
  const readingTime = (blog as any).readingTime ?? 1;

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-amber-50 dark:bg-gray-800 shrink-0">
        {blog.thumbnail ? (
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-amber-300 dark:text-amber-700">
            ✍️
          </div>
        )}

        {/* Featured badge */}
        {blog.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow">
            <Star className="h-3 w-3 fill-white" />
            Featured
          </div>
        )}

        {/* Video indicator */}
        {blog.contentType === "VIDEO" && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm">
            ▶ Video
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <BlogCategoryBadge category={blog.category} />
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {formatDateShort(blog.createdAt)}
          </span>
        </div>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {blog.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
          {blog.shortDescription}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(blog.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime}m read
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}