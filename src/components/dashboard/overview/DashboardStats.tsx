"use client";

import { Card } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Users, Package } from "lucide-react";
import type { IDashboardOverview } from "@/types/dashboard-overview";

interface DashboardStatsProps {
  dashboardData: IDashboardOverview;
}

export function DashboardStats({ dashboardData }: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Orders",
      value: dashboardData.totalOrders,
      change: "+12.5%",
      icon: ShoppingCart,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/40",
      borderColor: "border-amber-200/40 dark:border-amber-800/40",
    },
    {
      label: "Total Revenue",
      value: `৳${dashboardData.totalRevenue}`,
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/40",
      borderColor: "border-green-200/40 dark:border-green-800/40",
    },
    ...(dashboardData.totalUsers !== undefined
      ? [
          {
            label: "Total Users",
            value: dashboardData.totalUsers,
            change: "+5.3%",
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/40",
            borderColor: "border-blue-200/40 dark:border-blue-800/40",
          },
        ]
      : []),
    ...(dashboardData.totalProducts !== undefined
      ? [
          {
            label: "Total Products",
            value: dashboardData.totalProducts,
            change: "+3.1%",
            icon: Package,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/40",
            borderColor: "border-purple-200/40 dark:border-purple-800/40",
          },
        ]
      : []),
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`border ${stat.borderColor} bg-linear-to-br from-card via-card to-card/70 dark:from-card dark:via-card dark:to-card/50 p-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-100 cursor-default`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-foreground tracking-tight md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                  {stat.change} from last month
                </p>
              </div>
              <div
                className={`rounded-lg ${stat.bgColor} p-3 transition-all duration-300`}
              >
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-linear-to-r from-transparent via-current to-transparent opacity-10" />
          </Card>
        );
      })}
    </div>
  );
}
