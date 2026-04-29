"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import type { ICoupon } from "@/redux/features/coupon/coupon.api";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: ICoupon | null;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  coupon,
  isLoading,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Delete coupon error:", error);
    }
  };

  if (!coupon) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl bg-linear-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <AlertDialogHeader className="text-center space-y-2">
          <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Delete Coupon?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Are you sure you want to permanently delete the coupon:
            </p>
            <p className="font-mono font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg inline-block">
              {coupon.code}
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              This action cannot be undone. All associated data will be lost.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Stats about coupon being deleted */}
        <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Used
            </p>
            <p className="text-lg font-bold text-red-900 dark:text-red-100">
              {coupon.usedCount ?? 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Limit
            </p>
            <p className="text-lg font-bold text-red-900 dark:text-red-100">
              {coupon.usageLimit ?? "∞"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <AlertDialogCancel
            disabled={isLoading}
            className="hover:cursor-pointer flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Keep Coupon
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="hover:cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin">⟳</span>
                Deleting...
              </span>
            ) : (
              "Delete Permanently"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
