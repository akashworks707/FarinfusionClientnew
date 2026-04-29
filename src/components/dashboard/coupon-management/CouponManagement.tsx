/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import {
  Tag,
  Plus,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Percent,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Users,
  ShoppingBag,
  AlertTriangle,
  Package,
  Edit2,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  type ICoupon,
} from "@/redux/features/coupon/coupon.api";
import { CreateCouponModal } from "./CreateCouponModal";
import { EditCouponModal, type EditCouponFormData } from "./EditCouponModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LIMIT = 10;

function isExpired(expiryDate: string): boolean {
  return new Date() > new Date(expiryDate);
}

function isExpiringRoon(expiryDate: string): boolean {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function usagePercent(usedCount = 0, usageLimit = 1) {
  if (!usageLimit) return 0;
  return Math.min(Math.round((usedCount / usageLimit) * 100), 100);
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

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      title="Copy code"
      className="ml-1 rounded p-0.5 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl bg-amber-50/60 dark:bg-amber-900/10"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

export default function CouponManagement() {
  const [localSearch, setLocalSearch] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | "active" | "inactive" | "expired"
  >("");
  const [page, setPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const { data, isLoading, isError, refetch } = useGetAllCouponsQuery({
    page,
    limit: LIMIT,
    ...(search.trim() && { searchTerm: search.trim() }),
    sort: "-createdAt",
  });

  const allCoupons: ICoupon[] = data?.data ?? [];
  const meta = data?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.ceil(totalCount / LIMIT);

  const filteredCoupons = allCoupons.filter((c) => {
    if (!statusFilter) return true;
    if (statusFilter === "expired") return isExpired(c.expiryDate);
    if (statusFilter === "active")
      return c.isActive && !isExpired(c.expiryDate);
    if (statusFilter === "inactive")
      return !c.isActive && !isExpired(c.expiryDate);
    return true;
  });

  const activeCount = allCoupons.filter(
    (c) => c.isActive && !isExpired(c.expiryDate),
  ).length;
  const expiredCount = allCoupons.filter((c) => isExpired(c.expiryDate)).length;
  const totalUsed = allCoupons.reduce((s, c) => s + (c.usedCount ?? 0), 0);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setPage(1);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const handleEditClick = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setEditOpen(true);
  };

  const handleDeleteClick = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async (formData: EditCouponFormData) => {
    if (!selectedCoupon) return;
    try {
      const result = await updateCoupon({
        id: selectedCoupon._id,
        ...formData,
      }).unwrap();
      if (result.success) {
        toast.success("Coupon updated successfully!");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update coupon");
      console.error("Update coupon error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCoupon) return;
    try {
      const result = await deleteCoupon({
        id: selectedCoupon._id,
      }).unwrap();
      if (result.success) {
        toast.success("Coupon deleted successfully!");
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete coupon");
      console.error("Delete coupon error:", error);
    }
  };

  const hasFilters = !!search || !!statusFilter;

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-3xl">
              Coupons
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Create and manage discount codes for customer orders
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="hover:cursor-pointer group gap-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 relative overflow-hidden transition-all duration-200 active:scale-95 shrink-0"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
          />
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Coupon</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Coupons"
          value={totalCount}
          icon={Tag}
          accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={CheckCircle2}
          sub={`${totalCount ? Math.round((activeCount / totalCount) * 100) : 0}% of total`}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        />
        <StatCard
          label="Expired"
          value={expiredCount}
          icon={Clock}
          accent={
            expiredCount > 0
              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }
        />
        <StatCard
          label="Total Uses"
          value={totalUsed}
          icon={Users}
          sub="across all coupons"
          accent="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
        />
      </div>

      {/* ── Filters ── */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Search by code */}
          <div className="relative flex-1 min-w-50">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by coupon code…"
              value={localSearch}
              onChange={handleSearchInput}
              className="h-10 pl-9 pr-9 rounded-xl border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors font-mono tracking-wider"
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex shrink-0 items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => {
                setStatusFilter(v === "all" ? "" : (v as any));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-40 rounded-xl border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="cursor-pointer text-sm">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="inactive" className="cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 text-gray-400" />
                    Inactive
                  </div>
                </SelectItem>
                <SelectItem value="expired" className="cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-red-400" />
                    Expired
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="group h-10 shrink-0 gap-1.5 rounded-xl border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
              Reset
            </Button>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {filteredCoupons.length} coupon
              {filteredCoupons.length !== 1 ? "s" : ""} matching filters
            </span>
            {search && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
              >
                <Search className="h-3 w-3" />
                &quot;{search}&quot;
                <button
                  onClick={clearSearch}
                  className="ml-0.5 hover:text-amber-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {statusFilter && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  statusFilter === "active"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : statusFilter === "expired"
                      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
                )}
              >
                {statusFilter === "active" && (
                  <CheckCircle2 className="h-3 w-3" />
                )}
                {statusFilter === "expired" && <Clock className="h-3 w-3" />}
                {statusFilter === "inactive" && <XCircle className="h-3 w-3" />}
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button onClick={() => setStatusFilter("")} className="ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex items-center gap-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
              <Tag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Failed to load coupons
              </p>
              <button
                onClick={() => refetch()}
                className="text-xs text-red-500 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
              <Tag className="h-8 w-8 text-amber-300 dark:text-amber-800" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No coupons found
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Create your first coupon with the button above
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-100/80 bg-amber-50/50 dark:border-amber-900/20 dark:bg-amber-900/5">
                  {[
                    { label: "Code", cls: "pl-5 min-w-[140px]" },
                    { label: "Type & Value", cls: "" },
                    {
                      label: "Min Order",
                      cls: "text-right hidden sm:table-cell",
                    },
                    { label: "Usage", cls: "text-center" },
                    { label: "Expiry", cls: "hidden md:table-cell" },
                    { label: "Status", cls: "hidden sm:table-cell" },
                    { label: "Actions", cls: "text-center pr-5 min-w-[120px]" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={cn(
                        "py-3 px-3 text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60",
                        col.cls,
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon, idx) => {
                  const expired = isExpired(coupon.expiryDate);
                  const expiringSoon =
                    !expired && isExpiringRoon(coupon.expiryDate);
                  const used = coupon.usedCount ?? 0;
                  const limit = coupon.usageLimit ?? 1;
                  const pct = usagePercent(used, limit);
                  const exhausted = used >= limit;

                  return (
                    <tr
                      key={coupon._id}
                      className={cn(
                        "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors duration-100",
                        idx % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-amber-50/10 dark:bg-amber-900/5",
                        "hover:bg-amber-50/40 dark:hover:bg-amber-900/10",
                      )}
                    >
                      {/* Code */}
                      <td className="px-3 pl-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <code className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-sm font-bold tracking-widest text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            {coupon.code}
                          </code>
                          <CopyCodeButton code={coupon.code} />
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                          Created {formatDate(coupon.createdAt ?? "")}
                        </p>
                      </td>

                      {/* Type & Value */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                              coupon.discountType === "PERCENT"
                                ? "bg-amber-50 dark:bg-amber-900/20"
                                : "bg-emerald-50 dark:bg-emerald-900/20",
                            )}
                          >
                            {coupon.discountType === "PERCENT" ? (
                              <Percent className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-50 tabular-nums">
                              {coupon.discountType === "PERCENT"
                                ? `${coupon.discountValue}%`
                                : `৳${coupon.discountValue}`}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">
                              {coupon.discountType === "PERCENT"
                                ? "Percentage"
                                : "Fixed"}
                              {coupon.maxDiscount
                                ? ` · max ৳${coupon.maxDiscount}`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Min order */}
                      <td className="px-3 py-3.5 text-right hidden sm:table-cell">
                        <span className="text-sm tabular-nums font-medium text-gray-700 dark:text-gray-300">
                          {coupon.minOrderAmount ? (
                            `৳${coupon.minOrderAmount}`
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={cn(
                              "text-xs font-bold tabular-nums",
                              exhausted
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-700 dark:text-gray-300",
                            )}
                          >
                            {used} / {limit}
                          </span>
                          <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                exhausted
                                  ? "bg-red-500"
                                  : pct >= 80
                                    ? "bg-orange-500"
                                    : "bg-amber-500",
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          {expiringSoon && (
                            <AlertTriangle className="h-3 w-3 shrink-0 text-orange-400" />
                          )}
                          <span
                            className={cn(
                              "text-xs tabular-nums",
                              expired
                                ? "text-red-500 dark:text-red-400 font-semibold"
                                : expiringSoon
                                  ? "text-orange-500 dark:text-orange-400 font-semibold"
                                  : "text-gray-500 dark:text-gray-400",
                            )}
                          >
                            {formatDate(coupon.expiryDate)}
                          </span>
                        </div>
                        {expired && (
                          <p className="mt-0.5 text-[10px] font-semibold text-red-500 dark:text-red-400">
                            Expired
                          </p>
                        )}
                        {expiringSoon && (
                          <p className="mt-0.5 text-[10px] font-semibold text-orange-500 dark:text-orange-400">
                            Expiring soon
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        {expired ? (
                          <Badge
                            variant="outline"
                            className="rounded-full border-red-200 bg-red-50 text-[10px] font-bold text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                          >
                            <Clock className="mr-1 h-2.5 w-2.5" />
                            Expired
                          </Badge>
                        ) : exhausted ? (
                          <Badge
                            variant="outline"
                            className="rounded-full border-orange-200 bg-orange-50 text-[10px] font-bold text-orange-600 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                          >
                            <Package className="mr-1 h-2.5 w-2.5" />
                            Exhausted
                          </Badge>
                        ) : coupon.isActive ? (
                          <Badge
                            variant="outline"
                            className="rounded-full border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                          >
                            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="rounded-full border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          >
                            <XCircle className="mr-1 h-2.5 w-2.5" />
                            Inactive
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5 text-center pr-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(coupon)}
                            title="Edit coupon"
                            className="group relative p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors hover:shadow-sm active:scale-90"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(coupon)}
                            title="Delete coupon"
                            className="group relative p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors hover:shadow-sm active:scale-90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage((p) => p - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className={cn(
                        "cursor-pointer",
                        page === pageNum &&
                          "border-amber-400 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/20",
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage((p) => p + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-600/70 dark:text-amber-500/70">
          How Coupons Work
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs text-amber-700/80 dark:text-amber-400/80">
          <div className="flex items-start gap-2">
            <Percent className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>PERCENT</strong> — subtracts a % from order total. Set Max
              Discount to cap the saving.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>FIXED</strong> — subtracts a flat ৳ amount from order
              total.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShoppingBag className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Min Order</strong> — customer&apos;s cart must reach this
              amount before coupon applies.
            </span>
          </div>
        </div>
      </div>

      <CreateCouponModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={refetch}
      />

      <EditCouponModal
        open={editOpen}
        onOpenChange={setEditOpen}
        coupon={selectedCoupon}
        isLoading={isUpdating}
        onSubmit={handleEditSubmit}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        coupon={selectedCoupon}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
