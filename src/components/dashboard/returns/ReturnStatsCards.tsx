"use client";

import React from "react";
import {
  Package,
  Clock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface StatsData {
  totalReturns: number;
  pendingReturns: number;
  processingReturns: number;
  completedReturns: number;
  totalRefunded: number;
}

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, trend }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-200/60 hover:shadow-lg dark:border-gray-800/60 dark:bg-slate-900/50 dark:hover:border-amber-900/40">
      <div className="absolute inset-0 bg-linear-to-br from-amber-50/0 to-amber-100/0 opacity-0 transition-all duration-300 group-hover:from-amber-50 group-hover:to-amber-50/50 group-hover:opacity-100 dark:group-hover:from-amber-900/10 dark:group-hover:to-amber-900/5" />

      <div className="relative space-y-3">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-50 to-amber-100/50 text-amber-600 transition-all duration-300 group-hover:scale-110 dark:from-amber-900/20 dark:to-amber-900/10 dark:text-amber-400">
          {icon}
        </div>

        {/* Label and Value */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>

        {/* Trend */}
        {trend && (
          <div
            className={`text-xs font-semibold ${
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            } dark:${trend.isPositive ? "text-emerald-400" : "text-rose-400"}`}
          >
            {trend.isPositive ? "+" : "-"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
};

export const ReturnStatsCards: React.FC<{ stats: StatsData }> = ({ stats }) => {
  const statsCards = [
    {
      icon: <Package className="h-6 w-6" />,
      label: "Total Returns",
      value: stats.totalReturns,
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: "Pending Returns",
      value: stats.pendingReturns,
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      label: "Processing Returns",
      value: stats.processingReturns,
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      label: "Completed Returns",
      value: stats.completedReturns,
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      label: "Total Refunded",
      value: `৳${stats.totalRefunded.toFixed(2)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statsCards.map((card, index) => (
        <div key={index} className="animate-in fade-in slide-in-from-bottom-4">
          <StatsCard {...card} />
        </div>
      ))}
    </div>
  );
};
