"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShoppingBag, TrendingUp, Calendar } from "lucide-react";

interface CustomerStatsProps {
  data?: {
    totalCustomers?: number;
    totalOrders?: number;
    totalRevenue?: number;
    averageOrderValue?: number;
  };
  isLoading?: boolean;
}

export function CustomerStats({ data, isLoading }: CustomerStatsProps) {
  const stats = [
    {
      label: "Total Customers",
      value: data?.totalCustomers || 0,
      icon: Users,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders || 0,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Revenue",
      value: `৳${(data?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Avg Order Value",
      value: `৳${Math.round(data?.averageOrderValue || 0).toLocaleString()}`,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900/50 overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
