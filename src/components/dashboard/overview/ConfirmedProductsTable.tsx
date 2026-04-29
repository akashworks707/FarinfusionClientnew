/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  ImageIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  ShoppingCart,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

interface IConfirmedProduct {
  productId: string;
  title: string;
  price: number;
  discountPrice?: number;
  buyingPrice?: number;
  images?: Array<{ url: string }>;
  availableStock?: number;
  totalSoldInPeriod: number;
  totalRevenueInPeriod: number;
  orderCount: number;
  totalSold?: number;
}

interface ConfirmedProductsTableProps {
  confirmedProducts: IConfirmedProduct[];
  dateLabel?: string | null;
}

type SortKey =
  | "title"
  | "totalSoldInPeriod"
  | "totalRevenueInPeriod"
  | "orderCount";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <ArrowUpDown className="h-3 w-3 text-gray-400 ml-1 inline" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-amber-500 ml-1 inline" />
  ) : (
    <ArrowDown className="h-3 w-3 text-amber-500 ml-1 inline" />
  );
}

export function ConfirmedProductsTable({
  confirmedProducts,
  dateLabel,
}: ConfirmedProductsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalSoldInPeriod");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
    setCurrentPage(1);
  };

  const sorted = useMemo(() => {
    return [...confirmedProducts].sort((a, b) => {
      const av = a[sortKey as keyof IConfirmedProduct] as any;
      const bv = b[sortKey as keyof IConfirmedProduct] as any;
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av ?? 0) - (bv ?? 0) : (bv ?? 0) - (av ?? 0);
    });
  }, [confirmedProducts, sortKey, sortDir]);

  if (!confirmedProducts || confirmedProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
              Confirmed Products
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Products from confirmed orders awaiting fulfillment
            </p>
          </div>
          <Clock className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
            <Package className="h-7 w-7 text-amber-300 dark:text-amber-700" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No confirmed products in this period
          </p>
        </div>
      </div>
    );
  }

  const totalPeriodSold = confirmedProducts.reduce(
    (s, p) => s + (p.totalSoldInPeriod ?? 0),
    0,
  );

  const totalPeriodRevenue = confirmedProducts.reduce(
    (s, p) =>
      s +
      (p.discountPrice && p.discountPrice > 0
        ? p.discountPrice
        : p.price * p.totalSoldInPeriod),
    0,
  );

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sorted.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const summaryItems = [
    {
      icon: ShoppingCart,
      label: "Total Sold",
      value: totalPeriodSold.toString(),
      accent: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Boxes,
      label: "Orders",
      value: confirmedProducts
        .reduce((s, p) => s + (p.orderCount ?? 0), 0)
        .toString(),
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingUp,
      label: "Revenue",
      value: `৳${totalPeriodRevenue.toLocaleString()}`,
      accent: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
              Confirmed Products
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Products in orders awaiting fulfillment
              {dateLabel && (
                <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  {dateLabel}
                </span>
              )}
            </p>
          </div>
          <Clock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
        </div>

        {/* Summary pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {summaryItems.map(({ icon: Icon, label, value, accent }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-800/40"
            >
              <Icon className={cn("h-3.5 w-3.5", accent)} />
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                {label}:
              </span>
              <span
                className={cn("text-[11px] font-bold tabular-nums", accent)}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50/40 hover:bg-amber-50/40 dark:bg-amber-900/5 dark:hover:bg-amber-900/5 border-b border-amber-100/80 dark:border-amber-900/20">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 pl-5 w-8">
                #
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 w-16">
                Image
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none min-w-48"
                onClick={() => handleSort("title")}
              >
                Product
                <SortIcon active={sortKey === "title"} dir={sortDir} />
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 text-center min-w-20">
                Price
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none text-center min-w-28"
                onClick={() => handleSort("totalSoldInPeriod")}
              >
                Sold
                <SortIcon
                  active={sortKey === "totalSoldInPeriod"}
                  dir={sortDir}
                />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none text-center min-w-28"
                onClick={() => handleSort("orderCount")}
              >
                Orders
                <SortIcon active={sortKey === "orderCount"} dir={sortDir} />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 cursor-pointer select-none text-right min-w-32 pr-5"
                onClick={() => handleSort("totalRevenueInPeriod")}
              >
                Revenue
                <SortIcon
                  active={sortKey === "totalRevenueInPeriod"}
                  dir={sortDir}
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((product: any, idx: number) => {
              const displayIdx = startIdx + idx + 1;
              // const sellPrice = product.discountPrice ?? product.price;
              const sellPrice =
                product.discountPrice && product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;

              const totalRevenue = sellPrice * product?.totalSoldInPeriod;

              console.log("product ", product);
              const share =
                totalPeriodSold > 0
                  ? Math.round(
                      (product.totalSoldInPeriod / totalPeriodSold) * 100,
                    )
                  : 0;

              return (
                <TableRow
                  key={product.productId}
                  className={cn(
                    "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors hover:bg-amber-50/20 dark:hover:bg-amber-900/5",
                    displayIdx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50/30 dark:bg-gray-800/20",
                  )}
                >
                  {/* Rank */}
                  <TableCell className="pl-5">
                    <span className="text-xs font-bold text-gray-400">
                      {displayIdx}
                    </span>
                  </TableCell>

                  {/* Product Image */}
                  <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      {product.images?.[0] ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                          <ImageIcon className="h-4 w-4 text-violet-300" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Product Title */}
                  <TableCell>
                    <p className="max-w-xs truncate font-medium text-gray-900 dark:text-gray-50">
                      {product.title}
                    </p>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-50 tabular-nums">
                        ৳{sellPrice.toLocaleString()}
                      </p>
                      {/* {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <p className="text-[10px] text-gray-400 line-through">
                            ৳{product.price.toLocaleString()}
                          </p>
                        )} */}
                    </div>
                  </TableCell>

                  {/* Total Sold */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-bold",
                          share >= 20
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : share >= 10
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                        )}
                      >
                        {product.totalSoldInPeriod}
                      </Badge>
                      {/* <span className="text-[9px] text-gray-500 dark:text-gray-400">
                        {share}%
                      </span> */}
                    </div>
                  </TableCell>

                  {/* Order Count */}
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-bold dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-400"
                    >
                      {product.orderCount}
                    </Badge>
                  </TableCell>

                  {/* Revenue */}
                  <TableCell className="text-right pr-5">
                    <p className="font-bold text-amber-600 dark:text-amber-400 text-sm tabular-nums">
                      {/* ৳{product.totalRevenueInPeriod.toLocaleString()} */}৳
                      {totalRevenue}
                    </p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing {startIdx + 1} to{" "}
            {Math.min(startIdx + ITEMS_PER_PAGE, sorted.length)} of{" "}
            {sorted.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className="h-8 min-w-8 text-xs"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
