"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface PurchaseStats {
  totalPurchases: number;
  totalAmount: number;
  totalProfit: number;
  pendingPayments: number;
}

interface ProductPurchaseStatsProps {
  data: PurchaseStats;
  isLoading?: boolean;
}

export const ProductPurchaseStats: React.FC<ProductPurchaseStatsProps> = ({
  data,
  isLoading = false,
}) => {
  const stats = [
    {
      title: "Total Purchases",
      value: data.totalPurchases,
      icon: Package,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      title: "Total Spent",
      value: `৳${(data.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Total Profit",
      value: `৳${(data.totalProfit || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Pending Payments",
      value: data.pendingPayments,
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`border ${stat.borderColor} ${stat.bgColor} hover:shadow-lg transition-shadow`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
