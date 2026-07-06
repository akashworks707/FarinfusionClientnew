/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, ArrowRight, Star } from "lucide-react";
import { useGetAllProductBlogsQuery } from "@/redux/features/productBlog/productBlog.api";
import { BlogCategoryBadge } from "../blogs/BlogCategoryBadge";
import { formatViews } from "@/utils/blogHelpers";

function HomeBlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
      <div className="h-56 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-1.5">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3.5 w-20 rounded bg-gray-200 dark:bg-gray-700 mt-2" />
      </div>
    </div>
  );
}

interface CardProps {
  blog: {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnail?: string;
    category: string;
    featured: boolean;
    views: number;
    readingTime?: number;
    contentType: string;
  };
  priority?: boolean;
}

function HomeBlogCard({ blog, priority = false }: CardProps) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-56 overflow-hidden bg-amber-50 dark:bg-gray-800 shrink-0">
        {blog.thumbnail ? (
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-amber-200 dark:text-amber-800">
            ✍️
          </div>
        )}

        {blog.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow">
            <Star className="h-3 w-3 fill-white" />
            Featured
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <BlogCategoryBadge category={blog.category} />
        </div>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {blog.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
          {blog.shortDescription}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(blog.views)}
            </span>
            {blog.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.readingTime}m
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductBlog() {
  const { data, isLoading } = useGetAllProductBlogsQuery({
    status: "PUBLISHED",
    limit: 4,
    sort: "-createdAt",
  });

  const blogs = data?.data?.data ?? [];

  if (blogs.length === 0) return null;

  return (
    <section className="w-full py-10 md:py-14">
      <div className="max-w-352 container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl heading-animate">
            Glow Better with Our Beauty Tips
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            Expert advice, tutorials, and skincare guides to help you look and
            feel your best.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <HomeBlogCardSkeleton key={i} />
              ))
            : blogs.map((blog, i) => (
                <HomeBlogCard
                  key={blog._id}
                  blog={blog as any}
                  priority={i === 0}
                />
              ))}
        </div>

        {/* View All */}
        {!isLoading && blogs.length > 0 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/blog"
              className="
                inline-flex items-center gap-2 h-11 px-8 rounded-2xl
                border-2 border-amber-500 text-amber-600 dark:text-amber-400
                text-sm font-semibold hover:bg-amber-500 hover:text-white
                transition-all duration-200 group
              "
            >
              View All Blogs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
