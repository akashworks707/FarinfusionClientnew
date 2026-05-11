/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string;
  statusType: "purchase" | "payment";
  onConfirm: (newStatus: string) => Promise<void>;
}

const PURCHASE_STATUSES = [
  { value: "PENDING", label: "Pending", description: "Waiting for order" },
  { value: "ORDERED", label: "Ordered", description: "Order placed" },
  //   {
  //     value: "SHIPPED",
  //     label: "Shipped",
  //     description: "In transit to warehouse",
  //   },
  { value: "RECEIVED", label: "Received", description: "Arrived at warehouse" },
  //   { value: "COMPLETED", label: "Completed", description: "Stock updated" },
  { value: "CANCELLED", label: "Cancelled", description: "Order cancelled" },
];

const PAYMENT_STATUSES = [
  { value: "UNPAID", label: "Unpaid", description: "Payment due" },
  { value: "PARTIAL", label: "Partial", description: "Partially paid" },
  { value: "PAID", label: "Paid", description: "Payment completed" },
];

export const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  open,
  onOpenChange,
  currentStatus,
  statusType,
  onConfirm,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const statuses =
    statusType === "purchase" ? PURCHASE_STATUSES : PAYMENT_STATUSES;
  const title =
    statusType === "purchase"
      ? "Change Purchase Status"
      : "Change Payment Status";

  const currentStatusObj = statuses.find((s) => s.value === currentStatus);
  const newStatusObj = statuses.find((s) => s.value === newStatus);

  const handleConfirm = async () => {
    if (newStatus !== currentStatus) {
      try {
        setIsSubmitting(true);
        await onConfirm(newStatus);
        toast.success(`Status updated to ${newStatusObj?.label}`);
        onOpenChange(false);
      } catch (error: any) {
        toast.error(error?.message || "Failed to update status");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const isChanged = newStatus !== currentStatus;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-125">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-600 dark:text-amber-400 text-lg">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-4">
            <div className="space-y-6">
              {/* Current Status */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  Current Status
                </Label>
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-gray-50">
                    {currentStatusObj?.label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentStatusObj?.description}
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <Label
                  htmlFor="status-select"
                  className="text-sm font-semibold text-gray-900 dark:text-gray-50"
                >
                  New Status
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger
                    id="status-select"
                    className="bg-white dark:bg-slate-800 h-10"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{status.label}</span>
                          <span className="text-xs text-gray-500">
                            • {status.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* New Status Preview */}
              {isChanged && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                    Preview
                  </p>
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {newStatusObj?.label}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {newStatusObj?.description}
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting || !isChanged}
            className={`${
              isSubmitting || !isChanged ? "opacity-50 cursor-not-allowed" : ""
            } hover:cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white`}
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
