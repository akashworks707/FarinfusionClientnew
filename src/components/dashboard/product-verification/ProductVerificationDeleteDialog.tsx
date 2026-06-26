"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IProductVerification } from "@/types/productVerification";

interface ProductVerificationDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IProductVerification;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function ProductVerificationDeleteDialog({
  open,
  onOpenChange,
  data,
  onConfirm,
  isLoading = false,
}: ProductVerificationDeleteDialogProps) {
  if (!data) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <AlertDialogTitle>Delete Verification</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2">
            Are you sure you want to delete <strong>{data.title}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end mt-4">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
