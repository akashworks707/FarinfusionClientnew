/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { toast } from "sonner";
import {
  useGetAllCustomersQuery,
  useTrashUpdateCustomerMutation,
} from "@/redux/features/user/user.api";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import CustomerToolbar from "@/components/dashboard/customer/CustomerToolbar";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import { CustomerTable } from "@/components/dashboard/customer/CustomerTable";
import { CustomerStats } from "@/components/dashboard/customer/CustomerStats";
import CustomerDetailsModal from "./CustomerDetailsModal";

const CustomerManagement = () => {
  const [trashCustomer] = useTrashUpdateCustomerMutation();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data, isLoading, isError } = useGetAllCustomersQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] = React.useState<any>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const customers = data?.data || [];
    const totalCustomers = data?.meta?.total || 0;
    const totalOrders = customers.reduce(
      (sum: number, c: any) => sum + (c.totalOrders || 0),
      0,
    );
    const totalRevenue = customers.reduce(
      (sum: number, c: any) => sum + (c.totalSpent || 0),
      0,
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalCustomers,
      totalOrders,
      totalRevenue,
      averageOrderValue,
    };
  }, [data]);

  // Trash handler
  const handleDelete = async (customer: any) => {
    try {
      // Since customers are generated from orders, we need to delete via order API
      // For now, we'll show a message
      const res = await trashCustomer({ _id: customer?.phone });
      if (res) {
        toast.success(res?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to move customer to trash");
    }
  };

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError)
    return (
      <div className="p-6">
        <p className="text-red-600 dark:text-red-400">
          Error loading customers
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Customer Management" />

      {/* Stats Cards */}
      <CustomerStats data={stats} isLoading={isLoading} />

      {/* Toolbar */}
      <CustomerToolbar
        onSearchChange={setSearchTerm}
        onSortChange={setSort}
        onDateChange={setDateRange}
      />

      {/* Table */}
      <CustomerTable
        customers={data?.data || []}
        isLoading={isLoading}
        onView={(customer) => {
          setSelectedCustomer(customer);
          setOpenViewModal(true);
        }}
        onDelete={(customer) => {
          setCustomerToDelete(customer);
          setOpenDeleteAlert(true);
        }}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      {/* View Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          user={{
            name: selectedCustomer.fullName,
            email: selectedCustomer.email,
            phone: selectedCustomer.phone,
            address: selectedCustomer.address,
            customOrderIds: selectedCustomer.customOrderIds,
            totalOrders: selectedCustomer.totalOrders,
            totalSpent: selectedCustomer.totalSpent,
          }}
        />
      )}

      {/* Delete Confirmation */}
      {customerToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to move ${customerToDelete.fullName} to trash? All related data will be moved.`}
          onConfirm={async () => {
            await handleDelete(customerToDelete);
            setOpenDeleteAlert(false);
            setCustomerToDelete(null);
          }}
          actionType="delete"
        />
      )}
    </div>
  );
};

export default CustomerManagement;
