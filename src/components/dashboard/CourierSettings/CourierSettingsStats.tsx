"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle, AlertCircle, Zap } from "lucide-react";
import type { CourierSettings } from "@/types/courierSettings";

interface CourierSettingsStatsProps {
  courierSettings?: CourierSettings[];
  isLoading?: boolean;
}

export function CourierSettingsStats({
  courierSettings = [],
  isLoading = false,
}: CourierSettingsStatsProps) {
  const totalSettings = courierSettings.length;
  const activeSettings = courierSettings.filter((s) => s.isActive).length;
  const sandboxSettings = courierSettings.filter((s) => s.isSandbox).length;
  const inactiveSettings = courierSettings.filter((s) => !s.isActive).length;

  const stats = [
    {
      icon: Package,
      label: "Total Couriers",
      value: totalSettings,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      accentColor: "from-amber-500/20 to-amber-600/20",
    },
    {
      icon: CheckCircle,
      label: "Active",
      value: activeSettings,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      accentColor: "from-emerald-500/20 to-emerald-600/20",
    },
    {
      icon: Zap,
      label: "Sandbox Mode",
      value: sandboxSettings,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      accentColor: "from-blue-500/20 to-blue-600/20",
    },
    {
      icon: AlertCircle,
      label: "Inactive",
      value: inactiveSettings,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      accentColor: "from-rose-500/20 to-rose-600/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`relative overflow-hidden rounded-2xl border-0 p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg/50`}
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.accentColor} opacity-0 transition-opacity duration-300 hover:opacity-100`}
            />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <Badge
                  variant="outline"
                  className="border-current bg-transparent text-current"
                >
                  {isLoading ? "—" : stat.value}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
