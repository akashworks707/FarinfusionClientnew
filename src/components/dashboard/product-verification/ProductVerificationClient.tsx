/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetAllProductVerificationsQuery,
  useCreateProductVerificationMutation,
  useUpdateProductVerificationMutation,
  useDeleteProductVerificationMutation,
} from "@/redux/features/productVerification/productVerification.api";
import {
  IProductVerification,
  IProductVerificationFormData,
  PaginationParams,
} from "@/types/productVerification";
import { ITEMS_PER_PAGE } from "@/lib/constants/productVerification";

import { ProductVerificationHeader } from "./ProductVerificationHeader";
import { ProductVerificationStats } from "./ProductVerificationStats";
import { ProductVerificationFilters } from "./ProductVerificationFilters";
import { ProductVerificationTable } from "./ProductVerificationTable";
import { ProductVerificationCard } from "./ProductVerificationCard";
import { ProductVerificationForm } from "./ProductVerificationForm";
import { ProductVerificationDetailsModal } from "./ProductVerificationDetailsModal";
import { ProductVerificationDeleteDialog } from "./ProductVerificationDeleteDialog";
import { ProductVerificationTableSkeleton } from "./ProductVerificationSkeleton";
import { EmptyState } from "./EmptyState";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ProductVerificationClient() {
  // State Management
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [featured, setFeatured] = useState<boolean | "">("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<
    IProductVerification | undefined
  >();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<
    IProductVerification | undefined
  >();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toDeleteData, setToDeleteData] = useState<
    IProductVerification | undefined
  >();

  // Build Query Params
  const queryParams: PaginationParams = {
    page,
    limit: ITEMS_PER_PAGE,
    ...(searchTerm && { searchTerm }),
    ...(status && { status: status as any }),
    ...(mediaType && { mediaType: mediaType as any }),
    ...(featured !== "" && { featured: featured as boolean }),
  };

  // RTK Query Hooks
  const {
    data: listData,
    isLoading: listLoading,
    isFetching,
  } = useGetAllProductVerificationsQuery(queryParams);
  const [createMutation, { isLoading: createLoading }] =
    useCreateProductVerificationMutation();
  const [updateMutation, { isLoading: updateLoading }] =
    useUpdateProductVerificationMutation();
  const [deleteMutation] = useDeleteProductVerificationMutation();

  // Calculate Stats
  const stats = useMemo(() => {
    if (!listData?.data?.data) {
      return {
        total: 0,
        published: 0,
        draft: 0,
        featured: 0,
        totalViews: 0,
      };
    }

    const allData: IProductVerification[] = listData?.data?.data;
    return {
      total: listData.meta?.total || allData.length,
      published: allData.filter((item) => item.status === "PUBLISHED").length,
      draft: allData.filter((item) => item.status === "DRAFT").length,
      featured: allData.filter((item) => item.featured).length,
      totalViews: allData.reduce((sum, item) => sum + item.views, 0),
    };
  }, [listData]);

  // Handlers
  const handleCreate = () => {
    setEditingData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (data: IProductVerification) => {
    setEditingData(data);
    setFormOpen(true);
  };

  const handleView = (data: IProductVerification) => {
    setSelectedData(data);
    setDetailsOpen(true);
  };

  const handleDelete = (data: IProductVerification) => {
    setToDeleteData(data);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: IProductVerificationFormData) => {
    try {
      if (editingData) {
        const result = await updateMutation({
          id: editingData._id,
          data,
        }).unwrap();
        if (result.success) {
          toast.success("Verification updated successfully");
          setFormOpen(false);
        }
      } else {
        const result = await createMutation(data).unwrap();
        if (result.success) {
          toast.success("Verification created successfully");
          setFormOpen(false);
        }
      }
      setFormOpen(false);
      setPage(1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save verification");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDeleteData) return;

    try {
      setDeleteLoading(true);
      const result = await deleteMutation(toDeleteData._id).unwrap();
      if (result.success) {
        toast.success("Verification deleted successfully");
        setDeleteOpen(false);
        setToDeleteData(undefined);
        if (page > 1 && listData?.data?.length === 1) {
          setPage(page - 1);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete verification");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatus("");
    setMediaType("");
    setFeatured("");
    setPage(1);
  };

  // Render
  const totalPages = listData?.meta?.totalPage || 1;
  const isEmpty =
    !listLoading &&
    (!listData?.data?.data || listData.data?.data?.length === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProductVerificationHeader
        onCreate={handleCreate}
        isLoading={createLoading}
      />

      {/* Statistics */}
      <ProductVerificationStats
        data={stats}
        isLoading={listLoading && !listData}
      />

      {/* Filters */}
      <ProductVerificationFilters
        onSearchChange={setSearchTerm}
        onStatusChange={setStatus}
        onMediaTypeChange={setMediaType}
        onFeaturedChange={setFeatured}
        onReset={handleReset}
        isLoading={listLoading}
      />

      {/* Table View */}
      {listLoading && !listData ? (
        <ProductVerificationTableSkeleton />
      ) : isEmpty ? (
        <EmptyState
          onAction={handleCreate}
          actionLabel="Create First Resource"
        />
      ) : (
        <>
          <ProductVerificationTable
            data={listData?.data?.data || []}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isFetching}
          />

          {/* Card View for Mobile */}
          <div className="space-y-4">
            {(listData?.data?.data || []).map((item: IProductVerification) => (
              <ProductVerificationCard
                key={item._id}
                data={item}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isVisible =
                      pageNum <= 3 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - page) <= 1;

                    if (!isVisible) {
                      if (pageNum === 4 && page > 3) return null;
                      if (pageNum === totalPages - 1 && page < totalPages - 2)
                        return null;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <ProductVerificationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingData}
        onSubmit={handleFormSubmit}
        isLoading={createLoading || updateLoading}
      />

      {/* Details Modal */}
      <ProductVerificationDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        data={selectedData}
      />

      {/* Delete Dialog */}
      <ProductVerificationDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        data={toDeleteData}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
      />
    </div>
  );
}
