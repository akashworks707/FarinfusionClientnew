"use client";

import { BookOpen, CheckCircle, FileText, Star, Eye } from "lucide-react";
import { IProductBlog } from "@/types/productBlog";
import { formatViews } from "@/utils/blogHelpers";

interface Props {
  blogs: IProductBlog[];
  total: number;
}

export function BlogStatsCards({ blogs, total }: Props) {
  const published = blogs.filter((b) => b.status === "PUBLISHED").length;
  const draft = blogs.filter((b) => b.status === "DRAFT").length;
  const featured = blogs.filter((b) => b.featured).length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  const stats = [
    {
      label: "Total Blogs",
      value: total,
      icon: BookOpen,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Published",
      value: published,
      icon: CheckCircle,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Drafts",
      value: draft,
      icon: FileText,
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    {
      label: "Featured",
      value: featured,
      icon: Star,
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      label: "Total Views",
      value: formatViews(totalViews),
      icon: Eye,
      iconBg: "bg-rose-100 dark:bg-rose-900/40",
      iconColor: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`
            bg-white dark:bg-gray-900 rounded-xl p-4 border ${s.border}
            shadow-sm hover:shadow-md transition-shadow duration-200
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {s.label}
            </span>
            <div className={`${s.iconBg} p-1.5 rounded-lg`}>
              <s.icon className={`h-3.5 w-3.5 ${s.iconColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function BlogStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}