/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  useGetAllCategoriesQuery,
  useTrashUpdateCategoryMutation,
} from "@/redux/features/category/category.api";


import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import CategoryToolbar from "@/components/dashboard/category/CategoryToolbar";
import CategoryDetailsModal from "@/components/dashboard/category/CategoryDetailsModal";
import { ICategory } from "@/types";
import UpdateCategoryModal from "@/components/dashboard/category/UpdateCategoryModal";

const CategoryManagement = () => {
  const [trashCategory] = useTrashUpdateCategoryMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});


  const { data, isLoading, isError } = useGetAllCategoriesQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  // Modal states
  const [selectedCategory, setSelectedCategory] = React.useState<ICategory | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);

  const [categoryToUpdate, setCategoryToUpdate] = React.useState<ICategory | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [categoryToDelete, setCategoryToDelete] = React.useState<ICategory | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);


  // ✅ Trash handler
  const handleDelete = async (Data: ICategory) => {
    try {
      const res = await trashCategory({ _id: Data._id as string }).unwrap();
      if (res.success) {
        toast.success("Product moved to trash");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };


  // Table columns
  const columns: ColumnDef<ICategory>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "productCount", header: "Product Count" ,
      cell: ({ row }) => row.original.productCount ?? 0,
    },
    { accessorKey: "status", header: "Status" },
  ];

  // Row actions
  const actions = [
    {
      label: "View",
      onClick: (category: ICategory) => {
        setSelectedCategory(category);
        setOpenViewModal(true);
      },
    },
    {
      label: "Edit",
      onClick: (category: ICategory) => {
        setCategoryToUpdate(category);
        setOpenUpdateModal(true);
      },
    },
    {
      label: "Delete",
      onClick: (category: ICategory) => {
        setCategoryToDelete(category);
        setOpenDeleteAlert(true);
      },
    },
  ];

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError) return <p>Error loading categories.</p>;

  return (
    <div>
      <DashboardPageHeader title="Category Management" />

      <CategoryToolbar
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
      {selectedCategory && (
        <CategoryDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          category={selectedCategory}
        />
      )}

      {/* Update Modal */}
      {categoryToUpdate && (
        <UpdateCategoryModal
          open={openUpdateModal}
          onOpenChange={setOpenUpdateModal}
          category={categoryToUpdate}
        />
      )}

      {/* Delete Confirmation */}
      {categoryToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to delete "${categoryToDelete.title}"? This action is permanent and cannot be undone.`}
          onConfirm={async () => {
            await handleDelete(categoryToDelete);
            setOpenDeleteAlert(false);
            setCategoryToDelete(null);
          }}
          actionType={"delete"}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
