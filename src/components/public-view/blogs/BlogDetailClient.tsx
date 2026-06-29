/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Clock, Calendar, ArrowLeft, Star, Tag } from "lucide-react";

import {
  useGetSingleProductBlogQuery,
  useIncreaseProductBlogViewMutation,
  useGetAllProductBlogsQuery,
} from "@/redux/features/productBlog/productBlog.api";
import { formatDate, formatViews, getRelatedBlogs } from "@/utils/blogHelpers";

import { BlogCategoryBadge } from "./BlogCategoryBadge";
import { BlogContent } from "./BlogContent";
import { YouTubeEmbed } from "./YoutubeEmbed";
import { ShareButtons } from "./ShareButtons";
import { RelatedBlogs } from "./RelatedBlogs";
import { BlogDetailSkeleton } from "./BlogSkeletons";
import { BlogEmptyState } from "./BlogEmptyState";

interface Props {
  slug: string;
}

export function BlogDetailClient({ slug }: Props) {
  const { data, isLoading, isError } = useGetSingleProductBlogQuery(slug);
  const [increaseView] = useIncreaseProductBlogViewMutation();

  const blog = data?.data;

  // Increase view once when blog loads
  useEffect(() => {
    if (blog?._id && blog.status === "PUBLISHED") {
      increaseView(blog._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog?._id]);

  // Fetch same-category blogs for related section
  const { data: relatedData } = useGetAllProductBlogsQuery(
    { status: "PUBLISHED", category: blog?.category, limit: 4 },
    { skip: !blog?.category },
  );
  const relatedBlogs = blog
    ? getRelatedBlogs(relatedData?.data?.data ?? [], blog, 3)
    : [];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <BlogDetailSkeleton />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="max-w-352 mx-auto px-4 py-20">
        <BlogEmptyState
          title="Blog not found"
          description="This article might have been removed or the link is incorrect."
        />
        <div className="flex justify-center mt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all blogs
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = (blog as any).readingTime ?? 1;

  return (
    <article className="max-w-352 mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8 group transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        All articles
      </Link>

      {/* Banner */}
      {blog.banner && (
        <div className="relative h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden mb-8 shadow-md bg-amber-50 dark:bg-gray-800">
          <Image
            src={blog.banner}
            alt={blog.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <BlogCategoryBadge category={blog.category} size="md" />

          {blog.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </span>
          )}

          {blog.contentType === "VIDEO" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold">
              ▶ Video
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Short description */}
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
          {blog.shortDescription}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {formatViews(blog.views)} views
          </span>
          {blog.createdBy && (
            <span className="text-gray-500 dark:text-gray-400">
              By{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {blog.createdBy.name}
              </span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-linear-to-r from-amber-400/60 via-amber-200/30 to-transparent" />
      </header>

      {/* Thumbnail (if no banner, show as inline image) */}
      {!blog.banner && blog.thumbnail && (
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Video embed for VIDEO type */}
      {blog.contentType === "VIDEO" && (blog as any).videoUrl && (
        <YouTubeEmbed url={(blog as any).videoUrl} title={blog.title} />
      )}

      {/* Main content */}
      <div className="mb-10">
        <BlogContent content={blog.content} />
      </div>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <Tag className="h-4 w-4 text-gray-400 shrink-0" />
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Share */}
      <div className="flex flex-wrap items-center gap-3 py-6 border-t border-b border-gray-200 dark:border-gray-800 mb-10">
        <ShareButtons title={blog.title} slug={blog.slug} />
      </div>

      {/* Related blogs */}
      <RelatedBlogs blogs={relatedBlogs} category={blog.category} />
    </article>
  );
}
