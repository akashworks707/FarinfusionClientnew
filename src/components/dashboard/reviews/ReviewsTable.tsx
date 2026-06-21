"use client"

import { MoreHorizontal, Edit2, Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IReview, ReviewStatus } from "@/types/types.review";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

interface ReviewsTableProps {
  reviews: IReview[];
  isLoading: boolean;
  onView: (review: IReview) => void;
  onEdit: (review: IReview) => void;
  onDelete: (review: IReview) => void;
  onApprove?: (review: IReview) => void;
  onReject?: (review: IReview) => void;
}

export function ReviewsTable({
  reviews,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: ReviewsTableProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review._id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
              <TableCell className="font-medium">
                {review.customerName}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {review.product?.title}
              </TableCell>
              <TableCell>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating
                          ? "text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <ReviewStatusBadge status={review?.status || ""} />
              </TableCell>
              <TableCell className="text-sm">
                <span className="bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded">
                  {review.reviewSource}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(review)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(review)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>

                    {review.status === ReviewStatus.PENDING && (
                      <>
                        <DropdownMenuSeparator />
                        {onApprove && (
                          <DropdownMenuItem
                            onClick={() => onApprove(review)}
                            className="text-green-600 dark:text-green-400"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {onReject && (
                          <DropdownMenuItem
                            onClick={() => onReject(review)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        )}
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(review)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
