/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAllReviewsQuery,
  useGetReviewStatsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/features/review/review.api";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { ReviewsStats } from "./ReviewsStats";
import { ReviewsFilters } from "./ReviewsFilters";
import { ReviewsTable } from "./ReviewsTable";
import { ReviewFormDialog } from "./ReviewFormDialog";
import { ReviewDetailsDialog } from "./ReviewDetailsDialog";
import { ReviewDeleteDialog } from "./ReviewDeleteDialog";
import { IReview } from "@/types/types.review";
import TablePagination from "@/components/shared/TablePagination";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";

export function ReviewsPageClient() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);

  const limit = 10;

  // Queries
  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetAllReviewsQuery({
      page,
      limit,
      ...(searchTerm && { searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(sourceFilter && { reviewSource: sourceFilter }),
    });

  const { data: statsData, isLoading: statsLoading } = useGetReviewStatsQuery();
  const { data: productsData } = useGetAllProductsQuery({limit: 1000});

  // Mutations
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [approveReview] = useApproveReviewMutation();
  const [rejectReview] = useRejectReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Handlers
  const handleCreateReview = async (data: any) => {
    try {
      const res = await createReview(data).unwrap();
      if (res) {
        toast.success("Review created successfully");
        setOpenFormDialog(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create review");
    }
  };

  const handleUpdateReview = async (data: any) => {
    if (!editingReview) return;
    try {
      const res = await updateReview({
        id: editingReview._id,
        data,
      }).unwrap();
      if (res) {
        toast.success("Review updated successfully");
        setOpenFormDialog(false);
        setEditingReview(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update review");
    }
  };

  const handleApproveReview = async (review: IReview) => {
    try {
      await approveReview(review._id).unwrap();
      toast.success("Review approved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve review");
    }
  };

  const handleRejectReview = async (review: IReview) => {
    try {
      await rejectReview(review._id).unwrap();
      toast.success("Review rejected successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject review");
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview(selectedReview._id).unwrap();
      toast.success("Review deleted successfully");
      setOpenDeleteDialog(false);
      setSelectedReview(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review");
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (editingReview) {
      await handleUpdateReview(formData);
    } else {
      await handleCreateReview(formData);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSourceFilter("");
    setPage(1);
  };

  const handleOpenForm = (review?: IReview) => {
    if (review) {
      setEditingReview(review);
    } else {
      setEditingReview(null);
    }
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => {
    setOpenFormDialog(false);
    setEditingReview(null);
  };

  if (reviewsLoading && !reviewsData) {
    return <DashboardManagementPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Management
        </h1>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-amber-600 hover:cursor-pointer hover:bg-amber-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Review
        </Button>
      </div>

      {/* Statistics */}
      <ReviewsStats stats={statsData?.data} isLoading={statsLoading} />

      {/* Filters */}
      <ReviewsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        onReset={handleReset}
      />

      {/* Table */}
      <ReviewsTable
        reviews={reviewsData?.data || []}
        isLoading={reviewsLoading}
        onView={(review) => {
          setSelectedReview(review);
          setOpenDetailsDialog(true);
        }}
        onEdit={(review) => {
          handleOpenForm(review);
        }}
        onDelete={(review) => {
          setSelectedReview(review);
          setOpenDeleteDialog(true);
        }}
        onApprove={handleApproveReview}
        onReject={handleRejectReview}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={reviewsData?.meta?.totalPage || 1}
        onPageChange={setPage}
      />

      {/* Dialogs */}
      <ReviewFormDialog
        open={openFormDialog}
        onOpenChange={handleCloseForm}
        review={editingReview}
        products={productsData?.data || []}
        onSubmit={handleFormSubmit}
      />

      <ReviewDetailsDialog
        open={openDetailsDialog}
        onOpenChange={setOpenDetailsDialog}
        review={selectedReview}
      />

      <ReviewDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        review={selectedReview}
        onConfirm={handleDeleteReview}
      />
    </div>
  );
}
