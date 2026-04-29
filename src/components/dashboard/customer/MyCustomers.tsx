/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGetMyCustomersQuery,
  useTrashUpdateCustomerMutation,
} from "@/redux/features/user/user.api";
import { IUser } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import React from "react";

import UserDetailsModal from "@/components/dashboard/user/UserDetailsModal";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import CustomerToolbar from "@/components/dashboard/customer/CustomerToolbar";

const MyCustomers = () => {
  const [trashCustomer] = useTrashUpdateCustomerMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;


  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});



  const { data, isLoading, isError } = useGetMyCustomersQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  // Modal states
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<IUser | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  const handleDelete = async (Data: IUser) => {
    try {
      const res = await trashCustomer({ _id: Data._id as string }).unwrap();
      if (res.success) {
        toast.success("Product moved to trash");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  // Columns
  const columns: ColumnDef<IUser>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "", header: "Order" },
  ];

  // Actions
  const actions = [
    {
      label: "View",
      onClick: (user: IUser) => {
        setSelectedUser(user);
        setOpenViewModal(true);
      },
    },
    // {
    //   label: "Edit",
    //   onClick: (user: IUser) => {
    //     setSelectedUser(user);
    //     setOpenViewModal(true);
    //   },
    // },
    {
      label: "Delete",
      onClick: (user: IUser) => {
        setUserToDelete(user);
        setOpenDeleteAlert(true);
      },
    },
  ];

  <DynamicDataTable
    columns={columns}
    data={data?.data ?? []}
    actions={actions}
  />;

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError) return <p>Error loading users.</p>;

  return (
    <div>
      <DashboardPageHeader title="My Customers" />
      <CustomerToolbar onSearchChange={setSearchTerm} onSortChange={setSort} onDateChange={setDateRange} />
      <DynamicDataTable
        columns={columns}
        data={data?.data ?? []}
        actions={actions}
      />
      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      {/* View Modal */}
      {selectedUser && (
        <UserDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          user={selectedUser}
        />
      )}

      {/* Delete Confirmation */}
      {userToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to delete ${userToDelete.name}? This action is permanent and cannot be undone.`}
          onConfirm={async () => {
            await handleDelete(userToDelete);
            setOpenDeleteAlert(false);
            setUserToDelete(null);
          }}
          actionType={"delete"}
        />
      )}
    </div>
  );
};

export default MyCustomers;
