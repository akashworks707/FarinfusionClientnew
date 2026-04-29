"use client";

import { ShoppingCart, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatsProps {
  stats: {
    total: number;
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
}

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
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-3 transition-all duration-200 hover:border-amber-200 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-amber-900/40">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-50/0 transition-all duration-300 group-hover:bg-amber-50/30 dark:group-hover:bg-amber-900/5" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums leading-tight text-gray-900 dark:text-gray-50">
            {value}
          </p>
          {sub && (
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              {sub}
            </p>
          )}
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

export function OrderStats({ stats }: OrderStatsProps) {
  if (!stats) return null;

  const totalOrders = stats.total || 0;
  const pendingOrders = stats.PENDING || 0;
  const confirmedOrders = stats.CONFIRMED || 0;
  const completedOrders = stats.COMPLETED || 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={ShoppingCart}
        accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      />
      <StatCard
        label="Pending"
        value={pendingOrders}
        icon={Clock}
        accent="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
        sub="awaiting confirmation"
      />
      <StatCard
        label="Confirmed"
        value={confirmedOrders}
        icon={CheckCircle2}
        accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
      />
      <StatCard
        label="Completed"
        value={completedOrders}
        icon={CheckCircle2}
        accent="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
      />
    </div>
  );
}
