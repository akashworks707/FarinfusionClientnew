/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EyeIcon,
  MoreHorizontal,
  PencilIcon,
  ShoppingBagIcon,
  Trash2Icon,
  TrashIcon,
  UserRound,
  ArrowUpRight,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  useGetAllLeadQuery,
  useTrashUpdateLeadMutation,
} from "@/redux/features/lead/lead.api";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { LeadDetailModal } from "@/components/dashboard/leads/LeadDetailModal";
import LeadUpdateModal from "@/components/dashboard/leads/LeadUpdateModal";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import { ILead } from "@/types/lead.types";
import { toast } from "sonner";
import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import LeadAddedModal from "@/components/dashboard/leads/LeadAddedModal";
import { cn } from "@/lib/utils";
import DateFilter from "@/components/shared/DateFilter";
import FraudCheckModal from "./FraudCheckModal";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  NEW: {
    label: "New",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  CONTACTED: {
    label: "Contacted",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  QUALIFIED: {
    label: "Qualified",
    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
  },
  CONVERTED: {
    label: "Converted",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  LOST: {
    label: "Lost",
    cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

const PRIORITY_MAP: Record<
  string,
  { label: string; dot: string; badgeCls: string }
> = {
  HIGH: {
    label: "High",
    dot: "bg-red-500",
    badgeCls:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    badgeCls:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  LOW: {
    label: "Low",
    dot: "bg-emerald-500",
    badgeCls:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
};

function LeadAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const hue = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
      style={{ background: `hsl(${hue},52%,50%)` }}
    >
      {initials || <UserRound className="h-4 w-4" />}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconCls,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconCls: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-4 py-3 dark:border-gray-700/60 dark:bg-gray-900">
      <div className={cn("rounded-lg p-2", iconCls)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
          {value}
        </p>
      </div>
    </div>
  );
}

const LeadsTable: React.FC = () => {
  const router = useRouter();

  const [leadID, setLeadID] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [fraudModal, setFraudModal] = useState({
    open: false,
    phone: "",
  });

  const limit = 10;

  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data, isLoading, isError } = useGetAllLeadQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  const leadData = (data?.data as ILead[]) || [];
  const [trashLead] = useTrashUpdateLeadMutation();

  const handleTrash = async (lead: ILead) => {
    try {
      const res = await trashLead({ _id: lead._id }).unwrap();
      if (res.success) toast.success("Lead moved to trash");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete lead");
    }
  };

  const handleConfirmDelete = () => {
    if (selectedLead) handleTrash(selectedLead);
    setAlertOpen(false);
  };

  const handleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? leadData.map((l) => l._id as string) : []);

  const handleSelectOne = (id: string, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id),
    );

  const isAllSelected =
    leadData.length > 0 && selectedIds.length === leadData.length;

  const handleSell = (lead: ILead) => {
    if (lead.hasOrderedToday) {
      toast.error("This customer already placed an order today");
      return;
    }

    const params = new URLSearchParams({
      prefill: "1",
      name: lead.name ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      address: lead.address ?? "",
    });
    router.push(`/staff/dashboard/pos?${params.toString()}`);
  };

  // Stat counts
  const newCount = leadData.filter((l) => l.status === "NEW").length;
  const contactedCount = leadData.filter(
    (l) => l.status === "CONTACTED",
  ).length;
  const highPriorityCount = leadData.filter(
    (l) => l.priority === "HIGH",
  ).length;
  const totalCount = data?.meta?.total ?? leadData.length;

  return (
    <div className="space-y-5 mt-5">
      {isLoading ? (
        <DashboardManagementPageSkeleton />
      ) : isError ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Failed to load leads. Please try again.
          </p>
        </div>
      ) : (
        <>
          <DashboardPageHeader title="Leads Management" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Total"
              value={totalCount}
              icon={Users}
              iconCls="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <StatCard
              label="New"
              value={newCount}
              icon={TrendingUp}
              iconCls="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
            />
            <StatCard
              label="Contacted"
              value={contactedCount}
              icon={CheckCircle2}
              iconCls="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
            <StatCard
              label="High Priority"
              value={highPriorityCount}
              icon={AlertCircle}
              iconCls="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className={"w-full sm:w-auto"}>
                <SearchForm onSearchChange={setSearchTerm} />
              </div>
              <Sort onChange={setSort} />
              {selectedIds.length > 0 && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  {selectedIds.length} selected
                </span>
              )}
              <DateFilter onChange={setDateRange} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => router.push("/staff/dashboard/leads/trash")}
              >
                <Trash2Icon className="mr-1.5 h-3.5 w-3.5" />
                Trash
              </Button>
              <Button
                size="sm"
                className="bg-amber-600 text-white hover:cursor-pointer hover:bg-yellow-700 dark:bg-amber-700 dark:hover:bg-amber-600"
                onClick={() => setAddModalOpen(true)}
              >
                + Add Lead
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200/80 bg-gray-50/80 hover:bg-gray-50/80 dark:border-gray-700/60 dark:bg-gray-800/50 dark:hover:bg-gray-800/50">
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(c) => handleSelectAll(c === true)}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Lead
                  </TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 lg:table-cell">
                    Priority
                  </TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 xl:table-cell">
                    Added By
                  </TableHead>
                  <TableHead className="pr-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leadData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                          <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            No leads found
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Add your first lead to get started
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  leadData.map((item, idx) => {
                    const status =
                      STATUS_MAP[item.status ?? "NEW"] ?? STATUS_MAP.NEW;
                    const priority =
                      PRIORITY_MAP[item.priority ?? "MEDIUM"] ??
                      PRIORITY_MAP.MEDIUM;
                    const isSelected = selectedIds.includes(item._id as string);

                    // assignedBy may be a populated object or just an id
                    const assignedByName =
                      item.assignedBy?.name ?? item.assignedBy?.email ?? null;
                    const assignedByRole = item.assignedBy?.role ?? null;

                    return (
                      <TableRow
                        key={item._id as string}
                        className={cn(
                          "border-b border-gray-100/80 transition-colors duration-100 dark:border-gray-800/60",
                          isSelected
                            ? "bg-blue-50/70 dark:bg-blue-900/10"
                            : idx % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50/40 dark:bg-gray-800/20",
                          "hover:bg-blue-50/40 dark:hover:bg-blue-900/10",
                        )}
                      >
                        {/* Checkbox */}
                        <TableCell className="pl-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(c) =>
                              handleSelectOne(item._id as string, c === true)
                            }
                          />
                        </TableCell>

                        {/* Name + mobile info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <LeadAvatar name={item.name ?? "?"} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                                {item.name}
                              </p>
                              <p className="truncate text-[11px] text-gray-400 dark:text-gray-500 md:hidden">
                                {item.phone}
                              </p>
                              {item.hasOrderedToday && (
                                <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-red-500">
                                  ⚠ Maximum 1 order per day
                                </span>
                              )}
                              {/* Status pill on mobile */}
                              <span
                                className={cn(
                                  "mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:hidden",
                                  status.cls,
                                )}
                              >
                                {status.label}
                              </span>
                              {/* AssignedBy on mobile (xl hidden) */}
                              {assignedByName && (
                                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 xl:hidden">
                                  <UserCheck className="h-2.5 w-2.5 shrink-0" />
                                  {assignedByName}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {item.email}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {item.phone}
                            </p>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                              status.cls,
                            )}
                          >
                            {status.label}
                          </Badge>
                        </TableCell>

                        {/* Priority — colored badge with dot */}
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                              priority.badgeCls,
                            )}
                          >
                            <span
                              className={cn(
                                "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                                priority.dot,
                              )}
                            />
                            {priority.label}
                          </Badge>
                        </TableCell>

                        {/* Added By — xl+ only */}
                        <TableCell className="hidden xl:table-cell">
                          {assignedByName ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <UserCheck className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {assignedByName}
                                </p>
                                {assignedByRole && (
                                  <p className="truncate text-[10px] capitalize text-gray-400 dark:text-gray-500">
                                    {assignedByRole.toLowerCase()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs italic text-gray-400 dark:text-gray-600">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="pr-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Sell button */}
                            <button
                              // disabled={item.hasOrderedToday}
                              onClick={() => {
                                handleSell(item);
                              }}
                              className={cn(
                                "hover:cursor-pointer group relative overflow-hidden",
                                "inline-flex items-center gap-1.5 rounded-lg",
                                "bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white",
                                "transition-all duration-200",
                                "hover:bg-emerald-700 hover:shadow-[0_2px_12px_--theme(--color-emerald-500/30%)]",
                                "active:scale-95",
                                "dark:bg-emerald-700 dark:hover:bg-emerald-600",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1",
                              )}
                              aria-label={`Sell to ${item.name}`}
                            >
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/25 transition-transform duration-500 group-hover:translate-x-[200%]"
                              />
                              <ShoppingBagIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:scale-110" />
                              <span className="hidden sm:inline">Sell</span>
                              <ArrowUpRight className="-translate-x-0.5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                            </button>

                            {/* More menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  className="gap-2 text-sm"
                                  onClick={() => {
                                    setLeadID(item._id as string);
                                    setViewModalOpen(true);
                                  }}
                                >
                                  <EyeIcon className="h-3.5 w-3.5" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 text-sm"
                                  onClick={() => {
                                    setLeadID(item._id as string);
                                    setEditModalOpen(true);
                                  }}
                                >
                                  <PencilIcon className="h-3.5 w-3.5" /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="gap-2 text-sm"
                                  onClick={() => {
                                    setFraudModal({
                                      open: true,
                                      phone: item?.phone,
                                    });
                                  }}
                                >
                                  <Check className="h-3.5 w-3.5" /> Fraud Check
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-sm text-red-500 focus:text-red-500 dark:text-red-400"
                                  onClick={() => {
                                    setSelectedLead(item);
                                    setAlertOpen(true);
                                  }}
                                >
                                  <TrashIcon className="h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      <LeadDetailModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        leadId={leadID}
      />
      <LeadUpdateModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        leadId={leadID}
      />
      <LeadAddedModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      <FraudCheckModal
        open={fraudModal.open}
        defaultPhone={fraudModal.phone}
        onClose={() => setFraudModal({ open: false, phone: "" })}
      />

      <DeleteAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        description={
          selectedLead
            ? `Are you sure you want to delete "${selectedLead.name}"?`
            : "Are you sure?"
        }
        onConfirm={handleConfirmDelete}
        actionType={"delete"}
      />
    </div>
  );
};

export default LeadsTable;