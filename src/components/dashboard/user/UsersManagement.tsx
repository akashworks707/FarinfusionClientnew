/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useGetAllUsersQuery,
  useTrashUpdateUserMutation,
} from "@/redux/features/user/user.api";
import { IBrand, IUser } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import React from "react";

import UserToolbar from "@/components/dashboard/user/UserToolbar";
import UserDetailsModal from "@/components/dashboard/user/UserDetailsModal";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import UpdateUserModal from "./UpdateUserModal";
import ChangePasswordModal from "./ChangePasswordModal";
import StaffManagementStats from "./StaffManagementStats";

const UsersManagement = () => {
  const [trashUser] = useTrashUpdateUserMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  // Calculate stats
  const users = data?.data ?? [];
  const totalUsers = data?.meta?.total ?? 0;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const newHires = users.filter((u) => {
    const createdDate = new Date(u?.createdAt ?? "");
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return createdDate > monthAgo;
  }).length;
  const pendingApprovals = users.filter((u) => u.status === "pending").length;

  // Modal states
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openPasswordModal, setOpenPasswordModal] = React.useState(false);
  const [userToUpdate, setUserToUpdate] = React.useState<IUser | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<IUser | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Trash handler
  const handleDelete = async (Data: IUser) => {
    try {
      const res = await trashUser({ _id: Data._id as string }).unwrap();
      if (res.success) {
        toast.success("Moved to trash");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Trash");
    }
  };

  // Columns
  const columns: ColumnDef<IUser>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
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
    {
      label: "Edit",
      onClick: (user: IUser) => {
        setUserToUpdate(user);
        setOpenUpdateModal(true);
      },
    },
    {
      label: "Change Password",
      onClick: (user: IUser) => {
        setUserToUpdate(user);
        setOpenPasswordModal(true);
      },
    },
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
    <div className="space-y-6">
      <DashboardPageHeader title="Staff Management" />

      {/* Stats Section */}
      <StaffManagementStats
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        newHires={newHires}
        pendingApprovals={pendingApprovals}
        loading={isLoading}
      />

      {/* Filters and Table */}
      <div className="space-y-4">
        <UserToolbar
          onSearchChange={setSearchTerm}
          onSortChange={setSort}
          refetch={refetch}
          onDateChange={setDateRange}
        />
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
      </div>

      {userToUpdate && (
        <ChangePasswordModal
          open={openPasswordModal}
          onOpenChange={setOpenPasswordModal}
          user={userToUpdate}
        />
      )}

      {/* View Modal */}
      {selectedUser && (
        <UserDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          user={selectedUser}
        />
      )}

      {/* Update Modal */}
      {userToUpdate && (
        <UpdateUserModal
          open={openUpdateModal}
          refetch={refetch}
          onOpenChange={setOpenUpdateModal}
          user={userToUpdate}
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

export default UsersManagement;
