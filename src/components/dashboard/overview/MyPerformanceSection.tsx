"use client";

import { ShoppingBag, TrendingUp, Clock, CheckCircle2, XCircle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IDashboardOverview } from "@/types/dashboard-overview";
import { StatusBreakdownGrid, StatusBreakdownItem } from "./StatusBreakdownGrid";

type MyPerformance = NonNullable<IDashboardOverview["myPerformance"]>;

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white px-5 py-4 transition-all duration-200 hover:border-amber-200 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-amber-900/40">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-50/0 transition-all duration-300 group-hover:bg-amber-50/30 dark:group-hover:bg-amber-900/5" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums leading-tight text-gray-900 dark:text-gray-50">
            {value}
          </p>
          {sub && <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

interface MyPerformanceSectionProps {
  performance: MyPerformance;
  dateLabel?: string | null;
  /** optional per-order commission rate from the staff member's own profile */
  commissionRate?: number;
}

export function MyPerformanceSection({
  performance,
  dateLabel,
  commissionRate,
}: MyPerformanceSectionProps) {
  const statusItems: StatusBreakdownItem[] = [
    {
      key: "PENDING",
      label: "Pending",
      icon: Clock,
      cls: "border-amber-200 bg-amber-50/60 dark:border-amber-900/30 dark:bg-amber-900/10",
      val: "text-amber-700 dark:text-amber-400",
      count: performance.pendingOrders,
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      icon: CheckCircle2,
      cls: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-900/10",
      val: "text-emerald-700 dark:text-emerald-400",
      count: performance.confirmedOrders,
    },
    {
      key: "COMPLETED",
      label: "Completed",
      icon: CheckCircle2,
      cls: "border-violet-200 bg-violet-50/60 dark:border-violet-900/30 dark:bg-violet-900/10",
      val: "text-violet-700 dark:text-violet-400",
      count: performance.completedOrders,
    },
    {
      key: "PARTIAL",
      label: "Partial",
      icon: Layers,
      cls: "border-blue-200 bg-blue-50/60 dark:border-blue-900/30 dark:bg-blue-900/10",
      val: "text-blue-700 dark:text-blue-400",
      count: performance.partialOrders,
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      icon: XCircle,
      cls: "border-red-200 bg-red-50/60 dark:border-red-900/30 dark:bg-red-900/10",
      val: "text-red-700 dark:text-red-400",
      count: performance.cancelledOrders,
    },
  ];

  const estimatedCommission =
    commissionRate !== undefined ? commissionRate * performance.completedOrders : undefined;

  return (
    <div className="space-y-4">
      {dateLabel && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Showing performance for{" "}
          <span className="font-semibold text-amber-600 dark:text-amber-400">{dateLabel}</span>
        </p>
      )}
      <div
        className={cn(
          "grid grid-cols-2 gap-4",
          estimatedCommission !== undefined ? "lg:grid-cols-5" : "lg:grid-cols-4",
        )}
      >
        <StatCard
          label="Total Orders"
          value={performance.totalOrders}
          icon={ShoppingBag}
          accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        />
        <StatCard
          label="Revenue"
          value={`৳${performance.revenue.toLocaleString()}`}
          icon={TrendingUp}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          sub="Confirmed & completed"
        />
        <StatCard
          label="Completed"
          value={performance.completedOrders}
          icon={CheckCircle2}
          accent="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
        />
        <StatCard
          label="Pending"
          value={performance.pendingOrders}
          icon={Clock}
          accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        />
        {estimatedCommission !== undefined && (
          <StatCard
            label="Est. Commission"
            value={`৳${estimatedCommission.toLocaleString()}`}
            icon={TrendingUp}
            accent="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
            sub="Based on completed orders"
          />
        )}
      </div>
      <StatusBreakdownGrid items={statusItems} total={performance.totalOrders} />
    </div>
  );
}