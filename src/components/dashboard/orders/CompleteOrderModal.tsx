"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  User,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import type { Order } from "@/types/orders";
import { cn } from "@/lib/utils";

interface CompleteOrderModalProps {
  open: boolean;
  order: Order | null;
  loading: boolean;
  error: string | null;
  onComplete: (orderId: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function CompleteOrderModal({
  open,
  order,
  loading,
  error,
  onComplete,
  onOpenChange,
}: CompleteOrderModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-violet-500 via-purple-500 to-indigo-500" />

        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/20">
            <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Mark as Completed
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              Confirm that this order has been fully delivered and paid
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-gray-200/80 bg-gray-50/60 dark:border-gray-700/60 dark:bg-gray-800/40 divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <Package className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Order ID
                </p>
                <p className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {order.customOrderId || order._id?.slice(0, 14) + "..."}
                </p>
              </div>
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                ৳{order.total}
              </span>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 px-4 py-3">
              <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Customer
                </p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {order.billingDetails?.fullName}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {order.billingDetails?.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            {order.billingDetails?.phone && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Phone
                  </p>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {order.billingDetails.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Address */}
            {order.billingDetails?.address && (
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Address
                  </p>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {order.billingDetails.address}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Caution note */}
          <div className="flex items-start gap-2.5 rounded-lg border border-violet-200 bg-violet-50/60 px-3.5 py-3 dark:border-violet-800/50 dark:bg-violet-900/10">
            <AlertCircle className="h-4 w-4 shrink-0 text-violet-500 mt-0.5 dark:text-violet-400" />
            <p className="text-[11px] leading-relaxed text-violet-700 dark:text-violet-300">
              This will mark the order as <strong>COMPLETED</strong>. This
              action confirms the customer has received and paid for their
              items. This cannot be undone.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 dark:border-red-800/50 dark:bg-red-900/10">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <button
            onClick={() => onComplete(order._id)}
            disabled={loading}
            className={cn(
              "group relative overflow-hidden",
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white",
              "bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600",
              "transition-all duration-200 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1",
            )}
          >
            {/* shimmer */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
            />
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Completing…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as Completed
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
