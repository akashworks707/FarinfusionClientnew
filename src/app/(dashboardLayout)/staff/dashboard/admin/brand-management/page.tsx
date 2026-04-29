/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  useGetAllBrandsQuery,
  useTrashUpdateBrandMutation,
} from "@/redux/features/brand/brand.api";

import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import BrandToolbar from "@/components/dashboard/brand/BrandToolbar";
import BrandDetailsModal from "@/components/dashboard/brand/BrandDetailsModal";
import UpdateBrandModal from "@/components/dashboard/brand/UpdateBrandModal";
import { IBrand } from "@/types";

const BrandManagementPage = () => {
  const [trashBrand] = useTrashUpdateBrandMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data, isLoading, isError } = useGetAllBrandsQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),

    page,
    limit,
  });



  // Modal states
  const [selectedBrand, setSelectedBrand] = React.useState<IBrand | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);

  const [brandToUpdate, setBrandToUpdate] = React.useState<IBrand | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [brandToDelete, setBrandToDelete] = React.useState<IBrand | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Trash handler
  const handleDelete = async (brand: IBrand) => {
    try {
      const res = await trashBrand({ _id: brand._id as string }).unwrap();
      if (res.success) {
        toast.success("Moved to trash");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to Trash");
    }
  };

  // Table columns
  const columns: ColumnDef<IBrand>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "productCount", header: "Product Count",
      cell: ({ row }) => row.original.productCount ?? 0,
    },
    { accessorKey: "status", header: "Status" },
  ];

  // Row actions
  const actions = [
    {
      label: "View",
      onClick: (brand: IBrand) => {
        setSelectedBrand(brand);
        setOpenViewModal(true);
      },
    },
    {
      label: "Edit",
      onClick: (brand: IBrand) => {
        setBrandToUpdate(brand);
        setOpenUpdateModal(true);
      },
    },
    {
      label: "Delete",
      onClick: (brand: IBrand) => {
        setBrandToDelete(brand);
        setOpenDeleteAlert(true);
      },
    },
  ];

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError) return <p>Error loading brands.</p>;

  return (
    <div>
      <DashboardPageHeader title="Brand Management" />

      <BrandToolbar
        onSearchChange={setSearchTerm}
        onSortChange={setSort}
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

      {/* View Modal */}
      {selectedBrand && (
        <BrandDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          brand={selectedBrand}
        />
      )}

      {/* Update Modal */}
      {brandToUpdate && (
        <UpdateBrandModal
          open={openUpdateModal}
          onOpenChange={setOpenUpdateModal}
          brand={brandToUpdate}
        />
      )}

      {/* Delete Confirmation */}
      {brandToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to delete "${brandToDelete.title}"? This action is permanent and cannot be undone.`}
          onConfirm={async () => {
            await handleDelete(brandToDelete);
            setOpenDeleteAlert(false);
            setBrandToDelete(null);
          }}
          actionType={"delete"}
        />
      )}
    </div>
  );
};

export default BrandManagementPage;