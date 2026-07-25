/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IDashboardOverview } from "@/types/dashboard-overview";

type StaffPerformanceItem = NonNullable<IDashboardOverview["staffPerformance"]>[number];

interface StaffPerformanceTableProps {
  staffPerformance: StaffPerformanceItem[];
  dateLabel?: string | null;
}

type SortKey = "sellerName" | "totalOrders" | "revenue" | "totalCommission";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-gray-400 ml-1 inline" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-amber-500 ml-1 inline" />
  ) : (
    <ArrowDown className="h-3 w-3 text-amber-500 ml-1 inline" />
  );
}

const ROLE_BADGE: Record<string, string> = {
  ADMIN:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  MANAGER:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  MODERATOR:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400",
  TELLICELSS:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
};

function MiniStat({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn("text-xs font-bold tabular-nums", cls)}>{value}</span>
      <span className="text-[9px] uppercase tracking-wide text-gray-400">{label}</span>
    </div>
  );
}

export function StaffPerformanceTable({
  staffPerformance,
  dateLabel,
}: StaffPerformanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...staffPerformance].sort((a, b) => {
      let av: any = a[sortKey as keyof StaffPerformanceItem];
      let bv: any = b[sortKey as keyof StaffPerformanceItem];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [staffPerformance, sortKey, sortDir]);

  if (!staffPerformance || staffPerformance.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
              Staff Performance
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Order breakdown &amp; revenue by staff member
            </p>
          </div>
          <Users className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
            <Users className="h-7 w-7 text-amber-300 dark:text-amber-800" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No staff performance data for this period
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue = staffPerformance.reduce((s, e) => s + (e.revenue ?? 0), 0);
  const totalCommission = staffPerformance.reduce(
    (s, e) => s + (e.totalCommission ?? 0),
    0,
  );

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
            Staff Performance
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Order breakdown &amp; revenue by staff member
            {dateLabel && (
              <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                {dateLabel}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-right">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
              Revenue
            </p>
            <p className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
              Commission
            </p>
            <p className="text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">
              ৳{totalCommission.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50/40 hover:bg-amber-50/40 dark:bg-amber-900/5 dark:hover:bg-amber-900/5 border-b border-amber-100/80 dark:border-amber-900/20">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 pl-5 w-8">
                #
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none min-w-40"
                onClick={() => handleSort("sellerName")}
              >
                Staff Member
                <SortIcon active={sortKey === "sellerName"} dir={sortDir} />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none text-center"
                onClick={() => handleSort("totalOrders")}
              >
                Orders
                <SortIcon active={sortKey === "totalOrders"} dir={sortDir} />
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 text-center">
                Status Breakdown
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none text-right"
                onClick={() => handleSort("revenue")}
              >
                Revenue
                <SortIcon active={sortKey === "revenue"} dir={sortDir} />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 text-right pr-5 cursor-pointer select-none"
                onClick={() => handleSort("totalCommission")}
              >
                Commission
                <SortIcon active={sortKey === "totalCommission"} dir={sortDir} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((staff, idx) => {
              const revenueShare =
                totalRevenue > 0 ? Math.round((staff.revenue / totalRevenue) * 100) : 0;
              const avatarHue =
                [...(staff.sellerName ?? "U")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

              return (
                <TableRow
                  key={staff._id}
                  className={cn(
                    "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-900/5",
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50/30 dark:bg-gray-800/20",
                  )}
                >
                  <TableCell className="pl-5 text-xs font-bold text-gray-400">
                    {idx + 1}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {staff.profileImage ? (
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={staff.profileImage}
                            alt={staff.sellerName}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ background: `hsl(${avatarHue},52%,48%)` }}
                        >
                          {staff.sellerName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug truncate max-w-40">
                          {staff.sellerName}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-1.5 py-0 text-[9px] font-bold",
                              ROLE_BADGE[staff.role] ??
                                "border-gray-200 bg-gray-50 text-gray-600",
                            )}
                          >
                            {staff.role}
                          </Badge>
                          <span className="text-[10px] text-gray-400 truncate max-w-24">
                            {staff.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="rounded-full border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 tabular-nums"
                    >
                      {staff.totalOrders}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <MiniStat
                        label="Pending"
                        value={staff.pendingOrders}
                        cls="text-amber-600 dark:text-amber-400"
                      />
                      <MiniStat
                        label="Confirmed"
                        value={staff.confirmedOrders}
                        cls="text-blue-600 dark:text-blue-400"
                      />
                      <MiniStat
                        label="Completed"
                        value={staff.completedOrders}
                        cls="text-emerald-600 dark:text-emerald-400"
                      />
                      <MiniStat
                        label="Partial"
                        value={staff.partialOrders}
                        cls="text-violet-600 dark:text-violet-400"
                      />
                      <MiniStat
                        label="Cancelled"
                        value={staff.cancelledOrders}
                        cls="text-red-600 dark:text-red-400"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        ৳{staff.revenue.toLocaleString()}
                      </span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="h-1 w-14 rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-1 rounded-full bg-amber-400 transition-all duration-500"
                            style={{ width: `${revenueShare}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400">{revenueShare}%</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-5 font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    ৳{staff.totalCommission.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}