
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export interface ITopProduct {
  productId: string;
  title: string;
  price: number;
  discountPrice?: number;
  buyingPrice?: number;
  images?: string[];
  availableStock: number;
  totalSold: number;
  totalSoldInPeriod: number;
  totalRevenueInPeriod: number;
  orderCount: number;
}

interface TopProductsTableProps {
  topProducts: ITopProduct[];
  dateLabel?: string | null;
}

type SortKey =
  | "title"
  | "totalSoldInPeriod"
  | "totalSold"
  | "totalRevenueInPeriod"
  | "availableStock"
  | "price";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <ArrowUpDown className="h-3 w-3 text-gray-400 ml-1 inline" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-violet-500 ml-1 inline" />
  ) : (
    <ArrowDown className="h-3 w-3 text-violet-500 ml-1 inline" />
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <Badge
        variant="outline"
        className="rounded-full border-red-200 bg-red-50 text-red-600 text-[10px] font-bold dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400"
      >
        Out of stock
      </Badge>
    );
  if (stock <= 5)
    return (
      <Badge
        variant="outline"
        className="rounded-full border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold dark:border-orange-900/40 dark:bg-orange-900/10 dark:text-orange-400"
      >
        Low: {stock}
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400"
    >
      {stock}
    </Badge>
  );
}

export function TopProductsTable({
  topProducts,
  dateLabel,
}: TopProductsTableProps) {
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
    return [...topProducts].sort((a, b) => {
      const av = a[sortKey as keyof ITopProduct] as any;
      const bv = b[sortKey as keyof ITopProduct] as any;
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av ?? 0) - (bv ?? 0) : (bv ?? 0) - (av ?? 0);
    });
  }, [topProducts, sortKey, sortDir]);

  if (!topProducts || topProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
              Top Completed Selling Products
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Products ranked by units sold
            </p>
          </div>
          <Package className="h-4 w-4 text-violet-500" />
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/20">
            <Package className="h-7 w-7 text-violet-300 dark:bg-violet-800" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No product sales data for this period
          </p>
        </div>
      </div>
    );
  }

  const totalPeriodSold = topProducts.reduce(
    (s, p) => s + (p.totalSoldInPeriod ?? 0),
    0,
  );
  const totalPeriodRevenue = topProducts.reduce(
    (s, p) => s + (p.totalRevenueInPeriod ?? 0),
    0,
  );

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sorted.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Summary bar
  const summaryItems = [
    {
      icon: ShoppingCart,
      label: "Units sold",
      value: totalPeriodSold.toLocaleString(),
      accent: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: TrendingUp,
      label: "Revenue",
      value: `৳${totalPeriodRevenue.toLocaleString()}`,
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Boxes,
      label: "Products tracked",
      value: topProducts.length.toString(),
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
              Top Completed Selling Products
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Ranked by units sold in selected period
              {dateLabel && (
                <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400">
                  {dateLabel}
                </span>
              )}
            </p>
          </div>
          <Package className="h-4 w-4 shrink-0 text-violet-500 mt-0.5" />
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
            <TableRow className="bg-violet-50/40 hover:bg-violet-50/40 dark:bg-violet-900/5 dark:hover:bg-violet-900/5 border-b border-violet-100/80 dark:border-violet-900/20">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-violet-700/60 dark:text-violet-500/60 pl-5 w-8">
                #
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-violet-700/60 dark:text-violet-500/60 cursor-pointer select-none min-w-45"
                onClick={() => handleSort("title")}
              >
                Product
                <SortIcon active={sortKey === "title"} dir={sortDir} />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-violet-700/60 dark:text-violet-500/60 cursor-pointer select-none text-right"
                onClick={() => handleSort("price")}
              >
                Price
                <SortIcon active={sortKey === "price"} dir={sortDir} />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-violet-700/60 dark:text-violet-500/60 cursor-pointer select-none text-center"
                onClick={() => handleSort("totalSoldInPeriod")}
              >
                Sold (All-time)
                <SortIcon
                  active={sortKey === "totalSoldInPeriod"}
                  dir={sortDir}
                />
              </TableHead>

              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-violet-700/60 dark:text-violet-500/60 cursor-pointer select-none text-center"
                onClick={() => handleSort("availableStock")}
              >
                Stock
                <SortIcon active={sortKey === "availableStock"} dir={sortDir} />
              </TableHead>
              <TableHead
                className="text-[10px] font-bold uppercase tracking-widest text-violet-700/60 dark:text-violet-500/60 cursor-pointer select-none text-right pr-5"
                onClick={() => handleSort("totalRevenueInPeriod")}
              >
                Revenue (Period)
                <SortIcon
                  active={sortKey === "totalRevenueInPeriod"}
                  dir={sortDir}
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((product, idx) => {
              const displayIdx = startIdx + idx + 1;
            const sellPrice =
                product.discountPrice && product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;
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
                    "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors hover:bg-violet-50/20 dark:hover:bg-violet-900/5",
                    displayIdx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50/30 dark:bg-gray-800/20",
                  )}
                >
                  {/* Rank */}
                  <TableCell className="pl-5">
                    {displayIdx < 3 ? (
                      <span
                        className={cn(
                          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white",
                          displayIdx === 1
                            ? "bg-amber-500"
                            : displayIdx === 2
                              ? "bg-gray-400"
                              : "bg-orange-600",
                        )}
                      >
                        {displayIdx}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">
                        {displayIdx}
                      </span>
                    )}
                  </TableCell>

                  {/* Product + image */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
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
                      {/* Title + share bar */}
                      <div className="min-w-0">
                        <p
                          className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate max-w-40"
                          title={product.title}
                        >
                          {product.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <div className="h-1 w-14 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-1 rounded-full bg-violet-400 transition-all duration-500"
                              style={{ width: `${Math.min(share * 2, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {share}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-50">
                        ৳{sellPrice.toLocaleString()}
                      </span>
                      {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <span className="text-[10px] tabular-nums text-gray-400 line-through">
                            ৳{product.price.toLocaleString()}
                          </span>
                        )}
                    </div>
                  </TableCell>

                  {/* Sold all time */}
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700 tabular-nums dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400">
                      {product.totalSoldInPeriod.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="text-center">
                    <StockBadge stock={product.availableStock} />
                  </TableCell>

                  {/* Revenue */}
                  <TableCell className="text-right pr-5">
                    <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      ৳{product.totalRevenueInPeriod.toLocaleString()}
                    </span>
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