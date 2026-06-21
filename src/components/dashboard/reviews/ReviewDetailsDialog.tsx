"use client";

import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IReview } from "@/types/types.review";
import { ReviewStatusBadge as Badge } from "./ReviewStatusBadge";
import Image from "next/image";

interface ReviewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: IReview | null;
}

export function ReviewDetailsDialog({
  open,
  onOpenChange,
  review,
}: ReviewDetailsDialogProps) {
  if (!review) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-amber-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Complete information about this review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/20">
            <h3 className="font-semibold mb-2">Product</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {review.product?.title}
            </p>
          </div>

          {/* Review Image */}
          {review.reviewImage && (
            <div>
              <h3 className="font-semibold mb-2">Review Image</h3>
              <Image
                width={500}
                height={500}
                priority
                quality={90}
                src={review.reviewImage}
                alt="Review"
                className="max-w-sm h-auto rounded-lg"
              />
            </div>
          )}

          {/* Customer & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Name</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm">{review.customerName}</p>
                <button
                  onClick={() => copyToClipboard(review.customerName)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Rating</h3>
              {renderStars(review.rating)}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <h3 className="font-semibold mb-2">Review Text</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-900 p-3 rounded">
              {review.reviewText}
            </p>
          </div>

          {/* Source & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Review Source</h3>
              <p className="text-sm bg-blue-50 dark:bg-blue-950/20 p-2 rounded inline-block">
                {review.reviewSource}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <Badge status={review?.status || ""} />
            </div>
          </div>

          {/* Created Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">Created By</h3>
              <p>{review.createdBy?.name || "System"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Created At</h3>
              <p>{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
