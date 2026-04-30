
"use client";

import React from "react";
import { Users, UserCheck, Zap, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StaffStat {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
  trend?: string;
  trendColor?: string;
}

interface StaffManagementStatsProps {
  totalUsers?: number;
  totalSalary?: number;
  totalFixedSalary?: number;
  totalSalaryByProduct?: number;
  loading?: boolean;
}

export const StaffManagementStats: React.FC<StaffManagementStatsProps> = ({
  totalUsers = 0,
  totalSalary = 0,
  totalFixedSalary = 0,
  totalSalaryByProduct = 0,
  loading = false,
}) => {
  const formatCurrency = (value: number) => {
    return `৳${(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const stats: StaffStat[] = [
    {
      icon: <Users className="h-6 w-6" />,
      label: "Total Staffs",
      value: totalUsers,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      trendColor: "text-amber-600",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: "Total Salary",
      value: formatCurrency(totalSalary),
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      trendColor: "text-orange-600",
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      label: "Total Fixed Salary",
      value: formatCurrency(totalFixedSalary),
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      trendColor: "text-green-600",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Total Salary By Product",
      value: formatCurrency(totalSalaryByProduct),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      trendColor: "text-blue-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="overflow-hidden p-0 hover:shadow-lg transition-all duration-300 border border-amber-200/20 dark:border-amber-900/20 hover:border-amber-400/40 dark:hover:border-amber-600/40"
        >
          <CardContent className="p-0">
            {/* Header with background color */}
            <div
              className={`${stat.bgColor} px-6 py-4 border-b border-amber-200/10 dark:border-amber-900/10`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                {stat.trend && (
                  <div className={`text-xs font-semibold ${stat.trendColor}`}>
                    {stat.trend}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffManagementStats;