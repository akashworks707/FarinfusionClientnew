
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IStaffEarning } from "@/types/dashboard-overview";

interface StaffEarningsTableProps {
  staffEarnings: IStaffEarning[];
  dateLabel?: string | null;
}

type SortKey = "totalEarnings" | "totalOrders" | "sellerName";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-gray-400 ml-1 inline" />;
  return dir === "asc"
    ? <ArrowUp className="h-3 w-3 text-amber-500 ml-1 inline" />
    : <ArrowDown className="h-3 w-3 text-amber-500 ml-1 inline" />;
}

export function StaffEarningsTable({ staffEarnings, dateLabel }: StaffEarningsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalEarnings");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  if (!staffEarnings || staffEarnings.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Staff Earnings</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Revenue breakdown by staff member</p>
          </div>
          <Users className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
            <Users className="h-7 w-7 text-amber-300 dark:text-amber-800" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">No staff earnings data for this period</p>
        </div>
      </div>
    );
  }

  const sorted = [...staffEarnings].sort((a, b) => {
    let av: any = a[sortKey as keyof IStaffEarning];
    let bv: any = b[sortKey as keyof IStaffEarning];
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalRevenue = staffEarnings.reduce((s, e) => s + (e.totalEarnings ?? 0), 0);

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50">Staff Earnings</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Revenue breakdown by staff member
            {dateLabel && (
              <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                {dateLabel}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TrendingUp className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">
            ৳{totalRevenue.toLocaleString()}
          </span>
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
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none"
                onClick={() => handleSort("sellerName")}
              >
                Staff Member
                <SortIcon active={sortKey === "sellerName"} dir={sortDir} />
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60">
                Phone
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60">
                Total Order Value
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none text-center"
                onClick={() => handleSort("totalOrders")}
              >
                Orders
                <SortIcon active={sortKey === "totalOrders"} dir={sortDir} />
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 text-right">
               Commission Per Product
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 text-right pr-5 cursor-pointer select-none"
                onClick={() => handleSort("totalEarnings")}
              >
                Total Salary / Commission
                <SortIcon active={sortKey === "totalEarnings"} dir={sortDir} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((staff, idx) => {
              const avg = staff.totalOrders > 0
                ? Math.round(staff.totalEarnings / staff.totalOrders)
                : 0;
              const share = totalRevenue > 0
                ? Math.round((staff.totalEarnings / totalRevenue) * 100)
                : 0;
              const avatarHue = [...(staff.sellerName ?? "U")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

              return (
                <TableRow key={staff._id}
                  className={cn(
                    "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-900/5",
                    idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/30 dark:bg-gray-800/20",
                  )}>
                  {/* Rank */}
                  <TableCell className="pl-5 text-xs font-bold text-gray-400">
                    {idx + 1}
                  </TableCell>
                  {/* Name + avatar */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ background: `hsl(${avatarHue},52%,48%)` }}
                      >
                        {staff.sellerName?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                          {staff.sellerName}
                        </p>
                        {/* Revenue share bar */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <div className="h-1 w-16 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-1 rounded-full bg-amber-400 transition-all duration-500"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400">{share}%</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {/* Phone */}
                  <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-40 truncate">
                    {staff.phone}
                  </TableCell>

                  {/* Total Order Value */}
                  <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-40 truncate">
                    ৳{(staff?.totalOrderValue || 0).toLocaleString()}
                  </TableCell>
                  {/* Orders */}
                  <TableCell className="text-center">
                    <Badge variant="outline"
                      className="rounded-full border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 tabular-nums">
                      {staff.totalOrders}
                    </Badge>
                  </TableCell>
                  {/* Avg */}
                  <TableCell className="text-center text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-400">
                    ৳{avg.toLocaleString()}
                  </TableCell>
                  {/* Revenue */}
                  <TableCell className="text-center pr-5 font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    ৳{staff.totalEarnings.toLocaleString()}
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