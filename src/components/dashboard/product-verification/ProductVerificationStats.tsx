"use client";

import { Eye, FileText, BookOpen, Star, TrendingUp } from "lucide-react";
import { ProductVerificationStatsSkeleton } from "./ProductVerificationSkeleton";

interface StatsData {
  total: number;
  published: number;
  draft: number;
  featured: number;
  totalViews: number;
}

interface ProductVerificationStatsProps {
  data?: StatsData;
  isLoading?: boolean;
}

export function ProductVerificationStats({
  data,
  isLoading,
}: ProductVerificationStatsProps) {
  if (isLoading) {
    return <ProductVerificationStatsSkeleton />;
  }

  const stats = [
    {
      label: "Total",
      value: data?.total ?? 0,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50 dark:bg-blue-950/20",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      label: "Published",
      value: data?.published ?? 0,
      icon: BookOpen,
      gradient: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/20",
      textColor: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Draft",
      value: data?.draft ?? 0,
      icon: TrendingUp,
      gradient: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50 dark:bg-amber-950/20",
      textColor: "text-amber-700 dark:text-amber-400",
    },
    {
      label: "Featured",
      value: data?.featured ?? 0,
      icon: Star,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50 dark:bg-purple-950/20",
      textColor: "text-purple-700 dark:text-purple-400",
    },
    {
      label: "Total Views",
      value: data?.totalViews ?? 0,
      icon: Eye,
      gradient: "from-pink-500 to-pink-600",
      bgLight: "bg-pink-50 dark:bg-pink-950/20",
      textColor: "text-pink-700 dark:text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgLight}`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
