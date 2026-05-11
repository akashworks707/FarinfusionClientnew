"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import type { Order } from "@/types/orders";

interface CancelOrderModalProps {
  open: boolean;
  order: Order | null;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export function CancelOrderModal({
  open,
  order,
  isLoading = false,
  onCancel,
  onConfirm,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"confirm" | "reason">("confirm");

  const handleClose = () => {
    setReason("");
    setStep("confirm");
    onCancel();
  };

  const handleConfirmClick = () => {
    setStep("reason");
  };

  const handleSubmit = () => {
    onConfirm(reason);
    handleClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60 sm:max-w-md">
        {/* linear Header */}
        <div className="h-1 w-full bg-linear-to-r from-red-500 via-orange-500 to-red-600" />

        {step === "confirm" ? (
          <>
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  Cancel Order?
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This action will cancel the order and mark it as unavailable
                  for delivery.
                </DialogDescription>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 px-6 py-5">
              {/* Order Details */}
              <div className="space-y-3 rounded-xl border border-red-100/60 bg-red-50/40 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Order ID
                  </span>
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                    {order?.customOrderId || order._id?.slice(0, 10)}
                  </span>
                </div>
                <div className="h-px bg-red-100/50 dark:bg-red-900/20" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Customer
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {order?.billingDetails?.fullName || "Unknown"}
                  </span>
                </div>
                <div className="h-px bg-red-100/50 dark:bg-red-900/20" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Amount
                  </span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    ৳{order?.total}
                  </span>
                </div>
              </div>

              {/* Warning Message */}
              <div className="rounded-lg border border-amber-200/60 bg-amber-50/60 p-3.5 dark:border-amber-900/30 dark:bg-amber-900/10">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Cancelling will:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    Set order status to CANCELLED
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    Set delivery status to CANCELLED
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    This cannot be undone immediately
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex gap-3 mb-1 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-lg hover:cursor-pointer"
              >
                Keep Order
              </Button>
              <Button
                onClick={handleConfirmClick}
                disabled={isLoading}
                className=" hover:cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </span>
                ) : (
                  "Continue to Cancel"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Reason Step Header */}
            <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  Reason for Cancellation
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please provide a reason for cancelling this order
                </DialogDescription>
              </div>
            </div>

            {/* Reason Form */}
            <div className="space-y-4 px-6 py-5">
              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancellation Reason (Optional)
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for cancellation (e.g., Customer requested, Payment failed, Out of stock, etc.)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="resize-none rounded-lg border-gray-200 bg-gray-50/60 min-h-24 dark:border-gray-700 dark:bg-gray-800/60 focus:border-red-400 focus:ring-red-500 dark:focus:border-red-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {reason.length}/500
                </p>
              </div>

              {/* Order Summary */}
              <div className="rounded-lg border border-red-100/60 bg-red-50/40 p-3.5 dark:border-red-900/30 dark:bg-red-900/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400 mb-2">
                  Order will be cancelled
                </p>
                <div className="space-y-1.5 text-xs text-red-800 dark:text-red-300">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono font-bold">
                      {order?.customOrderId || order._id?.slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">
                      {order?.billingDetails?.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold">৳{order?.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex gap-3 mb-1 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
              <Button
                variant="outline"
                onClick={() => setStep("confirm")}
                disabled={isLoading}
                className="rounded-lg hover:cursor-pointer"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-lg hover:cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Cancelling...
                  </span>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
