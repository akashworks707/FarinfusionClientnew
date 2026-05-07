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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useDeleteUserMutation,
  useGetAllTrashCustomersQuery,
  useTrashUpdateCustomerMutation,
} from "@/redux/features/user/user.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import BreadCrumbPage from "@/components/shared/BreadCrumbPage";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import DateFilter from "@/components/shared/DateFilter";

const TrashCustomer = () => {
  // Search + sort + pagination
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data, isLoading } = useGetAllTrashCustomersQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  const customers: any[] = data?.data || [];

  const [restoreUser] = useTrashUpdateCustomerMutation();
  const [deleteUser] = useDeleteUserMutation();

  // ✅ Alert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"restore" | "delete">("delete");

  const openAlert = (id: string, type: "restore" | "delete") => {
    setSelectedId(id);
    setActionType(type);
    setAlertOpen(true);
  };

  // ✅ Restore
  const handleRestore = async () => {
    if (!selectedId) return;

    try {
      const res = await restoreUser({ _id: selectedId }).unwrap();
      if (res.success) {
        toast.success("Customer restored successfully");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Restore failed");
    } finally {
      setAlertOpen(false);
    }
  };

  // ❌ Permanent Delete
  const handleHardDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await deleteUser(selectedId).unwrap();
      if (res.success) {
        toast.success("Customer permanently deleted");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    } finally {
      setAlertOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <BreadCrumbPage
        BreadcrumbTitle={"Customer Management"}
        BreadCrumbLink={"/staff/dashboard/admin/customer-management"}
        BreadCrumbPage={"Customer Trash"}
      />

      {/* Header Info */}
      <div className="bg-linear-to-r from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
        <p className="text-sm text-red-900 dark:text-red-100">
          <span className="font-semibold">Total Trashed Customers:</span>{" "}
          {data?.meta?.total || 0}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchForm onSearchChange={setSearchTerm} />
        <Sort onChange={setSort} />
        <DateFilter onChange={setDateRange} />
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
        <Table>
          <TableHeader className="bg-linear-to-r from-red-50 to-red-50/50 dark:from-red-950/30 dark:to-red-950/10">
            <TableRow className="border-b border-red-200 dark:border-red-900/30 hover:bg-transparent">
              <TableHead className="text-red-900 dark:text-red-100 font-bold">
                Name
              </TableHead>
              <TableHead className="text-red-900 dark:text-red-100 font-bold">
                Email
              </TableHead>
              <TableHead className="text-red-900 dark:text-red-100 font-bold">
                Phone
              </TableHead>
              <TableHead className="text-red-900 dark:text-red-100 font-bold">
                Status
              </TableHead>
              <TableHead className="text-right text-red-900 dark:text-red-100 font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Loading customers...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : customers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-12 w-12 text-gray-300 dark:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3.914a.5.5 0 01-.5-.5V5.414a.5.5 0 01.5-.5h10.172a.5.5 0 01.5.5v15.086a.5.5 0 01-.5.5z"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400">
                      No trashed customers found
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.phone}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-red-50/20 dark:hover:bg-red-950/10 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white">
                    {customer.fullName}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {customer.email}
                  </TableCell>
                  <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                    {customer.phone || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200">
                      Deleted
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        {/* Restore */}
                        <DropdownMenuItem
                          onClick={() => openAlert(customer.phone, "restore")}
                          className="cursor-pointer gap-2"
                        >
                          <RotateCcw className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>Restore</span>
                        </DropdownMenuItem>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                        {/* Delete Forever */}
                        <DropdownMenuItem
                          onClick={() => openAlert(customer.phone, "delete")}
                          className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Forever</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      {/* ✅ Alert */}
      <DeleteAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        description={
          actionType === "delete"
            ? "This action will permanently delete the customer. Are you sure?"
            : "Are you sure you want to restore this customer?"
        }
        onConfirm={actionType === "delete" ? handleHardDelete : handleRestore}
        actionType={actionType}
      />
    </div>
  );
};

export default TrashCustomer;
